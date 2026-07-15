'use client'

import { Grid, Tabs } from '@mantine/core'
import { IconInfoCircle, IconMap, IconFile, IconHammer, IconTool } from '@tabler/icons-react'

import ResidenceHeader from '@/app/components/residence/ResidenceHeader'
import ResidenceInfo from '@/app/components/residence/ResidenceInfo'
import ResidenceLocation from '@/app/components/residence/ResidenceLocation'
import Contracts from '@/app/components/residence/Contracts'
import Repairs from '@/app/components/residence/Repairs'
import Maintenances from '@/app/components/residence/Maintenances'

export default function ResidenceView() {
    return (
        <section>



            <ResidenceHeader />

            <Tabs defaultValue="info">

                <Tabs.List style={{ marginBottom: 15 }}>
                    <Tabs.Tab value="info" leftSection={<IconInfoCircle size={16} />}>
                        Στοιχεία
                    </Tabs.Tab>
                    <Tabs.Tab value="location" leftSection={<IconMap size={16} />}>
                        Τοποθεσία
                    </Tabs.Tab>
                    <Tabs.Tab value="contracts" leftSection={<IconFile size={16} />}>
                        Συμβόλαια
                    </Tabs.Tab>
                    <Tabs.Tab value="repairs" leftSection={<IconHammer size={16} />}>
                        Ιστορικό επισκευών
                    </Tabs.Tab>
                    <Tabs.Tab value="maintenances" leftSection={<IconTool size={16} />}>
                        Συντηρήσεις
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="info">
                    <ResidenceInfo />
                </Tabs.Panel>

                <Tabs.Panel value="location">
                    <ResidenceLocation />
                </Tabs.Panel>

                <Tabs.Panel value="contracts">
                    <Contracts />
                </Tabs.Panel>

                <Tabs.Panel value="repairs">
                    <Repairs />
                </Tabs.Panel>

                {/* <Tabs.Panel value="maintenances">
                            <Maintenances />
                        </Tabs.Panel> */}

            </Tabs>


        </section>
    )
}
