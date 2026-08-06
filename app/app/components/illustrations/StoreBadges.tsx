import { IconBrandApple, IconBrandGooglePlay } from '@tabler/icons-react'

export function AppStoreBadge({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2.5 rounded-xl border border-zinc-700 bg-black px-4 py-2 text-white transition hover:bg-zinc-800"
    >
      <IconBrandApple size={22} />
      <span className="flex flex-col items-start leading-tight">
        <span className="text-[10px] text-zinc-300">Download on the</span>
        <span className="text-lg font-semibold -mt-0.5">App Store</span>
      </span>
    </a>
  )
}

export function GooglePlayBadge({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2.5 rounded-xl border border-zinc-700 bg-black px-4 py-2 text-white transition hover:bg-zinc-800"
    >
      <IconBrandGooglePlay size={22} />
      <span className="flex flex-col items-start leading-tight">
        <span className="text-[10px] text-zinc-300">GET IT ON</span>
        <span className="text-lg font-semibold -mt-0.5">Google Play</span>
      </span>
    </a>
  )
}
