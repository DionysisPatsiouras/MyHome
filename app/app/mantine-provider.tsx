'use client';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import * as React from 'react';

export default function AppMantineProvider({
    children
}: Readonly<{
    children?: React.ReactNode;
}>) {
    return (
        <MantineProvider defaultColorScheme="auto">
            <Notifications />
            {children}
        </MantineProvider>
    );
}
