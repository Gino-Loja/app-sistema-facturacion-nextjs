'use client';
import { usePathname } from 'next/navigation'; // Hook para obtener la ruta actual
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Menu, Package2, Search, CircleUser } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import '../globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname(); // Obtener la ruta actual

    // Función para determinar si un enlace está activo
    const isActive = (path: string) => pathname === path;

    return (
        <NuqsAdapter>
            <div className="flex min-h-screen w-full flex-col bg-muted/40">
                <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
                    <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                        <Link href="#" className="flex items-center gap-2 text-lg font-semibold md:text-base">
                            <Package2 className="h-6 w-6" />
                            <span className="sr-only">EL propio</span>
                        </Link>
                        <Link
                            href="/"
                            className={`transition-colors hover:text-foreground ${isActive('/') ? 'text-foreground font-bold' : 'text-muted-foreground'
                                }`}
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="#"
                            className={`transition-colors hover:text-foreground ${isActive('#') ? 'text-foreground font-bold' : 'text-muted-foreground'
                                }`}
                        >
                            Orders
                        </Link>
                        <Link
                            href="/productos"
                            className={`transition-colors hover:text-foreground ${isActive('/productos') ? 'text-foreground font-bold bg-blue-500 p-2 rounded-md' : 'text-muted-foreground'
                                }`}
                        >
                            Productos
                        </Link>
                        <Link
                            href="/clientes"
                            className={`transition-colors hover:text-foreground  ${(isActive('/clientes') || isActive('/clientes/nuevo') || isActive('/clientes/editar')) ? 'text-foreground font-bold bg-blue-500 p-2 rounded-md' : 'text-muted-foreground'
                                }`}
                        >
                            Clientes
                        </Link>
                        <Link
                            href="/facturas"
                            className={`transition-colors hover:text-foreground ${isActive('/facturas') ? 'text-foreground font-bold' : 'text-muted-foreground'
                                }`}
                        >
                            Facturar
                        </Link>
                        <Link
                            href="/ver-facturas"
                            className={`transition-colors hover:text-foreground ${isActive('/ver-facturas') ? 'text-foreground font-bold' : 'text-muted-foreground'
                                }`}
                        >
                            Ver Facturas
                        </Link>
                    </nav>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left">
                            <nav className="grid gap-6 text-lg font-medium">
                                <Link href="#" className="flex items-center gap-2 text-lg font-semibold">
                                    <Package2 className="h-6 w-6" />
                                    <span className="sr-only">Acme Inc</span>
                                </Link>
                                <Link
                                    href="/"
                                    className={`hover:text-foreground ${isActive('/') ? 'text-foreground font-bold' : 'text-muted-foreground'
                                        }`}
                                >
                                    Dashboard
                                </Link>
                              
                                <Link
                                    href="#"
                                    className={`hover:text-foreground ${isActive('#') ? 'text-foreground font-bold' : 'text-muted-foreground'
                                        }`}
                                >
                                    Products
                                </Link>
                                <Link
                                    href="/clientes"
                                    className={`hover:text-foreground ${isActive('/clientes') ? 'text-foreground font-bold' : 'text-muted-foreground'
                                        }`}
                                >
                                    Clientes
                                </Link>
                                <Link
                                    href="/facturas"
                                    className={`hover:text-foreground ${isActive('/facturas') ? 'text-foreground font-bold' : 'text-muted-foreground' }`}
                                >
                                    Facturar
                                </Link>
                            </nav>
                        </SheetContent>
                    </Sheet>
                    <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                        <form className="ml-auto flex-1 sm:flex-initial">
                            <div className="relative">
                                {/* <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search products..."
                                    className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                                /> */}
                            </div>
                        </form>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="secondary" size="icon" className="rounded-full">
                                    <CircleUser className="h-5 w-5" />
                                    <span className="sr-only">Toggle user menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {/* Menú desplegable */}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {children}
            </div>
            <Toaster />
        </NuqsAdapter>
    );
}
