import Link from 'next/link'
import { Container, Group, SimpleGrid, Stack, Text, ThemeIcon } from '@mantine/core'
import { IconBuildingEstate, IconMail } from '@tabler/icons-react'

const columns = [
  {
    title: 'Προϊόν',
    links: [
      { label: 'Λειτουργίες', href: '#features' },
      { label: 'Πώς λειτουργεί', href: '#how-it-works' },
    ],
  },
  {
    title: 'Λογαριασμός',
    links: [
      { label: 'Σύνδεση', href: '/auth/sign-in' },
      { label: 'Δημιουργία λογαριασμού', href: '/auth/sign-up' },
    ],
  },
]

export function LandingFooter() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800">
      <Container size="lg" className="py-14">
        <SimpleGrid cols={{ base: 1, sm: 4 }} spacing="xl">
          <Stack gap="xs">
            <Group gap="xs">
              <ThemeIcon size={28} radius="md" variant="light" color="blue">
                <IconBuildingEstate size={16} />
              </ThemeIcon>
              <Text fw={700}>MyHome</Text>
            </Group>
            <Text size="sm" c="dimmed" maw={220}>
              Η διαχείριση των ακινήτων σου, απλή και οργανωμένη.
            </Text>
          </Stack>

          {columns.map((col) => (
            <Stack gap="xs" key={col.title}>
              <Text fw={600} size="sm">
                {col.title}
              </Text>
              {col.links.map((link) => (
                <Text
                  key={link.href}
                  component={Link}
                  href={link.href}
                  size="sm"
                  c="dimmed"
                  className="hover:!text-blue-500 transition-colors"
                >
                  {link.label}
                </Text>
              ))}
            </Stack>
          ))}

          <Stack gap="xs">
            <Text fw={600} size="sm">
              Επικοινωνία
            </Text>
            <Group gap={6}>
              <IconMail size={16} className="text-zinc-500" />
              <Text
                component="a"
                href="mailto:info@myhome.gr"
                size="sm"
                c="dimmed"
                className="hover:!text-blue-500 transition-colors"
              >
                info@myhome.gr
              </Text>
            </Group>
          </Stack>
        </SimpleGrid>

        <Group justify="space-between" mt={48} pt="lg" className="border-t border-zinc-200 dark:border-zinc-800">
          <Text size="xs" c="dimmed">
            © {new Date().getFullYear()} MyHome. Με επιφύλαξη παντός δικαιώματος.
          </Text>
        </Group>
      </Container>
    </footer>
  )
}
