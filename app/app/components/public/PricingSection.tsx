import Link from "next/link"
import { Badge, Button, Card, Container, Group, List, SimpleGrid, Stack, Text, Title, ThemeIcon } from '@mantine/core'
import { IconCircleCheck, IconSparkles } from '@tabler/icons-react'

const plans = [
  {
    name: 'Δωρεάν',
    price: '0€',
    period: '/μήνα',
    description: 'Για να ξεκινήσεις να οργανώνεις το πρώτο σου ακίνητο.',
    features: [
      '1 ακίνητο',
      'Βασική καταχώριση συμβολαίων',
      'Καταγραφή επισκευών',
    ],
    color: 'gray',
    highlighted: false,
  },
  {
    name: 'Βασικό',
    price: '6,99€',
    period: '/μήνα',
    description: 'Ιδανικό για ιδιοκτήτες με λίγα ακίνητα υπό διαχείριση.',
    features: [
      'Έως 5 ακίνητα',
      'Συμβόλαια & ενοικιαστές',
      'Επισκευές & συντηρήσεις',
      'Στοιχεία επαγγελματιών',
    ],
    color: 'blue',
    highlighted: true,
  },
  {
    name: 'Pro',
    price: '9,99€',
    period: '/μήνα',
    description: 'Για ιδιοκτήτες με μεγαλύτερο χαρτοφυλάκιο ακινήτων.',
    features: [
      'Απεριόριστα ακίνητα',
      'Όλα τα χαρακτηριστικά του Βασικού',
      'Τοποθεσία σε χάρτη',
      'Προτεραιότητα στην υποστήριξη',
    ],
    color: 'grape',
    highlighted: false,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <Container size="lg" className="py-20 sm:py-28">
        <Stack align="center" gap="xs" mb={48}>
          <Title order={2} ta="center" className="text-2xl sm:text-3xl font-bold">
            Διάλεξε το πλάνο σου
          </Title>
          <Text ta="center" c="dimmed" maw={480}>
            Ξεκίνα δωρεάν και αναβάθμισε όποτε το χαρτοφυλάκιό σου μεγαλώσει.
          </Text>
        </Stack>

        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
          {plans.map(({ name, price, period, description, features, color, highlighted }) => (
            <Card
              key={name}
              withBorder
              radius="lg"
              padding="lg"
              className={
                highlighted
                  ? 'h-full border-2 border-blue-500 shadow-xl shadow-blue-500/10 sm:-translate-y-2'
                  : 'h-full border-t-4 border-t-zinc-200 dark:border-t-zinc-800'
              }
            >
              <Stack gap="lg" h="100%">
                {highlighted && (
                  <Badge
                    size="sm"
                    variant="gradient"
                    gradient={{ from: 'blue', to: 'grape', deg: 90 }}
                    leftSection={<IconSparkles size={12} />}
                    className="self-start"
                  >
                    Δημοφιλές
                  </Badge>
                )}

                <div>
                  <Text fw={600} size="lg">
                    {name}
                  </Text>
                  <Text c="dimmed" size="sm" mt={4}>
                    {description}
                  </Text>
                </div>

                <Group align="baseline" gap={4}>
                  <Text fw={800} style={{ fontSize: '30px' }}>
                    {price}
                  </Text>
                  <Text c="dimmed">
                    {period}
                  </Text>
                </Group>

                <List spacing="sm" className="flex-1">
                  {features.map((feature) => (
                    <List.Item
                      key={feature}
                      icon={
                        <ThemeIcon color={color} variant="light" size={22} radius="xl">
                          <IconCircleCheck size={14} />
                        </ThemeIcon>
                      }
                    >
                      {feature}
                    </List.Item>
                  ))}
                </List>

                <Button
                  component={Link}
                  href="/auth/sign-up"
                  radius="md"
                  fullWidth
                  variant={highlighted ? 'gradient' : 'default'}
                  gradient={highlighted ? { from: 'blue', to: 'grape', deg: 90 } : undefined}
                >
                  Ξεκίνα τώρα
                </Button>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      </Container>
    </section>
  )
}
