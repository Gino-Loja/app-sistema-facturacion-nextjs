import { Factura } from "@/types";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Factura>[] = [
  {
    accessorKey: "numero",
    header: "Número",
  },
  {
    accessorKey: "codigo",
    header: "Código",
  },
  {
    accessorKey: "fecha",
    header: "Fecha",
    cell: ({ row }) => new Date(row.getValue("fecha")).toLocaleDateString()
  },
  {
    accessorKey: "hora",
    header: "Hora",
  },
  {
    accessorKey: "importe_total",
    header: "Total",
    cell: ({ row }) => `$${parseFloat(row.getValue("importe_total")).toFixed(2)}`
  }
];