'use client'

import NuevoProducto from "@/components/pages/productos/agregarCliente"
import { Button } from "@/components/ui/button"
import { Axios } from "@/core/axios"
import { AxiosResponse } from "axios"
import { ChevronLeft } from "lucide-react"
import useSWR from 'swr'
import { Producto } from "@/types"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useDataStore } from "@/core/zustand"
import ProductCardSkeleton from "@/components/pages/productos/ProductCardSkeleton"



export default function Productos() {

    const router = useRouter();
    const { setData, setType } = useDataStore();

    const getfetcher = async (url: string): Promise<Producto[]> => {
        const response: AxiosResponse<Producto[]> = await Axios.get(url);
        return response.data;
    };

    const { data, error, isLoading } = useSWR<Producto[]>('/productos/', getfetcher);

    if (isLoading) {
        return (
            <div className="grid grid-cols-3 gap-3 space-y-4 p-4">
                                   { Array(10).fill(0).map((_, index) => <ProductCardSkeleton key={index} />)}

                    </div>
        )
    }


    if (!data) {
        return <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">

            <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
                <div className="flex flex-col items-center gap-1 space-y-4">
                    <h3 className="text-2xl font-bold tracking-tight">
                        No tienes productos aún
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Crea un nuevo producto para comenzar
                    </p>

                    <div className="mx-auto">
                        <NuevoProducto />
                    </div>
                </div>
            </div>
        </main>
    }

    return (

        <div>
            <div className="flex items-center px-4 md:px-6 py-3 gap-4">
                <Button variant="outline" size="icon" className="h-7 w-7">
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Back</span>
                </Button>
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                    Inicio
                </h1>

                <div className="hidden items-center gap-2 md:ml-auto md:flex">

                    <NuevoProducto />
                </div>
            </div>


            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4 md:px-6 py-12">
                {/* {isLoading && <div className="flex flex-1 items-center justify-center">
                    <div className="flex flex-col items-center gap-1 space-y-4">
                        <h3 className="text-2xl font-bold tracking-tight">
                            Cargando productos
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Espera un momento mientras cargamos los productos
                        </p>

                        <div className="mx-auto">
                            <NuevoProducto />
                        </div>
                    </div>
                </div>} */}
                {


                    data?.map((producto) => (
                        <div key={producto.id} className="bg-white rounded-lg shadow-lg overflow-hidden dark:bg-gray-950">
                            <Image
                                src={producto.imagen || "/placeholder.svg"}
                                alt="Product 1"
                                width={600}
                                height={400}
                                className="w-full h-60 object-cover"
                                style={{ aspectRatio: "600/400", objectFit: "cover" }}
                            />
                            <div className="p-6 space-y-4">
                                <h3 className="text-xl font-bold">{producto.nombre}</h3>
                                <p className="text-gray-500 dark:text-gray-400">{producto.descripcion}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-2xl font-bold">${producto.precio_unidad}</span>
                                    <span className="text-gray-500 dark:text-gray-400">Stock: {producto.stock}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span
                                        className="text-gray-500 dark:text-gray-400">Categoria: {producto.categoria}</span>
                                    <Button onClick={() => {
                                        setData(producto)
                                        setType('update')
                                        router.push(`/productos/${producto.id}`)
                                    }} size="sm">Editar</Button>
                                </div>
                            </div>
                        </div>
                    ))}
            </section>
        </div>

    )
}

