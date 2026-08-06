import Link from "next/link"
import { Badge, Button, Container, Grid, Group, Stack, Text, Title } from '@mantine/core'
import { IconArrowRight } from '@tabler/icons-react'
import { AppMockup } from '../illustrations/AppMockup'
import { DesktopMockup } from '../illustrations/DesktopMockup'
import { AppStoreBadge, GooglePlayBadge } from '../illustrations/StoreBadges'

export function HeroSection() {
  return (
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

              <Group mt="xs">
                <AppStoreBadge href="https://apps.apple.com/app/REPLACE_WITH_APP_ID" />
                <GooglePlayBadge href="https://play.google.com/store/apps/details?id=REPLACE_WITH_PACKAGE_ID" />
              </Group>
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <div className="relative mx-auto flex justify-center py-6 pl-6 sm:pl-10">
              <DesktopMockup />
              <div className="absolute -bottom-6 -right-2 hidden sm:block sm:scale-[0.5] sm:origin-bottom-right">
                <AppMockup />
              </div>
            </div>
          </Grid.Col>
        </Grid>
      </Container>
    </section>
  )
}
