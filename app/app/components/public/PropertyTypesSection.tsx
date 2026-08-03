import Image from "next/image"
import { Container, SimpleGrid, Stack, Text, Title } from '@mantine/core'

const propertyTypes = [
  { seed: 'myhome-apartment-1', label: 'Διαμέρισμα, Κολωνάκι' },
  { seed: 'myhome-apartment-2', label: 'Στούντιο, Παγκράτι' },
  { seed: 'myhome-apartment-3', label: 'Μεζονέτα, Γλυφάδα' },
]

export function PropertyTypesSection() {
  return (
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
          {propertyTypes.map(({ seed, label }) => (
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
  )
}
