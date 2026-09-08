import { useState, type ComponentType } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
    IconBell,
    IconChevronDown,
    IconLogout,
    IconMessage,
    IconMoon,
    IconSettings,
    IconSun,
} from '@tabler/icons-react'
import cx from 'clsx'
import {
    ActionIcon,
    Anchor,
    Avatar,
    Badge,
    Box,
    Button,
    Burger,
    Center,
    Container,
    Divider,
    Drawer,
    Group,
    Loader,
    Menu,
    ScrollArea,
    Tabs,
    Text,
    ThemeIcon,
    UnstyledButton,
    useMantineColorScheme,
    useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks'

import { deleteCookie } from '@/app/lib/utils/cookies'
import {
    formatNotificationTime,
    getNotificationPresentation,
} from '@/app/lib/constants/Notifications'
import { useNotifications } from '@/app/contexts/NotificationsContext'

import classes from '../styles/DashboardHeader.module.css'

const user = {
    name: 'Jane Spoonfighter',
    email: 'janspoon@fighter.dev',
    image: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png',
};

const navLinks = [
    { label: 'Αρχική', url: '/dashboard' },
    { label: 'Ακίνητα', url: '/dashboard/residences' },
    { label: 'Μισθωτήρια', url: '/dashboard/rentals' },
    { label: 'Ενοικιαστές', url: '/dashboard/tenants' },
    { label: 'Τεχνικοί', url: '/dashboard/technicians' },
];

type UserMenuEntry =
    | { type: 'label'; label: string }
    | { type: 'divider' }
    | {
        type: 'item';
        label: string;
        icon: ComponentType<{ size?: number; color?: string; stroke?: number }>;
        iconColor?: string;
        itemColor?: string;
        onClick?: () => void;
    };

function ThemeMenuIcon({ size, stroke }: { size?: number; color?: string; stroke?: number }) {
    return (
        <>
            <IconSun size={size} stroke={stroke} className="mantine-dark-hidden" />
            <IconMoon size={size} stroke={stroke} className="mantine-light-hidden" />
        </>
    );
}

export function DashboardHeader() {
    const theme = useMantineTheme()
    const { toggleColorScheme } = useMantineColorScheme()
    const pathname = usePathname()
    const router = useRouter()
    const [opened, { toggle, close }] = useDisclosure(false)
    const [userMenuOpened, setUserMenuOpened] = useState(false)
    const {
        notifications,
        unreadCount,
        loading: notificationsLoading,
        error: notificationsError,
        markingIds,
        markAsRead,
        reload: reloadNotifications,
    } = useNotifications()
    const recentNotifications = notifications.slice(0, 5)

    const handleLogout = () => {
        deleteCookie('token')
        router.push('/auth/sign-in')
    }

    const activeLink = navLinks
        .filter((link) => pathname === link.url || pathname.startsWith(`${link.url}/`))
        .sort((a, b) => b.url.length - a.url.length)[0]

    const items = navLinks.map((link) => (
        <Tabs.Tab
            key={link.url}
            value={link.url}
            renderRoot={(props) => <Link href={link.url} {...props} />}
        >
            {link.label}
        </Tabs.Tab>
    ));

    const userMenuData: UserMenuEntry[] = [
        { type: 'item', label: 'Ο λογαριασμός μου', icon: IconMessage, iconColor: theme.colors.blue[6], onClick: () => router.push('/dashboard/account') },
        { type: 'label', label: 'Ρυθμίσεις' },
        { type: 'item', label: 'Εναλλαγή θέματος', icon: ThemeMenuIcon, onClick: () => toggleColorScheme() },
        { type: 'item', label: 'Ρυθμίσεις', icon: IconSettings },
        { type: 'item', label: 'Αποσύνδεση', icon: IconLogout, onClick: handleLogout },
        // { type: 'divider' },
        // { type: 'label', label: 'Ζώνη κινδύνου' },
        // { type: 'item', label: 'Παύση συνδρομής', icon: IconPlayerPause },
        // { type: 'item', label: 'Διαγραφή λογαριασμού', icon: IconTrash, itemColor: 'red' },
    ];

    const userMenuItems = userMenuData.map((entry, index) => {
        if (entry.type === 'label') {
            return <Menu.Label key={index}>{entry.label}</Menu.Label>;
        }
        if (entry.type === 'divider') {
            return <Menu.Divider key={index} />;
        }
        const Icon = entry.icon;
        return (
            <Menu.Item
                key={entry.label}
                color={entry.itemColor}
                leftSection={<Icon size={16} color={entry.iconColor} stroke={1.5} />}
                onClick={entry.onClick}
            >
                {entry.label}
            </Menu.Item>
        );
    });

    return (
        <div className={classes.header}>
            <Container className={classes.mainSection} size="md">
                <Group justify="space-between">
                    {/* <MantineLogo size={28} /> */}
                    logo

                    <Group gap="sm">
                        <Burger
                            opened={opened}
                            onClick={toggle}
                            hiddenFrom="sm"
                            size="sm"
                            aria-label="Toggle navigation"
                        />

                        <Menu
                            width={360}
                            position="bottom-end"
                            transitionProps={{ transition: 'pop-top-right' }}
                            withinPortal
                            zIndex={9999}
                            styles={{ dropdown: { maxWidth: 'calc(100vw - 24px)' } }}
                        >
                            <Menu.Target>
                                <ActionIcon
                                    className={classes.notificationButton}
                                    variant="subtle"
                                    color="gray"
                                    size="lg"
                                    radius="xl"
                                    aria-label={`Ειδοποιήσεις (${unreadCount} νέες)`}
                                    title="Ειδοποιήσεις"
                                >
                                    <IconBell size={21} stroke={1.7} />
                                    {unreadCount > 0 && (
                                        <span className={classes.notificationBadge} aria-hidden="true">
                                            {unreadCount}
                                        </span>
                                    )}
                                </ActionIcon>
                            </Menu.Target>

                            <Menu.Dropdown>
                                <Menu.Label>
                                    <Group justify="space-between" wrap="nowrap">
                                        <Text size="sm" fw={600}>Ειδοποιήσεις</Text>
                                        <Badge
                                            size="sm"
                                            variant="light"
                                            color={unreadCount > 0 ? 'red' : 'gray'}
                                        >
                                            {unreadCount > 0 ? `${unreadCount} νέες` : 'Καμία νέα'}
                                        </Badge>
                                    </Group>
                                </Menu.Label>
                                <Menu.Divider />

                                <ScrollArea.Autosize mah={420} type="auto">
                                    {notificationsLoading && (
                                        <Center py="lg">
                                            <Loader size="sm" />
                                        </Center>
                                    )}

                                    {!notificationsLoading && notificationsError && (
                                        <Box p="md" ta="center">
                                            <Text size="xs" c="red">
                                                {notificationsError}
                                            </Text>
                                            <Button
                                                variant="subtle"
                                                size="compact-xs"
                                                mt="xs"
                                                onClick={() => void reloadNotifications()}
                                            >
                                                Δοκιμή ξανά
                                            </Button>
                                        </Box>
                                    )}

                                    {!notificationsLoading && !notificationsError && recentNotifications.length === 0 && (
                                        <Text size="sm" c="dimmed" ta="center" py="lg">
                                            Δεν υπάρχουν ειδοποιήσεις
                                        </Text>
                                    )}

                                    {!notificationsLoading && !notificationsError && recentNotifications.map((notification) => {
                                        const presentation = getNotificationPresentation(notification.notification_type)
                                        const NotificationIcon = presentation.icon

                                        return (
                                            <Box
                                                key={notification.id}
                                                className={classes.notificationItem}
                                                data-read={notification.is_read || undefined}
                                            >
                                                <Group gap="sm" wrap="nowrap" align="flex-start">
                                                    <ThemeIcon
                                                        variant="light"
                                                        color={presentation.color}
                                                        size={34}
                                                        radius="xl"
                                                    >
                                                        <NotificationIcon size={18} stroke={1.6} />
                                                    </ThemeIcon>

                                                    <Box style={{ flex: 1, minWidth: 0 }}>
                                                        {notification.action_url ? (
                                                            <Anchor
                                                                component={Link}
                                                                href={notification.action_url}
                                                                size="sm"
                                                                fw={600}
                                                                c="inherit"
                                                                underline="hover"
                                                            >
                                                                {notification.title}
                                                            </Anchor>
                                                        ) : (
                                                            <Text size="sm" fw={600} lineClamp={1}>
                                                                {notification.title}
                                                            </Text>
                                                        )}
                                                        <Text size="xs" c="dimmed" lineClamp={2}>
                                                            {notification.message}
                                                        </Text>
                                                        <Text size="xs" c="blue" mt={3}>
                                                            {formatNotificationTime(notification.created_at)}
                                                        </Text>
                                                        {notification.is_read ? (
                                                            <Text size="xs" c="dimmed" mt={5}>
                                                                Διαβάστηκε
                                                            </Text>
                                                        ) : (
                                                            <Button
                                                                variant="subtle"
                                                                size="compact-xs"
                                                                mt={4}
                                                                px={0}
                                                                loading={markingIds.has(notification.id)}
                                                                onClick={() => void markAsRead(notification.id)}
                                                            >
                                                                Το έχω διαβάσει
                                                            </Button>
                                                        )}
                                                    </Box>
                                                </Group>
                                            </Box>
                                        );
                                    })}
                                </ScrollArea.Autosize>

                                <Menu.Divider />
                                <Menu.Item
                                    component={Link}
                                    href="/dashboard/notifications"
                                    color="blue"
                                    ta="center"
                                >
                                    Προβολή όλων
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>

                        <Menu
                            width={260}
                            position="bottom-end"
                            transitionProps={{ transition: 'pop-top-right' }}
                            onClose={() => setUserMenuOpened(false)}
                            onOpen={() => setUserMenuOpened(true)}
                            withinPortal
                            zIndex={9999}
                        >
                            <Menu.Target>
                                <UnstyledButton
                                    className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
                                >
                                    <Group gap={7}>
                                        <Avatar src={user.image} alt="" radius="xl" size={20} />
                                        <Text fw={500} size="sm" lh={1} mr={3}>
                                            {user.name}
                                        </Text>
                                        <IconChevronDown size={12} stroke={1.5} />
                                    </Group>
                                </UnstyledButton>
                            </Menu.Target>
                            <Menu.Dropdown>{userMenuItems}</Menu.Dropdown>
                        </Menu>
                    </Group>
                </Group>
            </Container>
            <Container size="md">
                <Tabs
                    value={activeLink?.url ?? null}
                    variant="outline"
                    visibleFrom="sm"
                    classNames={{
                        root: classes.tabs,
                        list: classes.tabsList,
                        tab: classes.tab,
                    }}
                >
                    <Tabs.List>{items}</Tabs.List>
                </Tabs>
            </Container>

            <Drawer
                opened={opened}
                onClose={close}
                size="100%"
                padding="md"
                title="Μενού"
                hiddenFrom="sm"
                zIndex={10000000000}
            >
                <ScrollArea h="calc(100vh - 80px" mx="-md">
                    <Divider my="sm" />
                    {navLinks.map((link) => (
                        <Link
                            href={link.url}
                            key={link.url}
                            className={classes.drawerLink}
                            onClick={close}
                        >
                            {link.label}
                        </Link>
                    ))}
                </ScrollArea>
            </Drawer>
        </div>
    );
}
