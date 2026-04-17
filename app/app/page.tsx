'use client'

import Image from "next/image";

import { useState } from 'react'
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

export default function Home() {


  const header = (
    <img alt="Card" src="https://primefaces.org/cdn/primereact/images/usercard.png" />
  );
  const footer = (
    <>
      <Button label="Save" icon="pi pi-check" />
      <Button label="Cancel" severity="secondary" icon="pi pi-times" style={{ marginLeft: '0.5em' }} />
    </>
  );

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">



      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">


        <div className="card flex justify-content-center">
          <Card title="Advanced Card" subTitle="Card subtitle" footer={footer} header={header} className="md:w-25rem">
            <p className="m-0">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae
              numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
}
