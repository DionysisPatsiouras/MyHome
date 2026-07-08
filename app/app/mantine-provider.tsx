'use client';
import { MantineProvider } from '@mantine/core';
import * as React from 'react';

export default function AppMantineProvider({
    children
}: Readonly<{
    children?: React.ReactNode;
}>) {
    return <MantineProvider>{children}</MantineProvider>;
}
