'use client'

// import { TabView, TabPanel } from 'primereact/tabview'

import ResidenceHeader from '@/app/components/residence/ResidenceHeader'
import ResidenceInfo from '@/app/components/residence/ResidenceInfo'
import ResidenceLocation from '@/app/components/residence/ResidenceLocation'
import Contracts from '@/app/components/residence/Contracts'
import Repairs from '@/app/components/residence/Repairs'
import Maintenances from '@/app/components/residence/Maintenances'

export default function ResidenceView() {
    return (
        <main className="grid col-12 lg:col-8 mx-auto">

            <ResidenceHeader />

            <div className="col-12">
                {/* <TabView>

                    <TabPanel header="Στοιχεία" leftIcon="pi pi-info-circle mr-2">
                        <ResidenceInfo />
                    </TabPanel>

                    <TabPanel header="Τοποθεσία" leftIcon="pi pi-map mr-2">
                        <ResidenceLocation />
                    </TabPanel>

                    <TabPanel header="Συμβόλαια" leftIcon="pi pi-file mr-2">
                        <Contracts />
                    </TabPanel>

                    <TabPanel header="Ιστορικό επισκευών" leftIcon="pi pi-hammer mr-2">
                        <Repairs />
                    </TabPanel>

                    <TabPanel header="Συντηρήσεις" leftIcon="pi pi-wrench mr-2">
                        <Maintenances />
                    </TabPanel>

                </TabView> */}
            </div>

        </main>
    )
}
