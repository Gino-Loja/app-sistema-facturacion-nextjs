'use client'
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem
    , DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useDataStore } from "@/core/zustand";
import { Cliente } from "@/types";

import { EllipsisVertical, UserCog } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Acciones({ data }: { data: Cliente }) {
    const { setData, setType } = useDataStore();
    const router = useRouter();

    return (
        <DropdownMenu >
            <DropdownMenuTrigger >
                <EllipsisVertical />
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-56 p-2 shadow-md bg-background rounded-box"
            >
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                <DropdownMenuItem

                    onClick={() => {
                        setData(data)
                        setType("update")

                        router.push(`clientes/${data.id}`);
                    }
                    }
                // onClick={() => navigator.clipboard.writeText(payment.id)}
                >
                    <UserCog />Editar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}