import { useState, type ComponentType } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    IconChevronDown,
    IconLogout,
    IconMessage,
    IconMoon,
    IconPlayerPause,
    IconSettings,
    IconSun,
    IconTrash,
} from '@tabler/icons-react'
import cx from 'clsx'
import {
    Avatar,
    Burger,
    Container,
    Divider,
    Drawer,
    Group,
    Menu,
    ScrollArea,
    Tabs,
    Text,
    UnstyledButton,
    useMantineColorScheme,
    useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks'

import classes from '../styles/DashboardHeader.module.css'

const user = {
    name: 'Jane Spoonfighter',
    email: 'janspoon@fighter.dev',
    image: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png',
};

const navLinks = [
    { label: 'Αρχική', url: '/dashboard' },
    { label: 'Ακίνητα', url: '/dashboard/residences' },
    { label: 'Τηλεφωνικός κατάλογος', url: '/dashboard/technicians' },
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
    const [opened, { toggle, close }] = useDisclosure(false)
    const [userMenuOpened, setUserMenuOpened] = useState(false)

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
        { type: 'item', label: 'Ο λογαριασμός μου', icon: IconMessage, iconColor: theme.colors.blue[6] },
        { type: 'label', label: 'Ρυθμίσεις' },
        { type: 'item', label: 'Εναλλαγή θέματος', icon: ThemeMenuIcon, onClick: () => toggleColorScheme() },
        { type: 'item', label: 'Ρυθμίσεις', icon: IconSettings },
        { type: 'item', label: 'Αποσύνδεση', icon: IconLogout },
        { type: 'divider' },
        { type: 'label', label: 'Ζώνη κινδύνου' },
        { type: 'item', label: 'Παύση συνδρομής', icon: IconPlayerPause },
        { type: 'item', label: 'Διαγραφή λογαριασμού', icon: IconTrash, itemColor: 'red' },
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