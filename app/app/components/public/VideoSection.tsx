import { Container, Stack, Text, Title } from '@mantine/core'

const YOUTUBE_VIDEO_ID = 'DCYmJDO2_IE'

export function VideoSection() {
  return (
    <section className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <Container size="lg" className="py-20 sm:py-28">
        <Stack align="center" gap="xs" mb={40}>
          <Title order={2} ta="center" className="text-2xl sm:text-3xl font-bold">
            Δες το σε δράση
          </Title>
          <Text ta="center" c="dimmed" maw={480}>
            Ένα σύντομο βίντεο για το πώς λειτουργεί η πλατφόρμα.
          </Text>
        </Stack>

        <div className="mx-auto max-w-5xl aspect-video overflow-hidden rounded-lg shadow-lg">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_VIDEO_ID}`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </Container>
    </section>
  )
}
