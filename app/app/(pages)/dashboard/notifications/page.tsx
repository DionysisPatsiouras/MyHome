'use client'

import Link from 'next/link'
import { IconBellOff, IconCheck } from '@tabler/icons-react'
import {
    Anchor,
    Badge,
    Box,
    Button,
    Card,
    Divider,
    Group,
    Stack,
    Text,
    ThemeIcon,
    Title,
} from '@mantine/core'

import {
    formatNotificationTime,
    getNotificationPresentation,
} from '@/app/lib/constants/Notifications'
import { useNotifications } from '@/app/contexts/NotificationsContext'
import { DataNotFound } from '@/app/components/layout/DataNotFound'
import { PageLoader } from '@/app/components/layout/PageLoader'

export default function NotificationsPage() {
    const {
        notifications,
        unreadCount,
        loading,
        error,
        markingIds,
        markAsRead,
        reload,
    } = useNotifications()

    if (loading) return <PageLoader />

    return (
        <Stack gap="lg">
            <Group justify="space-between" align="flex-end" wrap="wrap" gap="sm">
                <div>
                    <Title order={2}>Ειδοποιήσεις</Title>
                    <Text c="dimmed" size="sm">
                        Όλες οι πρόσφατες ενημερώσεις για τα ακίνητά σου.
                    </Text>
                </div>

                <Badge variant="light" color={unreadCount > 0 ? 'red' : 'gray'} size="lg">
                    {unreadCount > 0 ? `${unreadCount} νέες` : 'Καμία νέα'}
                </Badge>
            </Group>

            {error && (
                <Card withBorder radius="lg">
                    <DataNotFound
                        title="Αδυναμία φόρτωσης"
                        description={error}
                        icon={IconBellOff}
                        actionLabel="Δοκιμή ξανά"
                        onAction={() => void reload()}
                    />
                </Card>
            )}

            {!error && notifications.length === 0 && (
                <Card withBorder radius="lg">
                    <DataNotFound
                        title="Δεν υπάρχουν ειδοποιήσεις"
                        description="Οι νέες ενημερώσεις θα εμφανιστούν εδώ."
                        icon={IconBellOff}
                    />
                </Card>
            )}

            {!error && notifications.length > 0 && (
                <Card withBorder radius="lg" padding={0}>
                    {notifications.map((notification, index) => {
                        const presentation = getNotificationPresentation(notification.notification_type)
                        const NotificationIcon = presentation.icon

                        return (
                            <Box
                                key={notification.id}
                                style={{ opacity: notification.is_read ? 0.62 : 1, transition: 'opacity 120ms ease' }}
                            >
                                {index > 0 && <Divider />}

                                <Group p="lg" gap="md" wrap="nowrap" align="flex-start">
                                    <ThemeIcon
                                        variant="light"
                                        color={presentation.color}
                                        size={42}
                                        radius="xl"
                                        style={{ flexShrink: 0 }}
                                    >
                                        <NotificationIcon size={21} stroke={1.6} />
                                    </ThemeIcon>

                                    <Box style={{ flex: 1, minWidth: 0 }}>
                                        <Group justify="space-between" gap="sm" align="flex-start" wrap="wrap">
                                            {notification.action_url ? (
                                                <Anchor
                                                    component={Link}
                                                    href={notification.action_url}
                                                    fw={600}
                                                    c="inherit"
                                                    underline="hover"
                                                >
                                                    {notification.title}
                                                </Anchor>
                                            ) : (
                                                <Text fw={600}>{notification.title}</Text>
                                            )}
                                            <Button
                                                variant={notification.is_read ? 'default' : 'light'}
                                                color={notification.is_read ? 'gray' : 'blue'}
                                                size="xs"
                                                leftSection={<IconCheck size={14} />}
                                                disabled={notification.is_read}
                                                loading={markingIds.has(notification.id)}
                                                onClick={() => void markAsRead(notification.id)}
                                            >
                                                {notification.is_read ? 'Διαβάστηκε' : 'Το έχω διαβάσει'}
                                            </Button>
                                        </Group>
                                        <Text size="sm" c="dimmed" mt={3}>
                                            {notification.message}
                                        </Text>
                                        <Text size="xs" c="blue" mt="xs">
                                            {formatNotificationTime(notification.created_at)}
                                        </Text>
                                    </Box>
                                </Group>
                            </Box>
                        );
                    })}
                </Card>
            )}
        </Stack>
    );
}
