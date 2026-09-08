'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { notifications as notificationToasts } from '@mantine/notifications'

import { NotificationRoutes } from '@/app/lib/Routes'
import { getCookie } from '@/app/lib/utils/cookies'
import type { UserNotification } from '@/app/lib/types'

const NOTIFICATIONS_SUBPROTOCOL = 'myhome.notifications'
const MAX_RECONNECT_DELAY = 30_000

type NotificationSocketMessage =
    | {
        type: 'notification.created' | 'notification.updated';
        notification: UserNotification;
    }
    | {
        type: 'notification.deleted';
        notification_id: number;
    }
    | {
        type: 'notifications.read_all';
        notification_ids: number[];
        read_at: string;
    }

interface NotificationsContextValue {
    notifications: UserNotification[];
    unreadCount: number;
    loading: boolean;
    error: string | null;
    markingIds: ReadonlySet<number>;
    markAsRead: (notificationId: number) => Promise<void>;
    reload: () => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null)

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
    const [notifications, setNotifications] = useState<UserNotification[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [markingIds, setMarkingIds] = useState<Set<number>>(() => new Set())

    const reload = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            const token = getCookie('token')
            const response = await fetch(NotificationRoutes.list, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!response.ok) throw new Error('Failed to fetch notifications')

            const data: unknown = await response.json()
            if (!Array.isArray(data)) throw new Error('Invalid notifications response')

            setNotifications(data as UserNotification[])
        } catch (fetchError) {
            console.error(fetchError)
            setNotifications([])
            setError('Δεν ήταν δυνατή η φόρτωση των ειδοποιήσεων.')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        void reload()
    }, [reload])

    useEffect(() => {
        const token = getCookie('token')
        if (!token || !NotificationRoutes.socket) return

        let socket: WebSocket | null = null
        let reconnectTimer: ReturnType<typeof setTimeout> | null = null
        let reconnectAttempts = 0
        let hasConnected = false
        let shouldReconnect = true

        const connect = () => {
            socket = new WebSocket(
                NotificationRoutes.socket,
                [NOTIFICATIONS_SUBPROTOCOL, token],
            )

            socket.onopen = () => {
                reconnectAttempts = 0

                if (hasConnected) void reload()
                hasConnected = true
            }

            socket.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data) as NotificationSocketMessage

                    if (message.type === 'notification.created') {
                        setNotifications((currentNotifications) => [
                            message.notification,
                            ...currentNotifications.filter(({ id }) => id !== message.notification.id),
                        ])
                        notificationToasts.show({
                            color: 'blue',
                            title: message.notification.title,
                            message: message.notification.message,
                        })
                        return
                    }

                    if (message.type === 'notification.updated') {
                        setNotifications((currentNotifications) => currentNotifications.map((notification) => (
                            notification.id === message.notification.id
                                ? message.notification
                                : notification
                        )))
                        return
                    }

                    if (message.type === 'notification.deleted') {
                        setNotifications((currentNotifications) => currentNotifications.filter(
                            ({ id }) => id !== message.notification_id,
                        ))
                        return
                    }

                    if (message.type === 'notifications.read_all') {
                        const readIds = new Set(message.notification_ids)
                        setNotifications((currentNotifications) => currentNotifications.map((notification) => (
                            readIds.has(notification.id)
                                ? { ...notification, is_read: true, read_at: message.read_at }
                                : notification
                        )))
                    }
                } catch (socketError) {
                    console.error('Invalid notification WebSocket message', socketError)
                }
            }

            socket.onerror = () => socket?.close()

            socket.onclose = (event) => {
                if (!shouldReconnect || event.code === 4401) return

                const delay = Math.min(
                    1000 * (2 ** reconnectAttempts),
                    MAX_RECONNECT_DELAY,
                )
                reconnectAttempts += 1
                reconnectTimer = setTimeout(connect, delay)
            }
        }

        connect()

        return () => {
            shouldReconnect = false
            if (reconnectTimer) clearTimeout(reconnectTimer)
            socket?.close()
        }
    }, [reload])

    const markAsRead = useCallback(async (notificationId: number) => {
        const notification = notifications.find(({ id }) => id === notificationId)
        if (!notification || notification.is_read || markingIds.has(notificationId)) return

        setMarkingIds((currentIds) => new Set(currentIds).add(notificationId))
        setError(null)

        try {
            const token = getCookie('token')
            const response = await fetch(NotificationRoutes.detail(notificationId), {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ is_read: true }),
            })

            if (!response.ok) throw new Error('Failed to mark notification as read')

            const updatedNotification = await response.json() as UserNotification
            setNotifications((currentNotifications) => currentNotifications.map((current) => (
                current.id === notificationId ? updatedNotification : current
            )))
        } catch (updateError) {
            console.error(updateError)
            notificationToasts.show({
                color: 'red',
                title: 'Σφάλμα',
                message: 'Δεν ήταν δυνατή η ενημέρωση της ειδοποίησης.',
            })
        } finally {
            setMarkingIds((currentIds) => {
                const nextIds = new Set(currentIds)
                nextIds.delete(notificationId)
                return nextIds
            })
        }
    }, [markingIds, notifications])

    const unreadCount = notifications.filter(({ is_read }) => !is_read).length

    return (
        <NotificationsContext.Provider
            value={{ notifications, unreadCount, loading, error, markingIds, markAsRead, reload }}
        >
            {children}
        </NotificationsContext.Provider>
    )
}

export function useNotifications(): NotificationsContextValue {
    const context = useContext(NotificationsContext)

    if (!context) {
        throw new Error('useNotifications must be used inside NotificationsProvider')
    }

    return context
}
