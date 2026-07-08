'use client'

import Link from 'next/link'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'

export default function PageNotFound() {
    return (
        <div className="flex align-items-center justify-content-center min-h-screen surface-ground">
            <Card className="text-center shadow-4" style={{ maxWidth: '480px', width: '100%' }}>
                <div className="mb-4">
                    <i
                        className="pi pi-home"
                        style={{ fontSize: '4rem', color: 'var(--primary-color)', opacity: 0.3 }}
                    />
                </div>

                <h1
                    className="m-0 font-bold"
                    style={{ fontSize: '6rem', lineHeight: 1, color: 'var(--primary-color)' }}
                >
                    404
                </h1>

                <h2 className="mt-3 mb-2 text-900 font-semibold text-2xl">Page Not Found</h2>

                <p className="mt-0 mb-5 text-600 line-height-3">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>

                <Link href="/" style={{ textDecoration: 'none' }}>
                    <Button
                        label="Back to Home"
                        icon="pi pi-arrow-left"
                        iconPos="left"
                        size="large"
                    />
                </Link>
            </Card>
        </div>
    )
}
