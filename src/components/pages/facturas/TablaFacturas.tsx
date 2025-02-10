"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/table/data-table";
import { Invoice, InvoiceGenerationRequest } from "./types";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { InvoiceDetail } from "./InvoiceDetail";

interface TablaFacturasProps {
  data: Invoice[];
}

const ActionInvoice = ({ data }: { data: Invoice }) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon">
          <Eye className="h-4 w-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[96%]">
        <DrawerHeader>
          <DrawerTitle>Detalle de Factura</DrawerTitle>
          <DrawerDescription>
            Factura N° {data.factura_json.documentInfo.sequential}
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 overflow-y-auto">
          <InvoiceDetail invoice={data} />
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Cerrar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export function TablaFacturas({ data }: TablaFacturasProps) {
  return (
    <div className="container mx-auto py-4">
      <DataTable columns={columns} data={data} />
    </div>
  );
}

const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "fecha_emision",
    header: "Fecha",
    cell: ({ row }) => {
      const fecha = new Date(row.getValue("fecha_emision"));
      return fecha.toLocaleDateString();
    },
  },
  {
    header: "Cliente",
    cell: ({ row }) => {
      const facturaJson: InvoiceGenerationRequest = row.original.factura_json;
      return facturaJson?.customer?.customerName || "Sin cliente";
    },
  },
  {
    accessorKey: "estado",
    header: "Estado",
  },
  {
    header: "Descripcion",
    cell: ({ row }) => {
      const facturaJson: InvoiceGenerationRequest = row.original.factura_json;
      return facturaJson?.additionalInfo?.[0]?.value || "Sin descripcion";
    },
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => {
      const facturaJson: InvoiceGenerationRequest = row.original.factura_json;

      const total =  parseFloat(facturaJson?.payment?.totalAmount);
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(total);

      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    header: "Acciones",
    cell: (info) => {
      return (
        <ActionInvoice data={info.row.original}></ActionInvoice>
      );
    },
  },
];