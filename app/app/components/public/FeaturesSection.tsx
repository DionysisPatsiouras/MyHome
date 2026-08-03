import { Card, Container, SimpleGrid, Stack, Text, Title, ThemeIcon } from '@mantine/core'
import {
  IconBuildingEstate,
  IconFileText,
  IconTool,
  IconRefresh,
  IconMapPin,
  IconUsers,
} from '@tabler/icons-react'

const features = [
  {
    icon: IconBuildingEstate,
    title: 'Διαμερίσματα',
    description: 'Καταχώρισε όλα τα ακίνητά σου και έχε τα χαρακτηριστικά τους πάντα διαθέσιμα σε ένα μέρος.',
    color: 'blue',
  },
  {
    icon: IconFileText,
    title: 'Συμβόλαια',
    description: 'Παρακολούθησε ενοικιαστές, όρους και ημερομηνίες λήξης χωρίς να ψάχνεις χαρτιά.',
    color: 'grape',
  },
  {
    icon: IconTool,
    title: 'Επισκευές',
    description: 'Κατέγραψε βλάβες και επισκευές, με ιστορικό ανά ακίνητο.',
    color: 'orange',
  },
  {
    icon: IconRefresh,
    title: 'Συντηρήσεις',
    description: 'Όρισε περιοδικές συντηρήσεις και μην ξεχνάς ποτέ ξανά ένα σέρβις.',
    color: 'teal',
  },
  {
    icon: IconUsers,
    title: 'Επαγγελματίες',
    description: 'Κράτα στοιχεία επικοινωνίας τεχνικών και συνεργατών, έτοιμα όποτε τους χρειαστείς.',
    color: 'pink',
  },
  {
    icon: IconMapPin,
    title: 'Τοποθεσία σε χάρτη',
    description: 'Δες τα ακίνητά σου πάνω σε χάρτη και εντόπισέ τα με μια ματιά.',
    color: 'cyan',
  },
]

export function FeaturesSection() {
  return (
    <section id="features">
      <Container size="lg" className="py-20 sm:py-28">
        <Stack align="center" gap="xs" mb={48}>
          <Title order={2} ta="center" className="text-2xl sm:text-3xl font-bold">
            Όλα όσα χρειάζεσαι{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(90deg, #4dabf7, #22b8cf)' }}
            >
              για τα ακίνητά σου
            </span>
          </Title>
          <Text ta="center" c="dimmed" maw={480}>
            Ένα εργαλείο, σχεδιασμένο για ιδιοκτήτες που θέλουν έλεγχο χωρίς πολυπλοκότητα.
          </Text>
        </Stack>

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
          {features.map(({ icon: Icon, title, description, color }) => (
            <Card
              key={title}
              withBorder
              radius="lg"
              padding="lg"
              className="h-full cursor-pointer border-t-4 border-t-zinc-200 dark:border-t-zinc-800 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[var(--feature-color)]"
              style={{ '--feature-color': `var(--mantine-color-${color}-5)` } as React.CSSProperties}
            >
              <ThemeIcon size={44} radius="md" variant="light" color={color}>
                <Icon size={24} />
              </ThemeIcon>
              <Text fw={600} size="lg" mt="md">
                {title}
              </Text>
              <Text c="dimmed" size="sm" mt={4}>
                {description}
              </Text>
            </Card>
          ))}
        </SimpleGrid>
      </Container>
    </section>
  )
}
