import { Badge, Container, SimpleGrid, Stack, Text, Title, ThemeIcon } from '@mantine/core'
import { IconBuildingEstate, IconClipboardList, IconLayoutDashboard } from '@tabler/icons-react'

const steps = [
  {
    icon: IconBuildingEstate,
    title: 'Καταχώρισε τα ακίνητά σου',
    description: 'Πρόσθεσε διαμερίσματα με τα χαρακτηριστικά και την τοποθεσία τους σε λίγα λεπτά.',
    color: 'blue',
  },
  {
    icon: IconClipboardList,
    title: 'Συμπλήρωσε τα δεδομένα',
    description: 'Σύνδεσε συμβόλαια, ενοικιαστές, τεχνικούς και προγραμματισμένες συντηρήσεις σε κάθε ακίνητο.',
    color: 'grape',
  },
  {
    icon: IconLayoutDashboard,
    title: 'Παρακολούθα τα πάντα',
    description: 'Δες την εικόνα όλων των ακινήτων σου σε ένα dashboard, χωρίς σκόρπια χαρτιά και μηνύματα.',
    color: 'teal',
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <Container size="lg" className="py-20 sm:py-28">
        <Stack align="center" gap="xs" mb={56}>
          <Title order={2} ta="center" className="text-2xl sm:text-3xl font-bold">
            Πώς λειτουργεί
          </Title>
          <Text ta="center" c="dimmed" maw={480}>
            Τρία βήματα ανάμεσα σε εσένα και μια πλήρως οργανωμένη διαχείριση ακινήτων.
          </Text>
        </Stack>

        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl">
          {steps.map(({ icon: Icon, title, description, color }, index) => (
            <Stack key={title} align="center" ta="center" gap="sm">
              <div className="relative">
                <ThemeIcon size={56} radius="xl" variant="light" color={color}>
                  <Icon size={28} />
                </ThemeIcon>
                <Badge
                  size="sm"
                  circle
                  color={color}
                  className="!absolute -right-1 -top-1"
                >
                  {index + 1}
                </Badge>
              </div>
              <Text fw={600} size="lg">
                {title}
              </Text>
              <Text c="dimmed" size="sm" maw={280}>
                {description}
              </Text>
            </Stack>
          ))}
        </SimpleGrid>
      </Container>
    </section>
  )
}