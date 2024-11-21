'use client'

import { Button } from "@/components/ui/button";
import { useDataStore } from "@/core/zustand";
import { useRouter } from "next/navigation";
export default function NuevoProducto() {
    const router = useRouter();
    const { setData, setType } = useDataStore();
    return (
        <Button variant="default" onClick={() => {
            setData({})
            setType("create")
            router.push("/productos/nuevo")
        }} className="ml-auto ">
            Nuevo Producto
        </Button>
    )
}