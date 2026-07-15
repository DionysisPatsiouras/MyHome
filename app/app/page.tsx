'use client'
import Link from "next/link"
import {
  Badge,
  Button,
  Card,
  Container,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
  ThemeIcon,
} from '@mantine/core'
import {
  IconBuildingEstate,
  IconFileText,
  IconTool,
  IconRefresh,
  IconMapPin,
  IconUsers,
  IconArrowRight,
} from '@tabler/icons-react'

const features = [
  {
    icon: IconBuildingEstate,
    title: 'Διαμερίσματα',
    description: 'Καταχώρισε όλα τα ακίνητά σου και έχε τα χαρακτηριστικά τους πάντα διαθέσιμα σε ένα μέρος.',
  },
  {
    icon: IconFileText,
    title: 'Συμβόλαια',
    description: 'Παρακολούθησε ενοικιαστές, όρους και ημερομηνίες λήξης χωρίς να ψάχνεις χαρτιά.',
  },
  {
    icon: IconTool,
    title: 'Επισκευές',
    description: 'Κατέγραψε βλάβες και επισκευές, με ιστορικό ανά ακίνητο.',
  },
  {
    icon: IconRefresh,
    title: 'Συντηρήσεις',
    description: 'Όρισε περιοδικές συντηρήσεις και μην ξεχνάς ποτέ ξανά ένα σέρβις.',
  },
  {
    icon: IconUsers,
    title: 'Επαγγελματίες',
    description: 'Κράτα στοιχεία επικοινωνίας τεχνικών και συνεργατών, έτοιμα όποτε τους χρειαστείς.',
  },
  {
    icon: IconMapPin,
    title: 'Τοποθεσία σε χάρτη',
    description: 'Δες τα ακίνητά σου πάνω σε χάρτη και εντόπισέ τα με μια ματιά.',
  },
]

export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-black">
      <section className="relative overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
        <div
          className="pointer-events-none absolute -top-32 right-[-10%] h-96 w-96 rounded-full opacity-30 blur-3xl"
          style={{ background: 'radial-gradient(circle, #4dabf7, transparent 70%)' }}
        />
        <div
          className="pointer-events-none absolute bottom-[-20%] left-[-10%] h-80 w-80 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #22b8cf, transparent 70%)' }}
        />

        <Container size="md" className="relative py-24 sm:py-32">
          <Stack align="center" gap="lg">
            <Badge size="lg" variant="light" color="blue" radius="sm">
              Διαχείριση Ακινήτων
            </Badge>

            <Title
              order={1}
              ta="center"
              className="text-4xl sm:text-6xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50"
            >
              Το σπίτι σου,
              <br />
              πλήρως οργανωμένο.
            </Title>

            <Text ta="center" size="xl" c="dimmed" maw={560}>
              Ακίνητα, συμβόλαια, επισκευές και συντηρήσεις σε ένα σημείο.
              Σταμάτα να ψάχνεις χαρτιά και μηνύματα — όλα είναι εδώ.
            </Text>

            <Group mt="md">
              <Button
                component={Link}
                href="/auth/sign-up"
                size="lg"
                radius="md"
                rightSection={<IconArrowRight size={18} />}
              >
                Δημιουργία λογαριασμού
              </Button>
              <Button
                component={Link}
                href="/auth/sign-in"
                size="lg"
                radius="md"
                variant="default"
              >
                Σύνδεση
              </Button>
            </Group>
          </Stack>
        </Container>
      </section>

      <section>
        <Container size="lg" className="py-20 sm:py-28">
          <Stack align="center" gap="xs" mb={48}>
            <Title order={2} ta="center" className="text-2xl sm:text-3xl font-bold">
              Όλα όσα χρειάζεσαι για τα ακίνητά σου
            </Title>
            <Text ta="center" c="dimmed" maw={480}>
              Ένα εργαλείο, σχεδιασμένο για ιδιοκτήτες που θέλουν έλεγχο χωρίς πολυπλοκότητα.
            </Text>
          </Stack>

          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
            {features.map(({ icon: Icon, title, description }) => (
              <Card key={title} withBorder radius="lg" padding="lg" className="h-full">
                <ThemeIcon size={44} radius="md" variant="light" color="blue">
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

      <section className="border-t border-zinc-200 dark:border-zinc-800">
        <Container size="md" className="py-20 text-center">
          <Stack align="center" gap="lg">
            <Title order={2} className="text-2xl sm:text-3xl font-bold">
              Ξεκίνα σήμερα, δωρεάν
            </Title>
            <Text c="dimmed" maw={480}>
              Χρειάζεται λιγότερο από ένα λεπτό για να καταχωρίσεις το πρώτο σου ακίνητο.
            </Text>
            <Button
              component={Link}
              href="/auth/sign-up"
              size="lg"
              radius="md"
              rightSection={<IconArrowRight size={18} />}
            >
              Δημιουργία λογαριασμού
            </Button>
          </Stack>
        </Container>
      </section>
    </div>
  )
}
