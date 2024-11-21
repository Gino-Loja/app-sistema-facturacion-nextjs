
import "../globals.css";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <div className="h-screen	 content-center">
        {children}
    </div>
}