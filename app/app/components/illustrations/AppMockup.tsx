import { IconBuildingEstate, IconHome2, IconMapPin, IconTool, IconUsers } from '@tabler/icons-react'

const sidebarItems = [
  { icon: IconHome2, active: true },
  { icon: IconBuildingEstate, active: false },
  { icon: IconTool, active: false },
  { icon: IconUsers, active: false },
]

const propertyCards = [
  { name: 'Διαμέρισμα, Κολωνάκι', tag: 'Ενοικιασμένο' },
  { name: 'Στούντιο, Παγκράτι', tag: 'Διαθέσιμο' },
  { name: 'Μεζονέτα, Γλυφάδα', tag: 'Συντήρηση' },
]

export function AppMockup() {
  return (
    <div className="w-full max-w-md overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl shadow-blue-500/10 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center gap-2 border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
        <div className="ml-3 flex-1 rounded-md bg-zinc-100 px-3 py-1 text-[11px] text-zinc-400 dark:bg-zinc-800">
          myhome.app/dashboard
        </div>
      </div>

      <div className="flex">
        <div className="flex w-12 flex-col items-center gap-3 border-r border-zinc-100 py-4 dark:border-zinc-800">
          {sidebarItems.map(({ icon: Icon, active }, i) => (
            <div
              key={i}
              className={`grid h-8 w-8 place-items-center rounded-lg ${
                active
                  ? 'bg-blue-500 text-white'
                  : 'text-zinc-400 dark:text-zinc-500'
              }`}
            >
              <Icon size={16} />
            </div>
          ))}
        </div>

        <div className="flex-1 space-y-3 p-4">
          <div className="space-y-1">
            <div className="h-2.5 w-24 rounded bg-zinc-800 dark:bg-zinc-200" />
            <div className="h-2 w-16 rounded bg-zinc-200 dark:bg-zinc-700" />
          </div>

          <div className="space-y-2">
            {propertyCards.map((p) => (
              <div
                key={p.name}
                className="flex items-center justify-between rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-800/60"
              >
                <div className="flex items-center gap-2">
                  <div className="grid h-7 w-7 place-items-center rounded-md bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300">
                    <IconBuildingEstate size={14} />
                  </div>
                  <div className="h-2 w-24 rounded bg-zinc-300 dark:bg-zinc-600" />
                </div>
                <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-zinc-500 shadow-sm dark:bg-zinc-900 dark:text-zinc-400">
                  {p.tag}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-dashed border-zinc-200 px-3 py-2.5 text-zinc-400 dark:border-zinc-700">
            <IconMapPin size={14} />
            <div className="h-2 w-32 rounded bg-zinc-200 dark:bg-zinc-700" />
          </div>
        </div>
      </div>
    </div>
  )
}
