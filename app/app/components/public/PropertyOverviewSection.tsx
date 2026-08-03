import Image from "next/image"
import { Container, Grid, List, Stack, Text, Title, ThemeIcon } from '@mantine/core'
import { IconCircleCheck } from '@tabler/icons-react'

export function PropertyOverviewSection() {
  return (
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
  )
}
