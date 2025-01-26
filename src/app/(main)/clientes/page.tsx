
'use client'
import { columns } from "@/components/pages/clientes/columnas";
import NuevoCliente from "@/components/pages/clientes/TablaClientes";
import { DataTable } from "@/components/table/data-table"
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import useSWR from "swr";

export default function Clientes() {


    const fetcher = (url:string) => fetch(url).then((res) => res.json());

    const { data:clientes,  error, mutate } = useSWR('http://localhost:3030/clientes', fetcher);

    if (!clientes) {
        return (
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <div className="text-red-500">
                    Ocurrió un error al cargar los datos: {  "Error desconocido"}
                </div>
            </main>
        );
    }
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 divide-y divide-dashed">
            <div className="flex justify-between items-center">
                <div className="text-2xl font-bold">
                    Clientes Registrados
                </div>
                <div>
                    <NuevoCliente />
                </div>
            </div>



            <div >

                <DataTable data={clientes} columns={columns} />

            </div>
        </main>
    )
}

