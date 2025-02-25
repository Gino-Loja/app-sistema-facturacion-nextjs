'use client'
import {
  Activity,
  ArrowUpRight,
  CircleUser,
  CreditCard,
  DollarSign,
  Menu,
  Package2,
  Search,
  Users,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { use, useEffect, useState } from "react"
import { ClienteConFacturas, ClientesConMasFacturas, FechtlistaFacturasClientesSemanal, TotalFacturas, TotalFacturasHoy, TotalValorFacturas, TotalValorFacturasHoy } from "@/core/dashboard"

export interface Factura {
  fecha: string;           // Fecha de emisión (ejemplo: "2025-01-26")
  nombre: string;          // Nombre del usuario que emitió la factura
  cedula: string;          // Cédula del usuario
  estado_factura: string;  // Estado de la factura
  monto: number;           // Valor numérico del total de la factura
}
export default function Dashboard() {

  const [loading, setLoading] = useState(false)
  const [loadingListaClientes, setLoadingListaClientes] = useState(false)


  const [totalFacturas, setTotalFacturas] = useState(0)
  const [totalValorFacturas, setTotalValorFacturas] = useState(0)
  const [totalFacturasHoy, setTotalFacturasHoy] = useState(0)
  const [totalValorFacturasHoy, setTotalValorFacturasHoy] = useState(0)

  const [listaFacturasClientesSemanal, setListaFacturasClientesSemanal] = useState<Factura[]>([])

  const [listaClientesConMasFacturas, setListaClientesConMasFacturas] = useState<ClienteConFacturas[]>([])


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const totalFacturas = await TotalFacturas()
      const totalValorFacturas = await TotalValorFacturas()
      const totalFacturasHoy = await TotalFacturasHoy()
      const totalValorFacturasHoy = await TotalValorFacturasHoy()
      setTotalFacturas(totalFacturas[0]?.total_facturas)
      setTotalValorFacturas(totalValorFacturas[0]?.total_val)
      setTotalFacturasHoy(totalFacturasHoy[0]?.total_facturas)
      setTotalValorFacturasHoy(totalValorFacturasHoy[0]?.total_val == null ? 0 : totalValorFacturasHoy[0]?.total_val)
      setLoading(false)

    }
    fetchData()
  }, [])


  useEffect(() => {
    const fetchData = async () => {

      setLoadingListaClientes(true)

      const ListaFacturasClientesSemanal: Factura[] = await FechtlistaFacturasClientesSemanal()
      setListaFacturasClientesSemanal(ListaFacturasClientesSemanal)

      const ListaClientesConMasFacturas: ClienteConFacturas[] = await ClientesConMasFacturas()
      setListaClientesConMasFacturas(ListaClientesConMasFacturas)


      setLoadingListaClientes(false)

    }
    fetchData()
  }, [])

  const skeletonMetrics = () => {
    return (
      <div className="flex flex-col gap-4">
        <div className="h-4 w-1/4 rounded-md bg-gray-200 animate-pulse"></div>
        <div className="h-4 w-1/4 rounded-md bg-gray-200 animate-pulse"></div>
        <div className="h-4 w-full rounded-md bg-gray-200 animate-pulse"></div>
        <div className="h-4 w-full rounded-md bg-gray-200 animate-pulse"></div>
      </div>
    )
  }

  const skeletonTransactions = () => {
    return (
      <div className="flex flex-col gap-4">
        <div className="h-4 w-1/4 rounded-md bg-gray-200 animate-pulse"></div>
        <div className="h-4 w-1/4 rounded-md bg-gray-200 animate-pulse"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-4 w-full rounded-md bg-gray-200 animate-pulse"></div>
          <div className="h-4 w-full rounded-md bg-gray-200 animate-pulse"></div>
          <div className="h-6 w-full rounded-md bg-gray-200 animate-pulse"></div>
          <div className="h-6 w-full rounded-md bg-gray-200 animate-pulse"></div>
        </div>
      </div>
    )
  }



  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {
          loading ? skeletonMetrics() : <Card x-chunk="A card showing the total revenue in USD and the percentage difference from last month.">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total facturas
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalFacturas}</div>
              <p className="text-xs text-muted-foreground">
                Facturas emitidas
              </p>
            </CardContent>
          </Card>
        }

        {
          loading ? skeletonMetrics() : <Card x-chunk="A card showing the total subscriptions and the percentage difference from last month.">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total valor facturas
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold"> ${totalValorFacturas}</div>
              <p className="text-xs text-muted-foreground">
              </p>
            </CardContent>
          </Card>
        }

        {
          loading ? skeletonMetrics() : <Card x-chunk="A card showing the total sales and the percentage difference from last month.">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total facturas emitidas hoy</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalFacturasHoy}</div>
              <p className="text-xs text-muted-foreground">

              </p>
            </CardContent>
          </Card>
        }

        {
          loading ? skeletonMetrics() : <Card x-chunk="A card showing the total active users and the percentage difference from last hour.">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total valor facturas emitidas hoy</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold"> ${totalValorFacturasHoy}</div>
              <p className="text-xs text-muted-foreground">
              </p>
            </CardContent>
          </Card>
        }



      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card
          className="xl:col-span-2"
        >
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Transacciones</CardTitle>
              <CardDescription>
                Transacciones recientes de tu tienda.
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">

            </Button>
          </CardHeader>
          <CardContent>

            {
              listaFacturasClientesSemanal.length == 0 ?
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    No hay facturas emitidas esta semana
                  </p>
                </div>
                : <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Cédula</TableHead>
                      <TableHead className="hidden xl:table-column">Estado</TableHead>
                      <TableHead className="text-right">Monto</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {
                      loadingListaClientes ? skeletonTransactions() :

                      listaFacturasClientesSemanal.map((factura, index) => (
                        <TableRow key={index}>
                          <TableCell>{factura.fecha}</TableCell>
                          <TableCell>{factura.nombre}</TableCell>
                          <TableCell>{factura.cedula}</TableCell>
                          <TableCell className="hidden xl:table-column">
                            {factura.estado_factura}
                          </TableCell>
                          <TableCell className="text-right">{factura.monto.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
            }


          </CardContent>
        </Card>
        <Card x-chunk="A card showing a list of recent sales with customer names and email addresses.">
          <CardHeader>
            <CardTitle>Clientes con más facturas esta semana</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-8">
            {listaClientesConMasFacturas.map((cliente, index) => (
              <div key={index} className="flex items-center gap-4">
                <Avatar className="hidden h-9 w-9 sm:flex">
                  <AvatarImage src="/avatars/01.png" alt="Avatar" />
                  <AvatarFallback>{cliente.nombre.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    {cliente.nombre}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {cliente.cedula}
                  </p>
                </div>
                <div className="ml-auto font-medium">
                  {cliente.total_facturas} Facturas
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}