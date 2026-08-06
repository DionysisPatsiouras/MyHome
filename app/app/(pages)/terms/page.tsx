import type { Metadata } from 'next'
import { Container, Stack, Text, Title } from '@mantine/core'
import { LandingHeader } from '@/app/components/LandingHeader'
import { LandingFooter } from '@/app/components/LandingFooter'
import { TableOfContents } from '@/app/components/TableOfContents'

export const metadata: Metadata = {
  title: 'Όροι Χρήσης',
  description: 'Οι όροι χρήσης της πλατφόρμας MyHome.',
}

const sections = [
  {
    title: 'Αποδοχή των όρων',
    body: 'Με την πρόσβαση ή τη χρήση της πλατφόρμας MyHome, αποδέχεστε τους παρόντες όρους χρήσης στο σύνολό τους. Εάν δεν συμφωνείτε με κάποιον από τους όρους, παρακαλούμε να μην χρησιμοποιήσετε την υπηρεσία.',
  },
  {
    title: 'Περιγραφή της υπηρεσίας',
    body: 'Η MyHome παρέχει μια πλατφόρμα διαχείρισης ακινήτων που επιτρέπει στους χρήστες να καταχωρίζουν και να διαχειρίζονται ακίνητα, ενοικιαστές, συμβόλαια ενοικίασης, τεχνικούς και συντηρήσεις.',
  },
  {
    title: 'Λογαριασμός χρήστη',
    body: 'Είστε υπεύθυνοι για τη διατήρηση της εμπιστευτικότητας των στοιχείων του λογαριασμού σας και για όλες τις ενέργειες που πραγματοποιούνται μέσω αυτού. Οφείλετε να μας ενημερώσετε άμεσα σε περίπτωση μη εξουσιοδοτημένης χρήσης.',
  },
  {
    title: 'Υποχρεώσεις χρήστη',
    body: 'Αναλαμβάνετε να χρησιμοποιείτε την υπηρεσία σύμφωνα με την ισχύουσα νομοθεσία και να μην καταχωρίζετε ψευδή, παραπλανητικά ή δεδομένα τρίτων χωρίς την απαιτούμενη νόμιμη βάση.',
  },
  {
    title: 'Δεδομένα και απόρρητο',
    body: 'Η επεξεργασία των προσωπικών δεδομένων που καταχωρίζετε γίνεται σύμφωνα με την ισχύουσα νομοθεσία περί προστασίας δεδομένων. Παραμένετε υπεύθυνοι ως προς τα δεδομένα τρίτων (π.χ. ενοικιαστών) που καταχωρίζετε στην πλατφόρμα.',
  },
  {
    title: 'Περιορισμός ευθύνης',
    body: 'Η MyHome καταβάλλει εύλογες προσπάθειες για την ομαλή λειτουργία της υπηρεσίας, ωστόσο δεν εγγυάται αδιάλειπτη ή χωρίς σφάλματα λειτουργία και δεν φέρει ευθύνη για έμμεσες ζημίες που προκύπτουν από τη χρήση της πλατφόρμας.',
  },
  {
    title: 'Τροποποιήσεις',
    body: 'Διατηρούμε το δικαίωμα να τροποποιούμε τους παρόντες όρους ανά διαστήματα. Η συνέχιση της χρήσης της υπηρεσίας μετά από τυχόν αλλαγές συνιστά αποδοχή των νέων όρων.',
  },
  {
    title: 'Επικοινωνία',
    body: 'Για οποιαδήποτε ερώτηση σχετικά με τους παρόντες όρους, επικοινωνήστε μαζί μας στο info@myhome.gr.',
  },
]

const links = sections.map((section, index) => ({
  label: section.title,
  id: `section-${index + 1}`,
}))

export default function TermsPage() {
  return (
    <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-black">
      <LandingHeader />
      <Container size="lg" className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-10">
          <div className="hidden md:block">
            <div className="sticky top-24">
              <TableOfContents links={links} />
            </div>
          </div>

          <Stack gap="xl">
            <Stack gap={4}>
              <Title order={1}>Όροι Χρήσης</Title>
              <Text size="sm" c="dimmed">
                Τελευταία ενημέρωση: {new Date().toLocaleDateString('el-GR')}
              </Text>
            </Stack>

            {sections.map((section, index) => (
              <Stack gap={6} key={section.title} id={links[index].id} className="scroll-mt-24">
                <Title order={3} size="h4">
                  {section.title}
                </Title>
                <Text c="dimmed">{section.body}</Text>
              </Stack>
            ))}
          </Stack>
        </div>
      </Container>
      <LandingFooter />
    </div>
  )
}
