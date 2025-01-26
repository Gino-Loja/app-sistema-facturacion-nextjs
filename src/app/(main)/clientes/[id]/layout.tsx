'use client'
export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="mx-auto p-4">
            {children}
        </div>
    )



}