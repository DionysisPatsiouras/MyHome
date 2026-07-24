'use client'

import { notifications } from '@mantine/notifications'

type NotificationOption = {
    title?: string
    message?: string
}

export type CRUDNotificationOptions = {
    success?: NotificationOption
    error?: NotificationOption
}

export const useCRUD = () => {


    const GET = async (endpoint: string, unauthenticated = false, notificationOptions?: CRUDNotificationOptions | boolean) => {

        const token: any = await cookieStore.get("token")

        const config = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...(unauthenticated ? {} : { Authorization: `Bearer ${token?.value}` }),
            },
        };

        const res = await fetch(endpoint, config)
        const data = await res.json()

        if (!res.ok) {
            if (notificationOptions) {
                const options = typeof notificationOptions === 'boolean' ? {} : notificationOptions
                notifications.show({
                    color: 'red',
                    title: options.error?.title ?? 'Σφάλμα',
                    message: options.error?.message ?? 'Η ενέργεια απέτυχε'
                })
            }
            throw data
        }

        return data

    }



    const POST = async (endpoint: string, body: any, unauthenticated = false, notificationOptions?: CRUDNotificationOptions | boolean) => {

        const token: any = await cookieStore.get("token")

        const config = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                //  'Content-Type': 'multipart/form-data'
                ...(unauthenticated ? {} : { Authorization: `Bearer ${token?.value}` }),
            },
            body: JSON.stringify(body)
        };


        const res = await fetch(endpoint, config)
        const data = await res.json()

        if (notificationOptions) {

            const options = typeof notificationOptions === 'boolean' ? {} : notificationOptions

            if (!res.ok) {
                notifications.show({
                    color: 'red',
                    title: options.error?.title ?? 'Σφάλμα',
                    message: options.error?.message ?? 'Η ενέργεια απέτυχε'
                })
                throw data
            }

            notifications.show({
                color: 'green',
                title: options.success?.title ?? 'Επιτυχία',
                message: options.success?.message ?? 'Η ενέργεια ολοκληρώθηκε'
            })
        }

        return data

    }



    const PATCH = async (endpoint: string, body: any, unauthenticated = false, notificationOptions?: CRUDNotificationOptions | boolean) => {

        const token: any = await cookieStore.get("token")

        const config = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                ...(unauthenticated ? {} : { Authorization: `Bearer ${token?.value}` }),
            },
            body: JSON.stringify(body)
        };


        const res = await fetch(endpoint, config)
        const data = await res.json()

        if (notificationOptions) {

            const options = typeof notificationOptions === 'boolean' ? {} : notificationOptions

            if (!res.ok) {
                notifications.show({
                    color: 'red',
                    title: options.error?.title ?? 'Σφάλμα',
                    message: options.error?.message ?? 'Η ενέργεια απέτυχε'
                })
                throw data
            }

            notifications.show({
                color: 'green',
                title: options.success?.title ?? 'Επιτυχία',
                message: options.success?.message ?? 'Η ενέργεια ολοκληρώθηκε'
            })
        }

        return data

    }



    const DELETE = async (endpoint: string, unauthenticated = false, notificationOptions: CRUDNotificationOptions | boolean = true) => {

        const token: any = await cookieStore.get("token")

        const config = {
            method: 'DELETE',
            url: endpoint,
            headers: {

                "Content-Type": "application/json",
                ...(unauthenticated ? {} : { Authorization: `Bearer ${token?.value}` }),
            }
        }


        const res = await fetch(endpoint, config)
        const data = await res.json()

        if (notificationOptions) {

            const options = typeof notificationOptions === 'boolean' ? {} : notificationOptions

            if (!res.ok) {
                notifications.show({
                    color: 'red',
                    title: options.error?.title ?? 'Σφάλμα',
                    message: options.error?.message ?? 'Η διαγραφή απέτυχε'
                })
                throw data
            }

            notifications.show({
                color: 'green',
                title: options.success?.title ?? 'Επιτυχία',
                message: options.success?.message ?? 'Η διαγραφή ολοκληρώθηκε'
            })
        } else if (!res.ok) {
            throw data
        }

        return data

    }



    return { GET, POST, PATCH, DELETE }

}
