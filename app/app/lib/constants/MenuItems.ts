export const MenuItems = [
    {
        label: 'Διαμερίσματα',
        icon: 'pi pi-home',
        url: "/dashboard/residences"
    },
    {
        label: 'Συμβόλαια',
        icon: 'pi pi-file',
        url: "/dashboard/p"
    },
    {
        label: 'Επαγγελματίες',
        icon: 'pi pi-user',
        url: "/dashboard/technicians"
    },
    {
        label: 'Εργασίες',
        icon: 'pi pi-cog',
        items: [
            {
                label: 'Επισκεύες',
                icon: 'pi pi-wrench'
            },
            {
                label: 'Συντηρήσεις',
                icon: 'pi pi-replay'
            }
        ]
    }
];