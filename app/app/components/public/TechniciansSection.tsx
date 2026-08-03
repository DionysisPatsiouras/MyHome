import Image from "next/image"
import { Container, Grid, List, Stack, Text, Title, ThemeIcon } from '@mantine/core'
import { IconCircleCheck } from '@tabler/icons-react'

export function TechniciansSection() {
  return (
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
  )
}
