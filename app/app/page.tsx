'use client'
import Image from "next/image"
import Link from "next/link"
import {
  Badge,
  Button,
  Card,
  Container,
  Grid,
  Group,
  List,
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
  IconClipboardList,
  IconLayoutDashboard,
  IconCircleCheck,
} from '@tabler/icons-react'
import { LandingHeader } from './components/LandingHeader'
import { LandingFooter } from './components/LandingFooter'
import { AppMockup } from './components/illustrations/AppMockup'

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

export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-black">
      <LandingHeader />

      <section className="relative overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
        <div
          className="pointer-events-none absolute -top-32 right-[-10%] h-96 w-96 rounded-full opacity-30 blur-3xl"
          style={{ background: 'radial-gradient(circle, #4dabf7, transparent 70%)' }}
        />
        <div
          className="pointer-events-none absolute bottom-[-20%] left-[-10%] h-80 w-80 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #22b8cf, transparent 70%)' }}
        />
        <div
          className="pointer-events-none absolute top-1/3 left-1/2 h-72 w-72 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #be4bdb, transparent 70%)' }}
        />

        <Container size="lg" className="relative py-20 sm:py-28">
          <Grid align="center" gap={{ base: 40, md: 64 }}>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap="lg" align="flex-start">
                <Badge size="lg" variant="gradient" gradient={{ from: 'blue', to: 'grape', deg: 90 }} radius="sm">
                  Διαχείριση Ακινήτων
                </Badge>

                <Title
                  order={1}
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50"
                >
                  Το σπίτι σου,
                  <br />
                  <span
                    className="bg-clip-text text-transparent"
                    style={{ backgroundImage: 'linear-gradient(90deg, #4dabf7, #be4bdb)' }}
                  >
                    πλήρως οργανωμένο.
                  </span>
                </Title>

                <Text size="xl" c="dimmed" maw={480}>
                  Ακίνητα, συμβόλαια, επισκευές και συντηρήσεις σε ένα σημείο.
                  Σταμάτα να ψάχνεις χαρτιά και μηνύματα — όλα είναι εδώ.
                </Text>

                <Group mt="md">
                  <Button
                    component={Link}
                    href="/auth/sign-up"
                    size="lg"
                    radius="md"
                    variant="gradient"
                    gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
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
                    color="grape"
                  >
                    Σύνδεση
                  </Button>
                </Group>
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Group justify="center">
                <AppMockup />
              </Group>
            </Grid.Col>
          </Grid>
        </Container>
      </section>

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

      <section
        className="border-t border-zinc-200 bg-gradient-to-br from-blue-50 to-cyan-50 dark:border-zinc-800 dark:from-blue-950/20 dark:to-cyan-950/10"
      >
        <Container size="lg" className="py-20 sm:py-28">
          <Grid align="center" gap={{ base: 32, md: 64 }}>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <div className="relative h-64 w-full overflow-hidden rounded-2xl border border-zinc-200 shadow-xl shadow-blue-500/10 dark:border-zinc-800 sm:h-80">
                <Image
                  src="https://picsum.photos/seed/myhome-skyline/1200/800"
                  alt="Πολυκατοικία διαμερισμάτων"
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
              </div>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap="md">
                <Title order={2} className="text-2xl sm:text-3xl font-bold">
                  Όλα τα ακίνητά σου, σε μια εικόνα
                </Title>
                <Text c="dimmed" maw={440}>
                  Χωρίς σκόρπια αρχεία και σημειώματα. Κάθε ακίνητο κρατά τα δικά του
                  συμβόλαια, τεχνικούς και ιστορικό, πάντα ένα κλικ μακριά.
                </Text>
                <List spacing="sm">
                  <List.Item
                    icon={
                      <ThemeIcon color="teal" variant="light" size={22} radius="xl">
                        <IconCircleCheck size={14} />
                      </ThemeIcon>
                    }
                  >
                    Κεντρική εικόνα όλων των ακινήτων σε πραγματικό χρόνο
                  </List.Item>
                  <List.Item
                    icon={
                      <ThemeIcon color="orange" variant="light" size={22} radius="xl">
                        <IconCircleCheck size={14} />
                      </ThemeIcon>
                    }
                  >
                    Ιστορικό επισκευών και συντηρήσεων ανά διαμέρισμα
                  </List.Item>
                  <List.Item
                    icon={
                      <ThemeIcon color="grape" variant="light" size={22} radius="xl">
                        <IconCircleCheck size={14} />
                      </ThemeIcon>
                    }
                  >
                    Στοιχεία ενοικιαστών και συμβολαίων χωρίς χαρτιά
                  </List.Item>
                </List>
              </Stack>
            </Grid.Col>
          </Grid>
        </Container>
      </section>

      <section className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <Container size="lg" className="py-20 sm:py-28">
          <Stack align="center" gap="xs" mb={48}>
            <Title order={2} ta="center" className="text-2xl sm:text-3xl font-bold">
              Ακίνητα κάθε τύπου
            </Title>
            <Text ta="center" c="dimmed" maw={480}>
              Από στούντιο μέχρι μεζονέτες, το MyHome προσαρμόζεται σε κάθε ακίνητο που διαχειρίζεσαι.
            </Text>
          </Stack>

          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
            {[
              { seed: 'myhome-apartment-1', label: 'Διαμέρισμα, Κολωνάκι' },
              { seed: 'myhome-apartment-2', label: 'Στούντιο, Παγκράτι' },
              { seed: 'myhome-apartment-3', label: 'Μεζονέτα, Γλυφάδα' },
            ].map(({ seed, label }) => (
              <div key={seed} className="group relative h-56 overflow-hidden rounded-2xl border border-zinc-200 shadow-md dark:border-zinc-800">
                <Image
                  src={`https://picsum.photos/seed/${seed}/800/600`}
                  alt={label}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(min-width: 640px) 33vw, 100vw"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <Text size="sm" fw={600} c="white">
                    {label}
                  </Text>
                </div>
              </div>
            ))}
          </SimpleGrid>
        </Container>
      </section>

      <section
        className="border-t border-zinc-200 bg-gradient-to-br from-pink-50 to-purple-50 dark:border-zinc-800 dark:from-pink-950/20 dark:to-purple-950/10"
      >
        <Container size="lg" className="py-20 sm:py-28">
          <Grid align="center" gap={{ base: 32, md: 64 }}>
            <Grid.Col span={{ base: 12, md: 6 }} order={{ base: 2, md: 1 }}>
              <Stack gap="md">
                <Title order={2} className="text-2xl sm:text-3xl font-bold">
                  Τεχνικοί που εμπιστεύεσαι, ένα κλικ μακριά
                </Title>
                <Text c="dimmed" maw={440}>
                  Κράτα στοιχεία επικοινωνίας και ιστορικό συνεργασίας για κάθε επαγγελματία,
                  και ανάθεσε επισκευές χωρίς να ψάχνεις σε παλιά μηνύματα.
                </Text>
                <List spacing="sm">
                  <List.Item
                    icon={
                      <ThemeIcon color="pink" variant="light" size={22} radius="xl">
                        <IconCircleCheck size={14} />
                      </ThemeIcon>
                    }
                  >
                    Στοιχεία επικοινωνίας τεχνικών ανά ειδικότητα
                  </List.Item>
                  <List.Item
                    icon={
                      <ThemeIcon color="teal" variant="light" size={22} radius="xl">
                        <IconCircleCheck size={14} />
                      </ThemeIcon>
                    }
                  >
                    Ιστορικό επισκευών ανά τεχνικό και ακίνητο
                  </List.Item>
                </List>
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }} order={{ base: 1, md: 2 }}>
              <div className="relative h-64 w-full overflow-hidden rounded-2xl border border-zinc-200 shadow-xl shadow-pink-500/10 dark:border-zinc-800 sm:h-80">
                <Image
                  src="https://picsum.photos/seed/myhome-technician/1200/800"
                  alt="Τεχνικός σε επισκευή"
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
              </div>
            </Grid.Col>
          </Grid>
        </Container>
      </section>

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

      <section
        className="relative overflow-hidden border-t border-zinc-200 dark:border-zinc-800"
        style={{ background: 'linear-gradient(135deg, rgba(77,171,247,0.08), rgba(190,75,219,0.08))' }}
      >
        <Container size="md" className="relative py-20 text-center">
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
              variant="gradient"
              gradient={{ from: 'blue', to: 'grape', deg: 90 }}
              rightSection={<IconArrowRight size={18} />}
            >
              Δημιουργία λογαριασμού
            </Button>
          </Stack>
        </Container>
      </section>

      <LandingFooter />
    </div>
  )
}
