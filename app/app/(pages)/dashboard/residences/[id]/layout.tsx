import { ResidenceProvider } from '@/app/contexts/ResidenceContext'

export default function ResidenceLayout({ children }: { children: React.ReactNode }) {
    return <ResidenceProvider>{children}</ResidenceProvider>
}
