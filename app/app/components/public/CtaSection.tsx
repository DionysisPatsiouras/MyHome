import Link from "next/link"
import { Button, Container, Stack, Text, Title } from '@mantine/core'
import { IconArrowRight } from '@tabler/icons-react'

export function CtaSection() {
  return (
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
  )
}
