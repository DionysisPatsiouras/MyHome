'use client'
import Link from 'next/link'
import {
  Burger,
  Button,
  Container,
  Divider,
  Drawer,
  Group,
  ScrollArea,
  Text,
  ThemeIcon,
  UnstyledButton,
  useMantineColorScheme,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconBuildingEstate, IconMoon, IconSun } from '@tabler/icons-react'

const navLinks = [
  { label: 'Λειτουργίες', href: '#features' },
  { label: 'Πώς λειτουργεί', href: '#how-it-works' },
]

export function LandingHeader() {
  const { toggleColorScheme } = useMantineColorScheme()
  const [opened, { toggle, close }] = useDisclosure(false)

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80">
      <Container size="lg">
        <Group justify="space-between" py="sm">
          <UnstyledButton component={Link} href="/">
            <Group gap="xs">
              <ThemeIcon size={32} radius="md" variant="light" color="blue">
                <IconBuildingEstate size={19} />
              </ThemeIcon>
              <Text fw={700} size="lg">
                MyHome
              </Text>
            </Group>
          </UnstyledButton>

          <Group gap="lg" visibleFrom="sm">
            {navLinks.map((link) => (
              <Text
                key={link.href}
                component="a"
                href={link.href}
                size="sm"
                fw={500}
                c="dimmed"
                className="hover:!text-blue-500 transition-colors"
              >
                {link.label}
              </Text>
            ))}
          </Group>

          <Group gap="sm" visibleFrom="sm">
            <UnstyledButton
              onClick={() => toggleColorScheme()}
              aria-label="Εναλλαγή θέματος"
              className="grid h-9 w-9 place-items-center rounded-md text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <IconSun size={18} className="mantine-dark-hidden" />
              <IconMoon size={18} className="mantine-light-hidden" />
            </UnstyledButton>
            <Button component={Link} href="/auth/sign-in" variant="default" radius="md">
              Σύνδεση
            </Button>
            <Button component={Link} href="/auth/sign-up" radius="md">
              Δημιουργία λογαριασμού
            </Button>
          </Group>

          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" aria-label="Μενού" />
        </Group>
      </Container>

      <Drawer opened={opened} onClose={close} size="100%" padding="md" title="Μενού" hiddenFrom="sm" zIndex={1000}>
        <ScrollArea mx="-md">
          <Divider mb="sm" />
          <Group gap="xs" px="md" pb="md">
            {navLinks.map((link) => (
              <Text
                key={link.href}
                component="a"
                href={link.href}
                onClick={close}
                display="block"
                py="sm"
                fw={500}
              >
                {link.label}
              </Text>
            ))}
          </Group>
          <Divider mb="md" />
          <Group px="md" grow>
            <Button component={Link} href="/auth/sign-in" variant="default" radius="md" onClick={close}>
              Σύνδεση
            </Button>
            <Button component={Link} href="/auth/sign-up" radius="md" onClick={close}>
              Εγγραφή
            </Button>
          </Group>
        </ScrollArea>
      </Drawer>
    </header>
  )
}
