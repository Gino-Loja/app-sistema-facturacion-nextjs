
'use client'

import { Cliente } from "@/types"
import { ColumnDef } from "@tanstack/react-table"
import Acciones from "./Acciones"




export const columns: ColumnDef<Cliente>[] = [
    {
        accessorKey: "id",
        header: "Id",

    },
    {
        accessorKey: "cedula",
        header: "Cedula",
    },
    {
        accessorKey: "nombre",
        header: "Nombres",
    },
    {
        accessorKey: "estado",
        header: "Estado",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    { accessorKey: "nro_tel_princ", header: "Telefono" },
    { accessorKey: "direccion", header: "Direccion" },

    {
        id: "Acciones",
        enableHiding: true,
        cell: ({ row }) => {
            return (
                <Acciones data={row.original} />
            )

        },
    }
]