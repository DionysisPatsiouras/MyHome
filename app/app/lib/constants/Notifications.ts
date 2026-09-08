import type { TablerIcon } from '@tabler/icons-react'
import {
    IconBell,
    IconCalendarEvent,
    IconCash,
    IconFileText,
    IconTool,
    IconUserPlus,
} from '@tabler/icons-react'

import type { NotificationType } from '@/app/lib/types'

type NotificationPresentation = {
    icon: TablerIcon;
    color: string;
};

const notificationPresentations: Record<NotificationType, NotificationPresentation> = {
    general: {
        icon: IconBell,
        color: 'gray',
    },
    repair: {
        icon: IconTool,
        color: 'orange',
    },
    rental: {
        icon: IconFileText,
        color: 'blue',
    },
    payment: {
        icon: IconCash,
        color: 'green',
    },
    tenant: {
        icon: IconUserPlus,
        color: 'violet',
    },
    maintenance: {
        icon: IconCalendarEvent,
        color: 'cyan',
    },
}

export function getNotificationPresentation(type: NotificationType): NotificationPresentation {
    return notificationPresentations[type] ?? notificationPresentations.general
}

export function formatNotificationTime(value: string): string {
    const timestamp = Date.parse(value)
    if (Number.isNaN(timestamp)) return ''

    const differenceInSeconds = Math.round((timestamp - Date.now()) / 1000)
    const absoluteDifference = Math.abs(differenceInSeconds)

    if (absoluteDifference < 60) return 'Μόλις τώρα'

    const formatter = new Intl.RelativeTimeFormat('el', { numeric: 'auto' })

    if (absoluteDifference < 3600) {
        return formatter.format(Math.round(differenceInSeconds / 60), 'minute')
    }

    if (absoluteDifference < 86400) {
        return formatter.format(Math.round(differenceInSeconds / 3600), 'hour')
    }

    if (absoluteDifference < 2592000) {
        return formatter.format(Math.round(differenceInSeconds / 86400), 'day')
    }

    if (absoluteDifference < 31536000) {
        return formatter.format(Math.round(differenceInSeconds / 2592000), 'month')
    }

    return formatter.format(Math.round(differenceInSeconds / 31536000), 'year')
}
