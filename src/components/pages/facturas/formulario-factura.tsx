'use client'
import { useDataStore } from "@/core/zustand"
import { zodResolver } from "@hookform/resolvers/zod";
import { getLocalTimeZone, now, parseAbsoluteToLocal } from "@internationalized/date";
import { DateValue } from "@internationalized/date";
import { Controller, useForm } from "react-hook-form";
import { useAsyncList } from "@react-stately/data";
import { z } from "zod";

import { Check, Plus, Trash2, CalendarIcon, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { I18nProvider } from "@react-aria/i18n";
import React from "react";

// Importaciones de shadcn
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Details, InformationCompany, PaymentMethod, Service } from "./types";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { getListAllUserByName } from "@/core/clientes";
import { getServicesAll } from "@/core/servicios";
import { es } from "date-fns/locale"; // Importar el locale en español


const schema = z.object({
    usuario_id: z.preprocess((val) => {
        return Number(val)
    },
        z.number()),
    fecha: z.preprocess((val) => {
        if (val == null) {
            return null;
        }
        if (typeof val === 'object' && 'calendar' in val) {
            return val;
        }
        if (typeof val === 'string' || val instanceof Date) {
            return parseAbsoluteToLocal(new Date(val).toISOString());
        }
        return null;
    }, z.custom<DateValue>((data) => {
        return data != null && typeof data === 'object' && 'calendar' in data;
    }, { message: "Debe ingresar la Fecha!" })),
    motivo: z.string().min(2, { message: "Debe ingresar el detalle de la instalación!" }),
    estado: z.enum(["pendiente", "pagado"]),
});
type MeetingInputs = z.infer<typeof schema>;

const createEmptyDetail = (): Details => ({
    productCode: '',
    productName: '',
    description: '',
    quantity: 1,
    price: 0.00,
    discount: 0.00,
    subTotal: 0.00,
    taxTypeCode: "2",
    percentageCode: "0",
    rate: 0.00,
    taxableBaseTax: 0.00,
    taxValue: 0.00,
});

type DocumentInfo = {
    accessKey: string;
    businessName: string;
    commercialName: string;
    businessAddress: string;
    dayEmission: string;
    monthEmission: string;
    yearEmission: string;
    codDoc: '01';
    rucBusiness: string;
    environment: string;
    typeEmission: string;
    establishment: string;
    establishmentAddress: string;
    emissionPoint: string;
    sequential: string;
    obligatedAccounting: string;
    contribuyenteRimpe: string;
};

export default function FormularioFacturay({ informationCompany, paymentMethods, numberInvoice }: {
    informationCompany: InformationCompany,
    paymentMethods: PaymentMethod[],
    numberInvoice: number
}) {
    const { toast } = useToast()


    const [details, setDetails] = useState<Details[]>([]);
    const [description, setDescription] = useState<string>("");
    const [paymentMethodCode, setPaymentMethodCode] = useState<string>("20");
    const [dateInvoice, setDateInvoice] = React.useState<Date>();
    const [currentUser, setCurrentUser] = useState<{ id: number, nombre: string, cedula: string } | null>(null);

    const sendDataInvoice = async () => {


        if (!currentUser || !('id' in currentUser)) {
            toast({
                title: "Error",
                description: "No hay un usuario seleccionado",
                variant: "destructive"
            })
            return;
        }

        const user = currentUser as { id: number, nombre: string, cedula: string };
        const body = createInvoice();

        if (details.length === 0) {
            toast({
                title: "Error",
                description: "Debe agregar al menos un detalle a la factura",
                variant: "destructive"
            })
            return;
        }

        if (!description.trim()) {
            toast({
                title: "Error",
                description: "Debe agregar una descripción",
                variant: "destructive",
            })
            return;
        }



        try {


            const response = await fetch(`https://gary-api-node.jaapmariscalsucre.site/invoice/sign?usuario_id=${user.id}`, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            //const response = {"ok":true, statusText: "ok"}

            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.statusText}`);
            }

            //const data = await response.json();
            toast({
                title: "Factura enviada y guardada con éxito",
                description: "Factura enviada y guardada con éxito",
                variant: "default",
                className: "bg-green-100",

            })

        } catch (error) {
            console.error('Error al enviar la factura:', error);
            toast({
                title: "Error",
                description: "Error al enviar la factura",
                variant: "destructive"
            })
        }
    };

    const { data, type } = useDataStore();

    const {
        handleSubmit,
        control,
        formState: { errors, isSubmitted },
    } = useForm<MeetingInputs>({
        resolver: zodResolver(schema),
        defaultValues: {
            usuario_id: data?.usuario_id,
        }
    });

    const createEmptydocumentInfo = (): DocumentInfo => ({
        accessKey: informationCompany.ruc,
        businessName: informationCompany.razon_social,
        commercialName: informationCompany.nombre_comercial,
        businessAddress: informationCompany.direccion,
        dayEmission: dateInvoice?.getDate().toString().padStart(2, '0') || '', // Con padStart
        monthEmission: ((dateInvoice?.getMonth() || 0) + 1).toString().padStart(2, '0'), // Con padStart
        yearEmission: dateInvoice?.getFullYear().toString() || '',
        codDoc: '01',
        rucBusiness: informationCompany.ruc,
        environment: '1',
        typeEmission: '1',
        establishment: informationCompany.numero_establecimientos,
        establishmentAddress: informationCompany.direccion,
        emissionPoint: '001',
        sequential: numberInvoice.toString(),
        obligatedAccounting: informationCompany.obligado_a_contabilidad,
        contribuyenteRimpe: informationCompany.contribuyente_regimen_rimpe
    });

    const onSubmit = handleSubmit((formData) => {
        // Lógica de envío del formulario
    });

    let list = useAsyncList<{ id: number; nombre: string; cedula: string }>({
        async load({ signal, filterText }) {
            const text = filterText || '';
            const res = await getListAllUserByName(text);
            if (res.success) {
                return {
                    items: res.data,
                };
            }
            return { items: [] };
        },
    });

    const listService = useAsyncList<Service>({
        async load({ signal, filterText }) {
            const text = filterText || '';
            const res = await getServicesAll()
            if (res.success) {
                return {
                    items: res.data,
                };
            }
            return { items: [] };
        },
    });

    const addRowDetail = () => {
        setDetails(prev => [...prev, createEmptyDetail()]);
    };

    const getTotalDiscount = (details: Details[]) => {
        let total = 0;
        details.forEach(detail => {
            total += detail.discount;
        });
        return total.toFixed(2);
    };

    const getPaymentMethods = () => {
        return {
            "totalWithoutTaxes": getSubTotal(details),
            "totalDiscount": getTotalDiscount(details),
            "gratuity": (0.00).toFixed(2),
            "totalAmount": getTotal(details),
            "currency": "DOLAR",
            "paymentMethodCode": paymentMethodCode,
            "totalPayment": getTotal(details)
        }
    };

    const updateServiceInRow = (index: number, service: Service) => {
        setDetails(prev => {
            const updated = [...prev];
            updated[index] = {
                ...updated[index],
                productCode: service.cod_principal,
                productName: service.nombre,
                description: service.nombre,
                quantity: updated[index].quantity,
                price: updated[index].price,
                discount: updated[index].discount,
                subTotal: updated[index].quantity * (updated[index].price - updated[index].discount),
                taxValue: (updated[index].subTotal * (updated[index].rate) == 0 ? 0 : ((updated[index].rate) / 100)),
                taxableBaseTax: updated[index].subTotal,
            };
            return updated;
        });
    };

    const updateDetailField = (index: number, field: keyof Details, value: number) => {
        setDetails(prev => {
            const updated = [...prev];
            updated[index] = {
                ...updated[index],
                [field]: value
            };

            const quantity = field === 'quantity' ? value : updated[index].quantity;
            const price = field === 'price' ? value : updated[index].price;
            const discountPercentage = field === 'discount' ? value : updated[index].discount;

            const discountAmount = (price * quantity * discountPercentage) / 100;
            updated[index].discount = discountAmount;

            updated[index].subTotal = (quantity * price) - discountAmount;

            updated[index].taxValue = (updated[index].subTotal * (updated[index].rate) == 0 ? 0 : ((updated[index].rate) / 100));
            updated[index].taxableBaseTax = updated[index].subTotal;

            return updated;
        });
    };

    const removeDetail = (index: number) => {
        setDetails(prev => prev.filter((_, i) => i !== index));
    };

    const getSubTotal = (details: Details[]) => {
        let total = 0;
        details.forEach(detail => {
            total += detail.subTotal;
        });
        return total.toFixed(2);
    };

    const getTotal = (details: Details[]) => {
        let total = 0;
        details.forEach(detail => {
            total += detail.taxableBaseTax;
        });
        return total.toFixed(2);
    };

    const getAditionalInfo = () => {
        return [{ name: "Descripcion", value: description }]
    }

    const getTaxDetails = (details: Details[]) => {
        const taxGroups = new Map<string, { taxableBase: number; taxValue: number }>();

        details.forEach(detail => {
            const key = `${detail.taxTypeCode}-${detail.rate}`;

            if (!taxGroups.has(key)) {
                taxGroups.set(key, { taxableBase: 0, taxValue: 0 });
            }

            const group = taxGroups.get(key)!;
            group.taxableBase += detail.subTotal;
            group.taxValue += detail.taxValue;
        });

        const taxDetails = Array.from(taxGroups.entries()).map(([key, values]) => {
            const [taxCode, rate] = key.split("-");
            return {
                taxCode,
                percentageCode: rate,
                taxableBase: values.taxableBase.toFixed(2),
                taxValue: values.taxValue.toFixed(2)
            };
        });

        return taxDetails;
    };

    const formatValues = (obj: { [key: string]: number | string; }) => {
        const formatted: Record<string, string> = {};
        for (const key in obj) {
            if (typeof obj[key] === "number") {
                formatted[key] = (obj[key] as number).toFixed(2);
            } else {
                formatted[key] = obj[key] as string;
            }
        }
        return formatted;
    };

    const createInvoice = () => {
        const user = currentUser as { id: number, nombre: string, cedula: string };

        const customer = {
            identificationType: "05",
            customerName: user.nombre,
            customerDni: user.cedula,
            customerAddress: "direccion Ejemplo"
        }
        const payment = getPaymentMethods();
        const aditionalInfo = getAditionalInfo();
        const totalsWithTax = getTaxDetails(details);

        const updatedDetails = details.map(formatValues);

        const invoice = {
            documentInfo: createEmptydocumentInfo(),
            customer,
            payment,
            details: updatedDetails,
            additionalInfo: aditionalInfo,
            totalsWithTax
        }
        return invoice;
    };


    return (
        <>
            <Card className="w-full mx-auto">
                <CardHeader className=" bg-secondary w-full">

                    <div className="flex items-center gap-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">Facturacion</h3>
                        <div className="hidden items-center gap-2 md:ml-auto md:flex">
                            <Button
                                className="w-fit justify-self-end"
                                onClick={sendDataInvoice}
                            >
                                Facturar
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <form className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="grid gap-6">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <label className="font-medium">Fecha:</label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-[240px] justify-start text-left font-normal",
                                                        !dateInvoice && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {dateInvoice ? format(dateInvoice, "YYYY-MM-DD") : <span>Seleccione una fecha</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    locale={es}
                                                    mode="single"
                                                    selected={dateInvoice}
                                                    onSelect={setDateInvoice}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    <div className="flex gap-2 items-center">
                                        <label className="font-medium">Cliente:</label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "w-[240px] justify-between",
                                                        !currentUser && "text-muted-foreground"
                                                    )}
                                                >
                                                    {currentUser ? currentUser.nombre : "Seleccione un cliente"}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[240px] p-0">
                                                <Command>
                                                    <CommandInput placeholder="Buscar cliente..." />
                                                    <CommandList>
                                                        <CommandEmpty>No se encontraron clientes.</CommandEmpty>
                                                        <CommandGroup>
                                                            {list.items.map((item) => (
                                                                <CommandItem
                                                                    key={item.id}
                                                                    value={item.nombre}
                                                                    onSelect={() => {
                                                                        setCurrentUser(item);
                                                                    }}
                                                                >
                                                                    {item.nombre}
                                                                    <Check
                                                                        className={cn(
                                                                            "ml-auto",
                                                                            currentUser?.id === item.id
                                                                                ? "opacity-100"
                                                                                : "opacity-0"
                                                                        )}
                                                                    />
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <label className="font-medium">Establecimiento:</label>
                                        <Input
                                            id="establecimiento"
                                            readOnly
                                            value={informationCompany.numero_establecimientos}
                                            className="max-w-xs"
                                        />
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <label className="font-medium">P. Emisión:</label>
                                        <Input
                                            readOnly
                                            value={informationCompany.numero_establecimientos}
                                            className="max-w-xs"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <label className="font-medium"># de Documento:</label>
                                    <Input
                                        id="number-invoice"
                                        readOnly
                                        value={numberInvoice.toString()}
                                        className="max-w-xs"
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <div className="mx-auto space-y-4 w-full">

                <Card>
                    <CardContent className="p-6">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b text-sm">
                                        <th className="p-2 text-left w-5"></th>
                                        <th className="p-2 text-left w-32">Cant.</th>
                                        <th className="p-2 text-left w-80">Cuenta</th>
                                        <th className="p-2 text-left w-32">Valor U.</th>
                                        <th className="p-2 text-left w-32">IVA</th>
                                        <th className="p-2 text-left w-32">% Desc.</th>
                                        <th className="p-2 text-left w-32">Desc.</th>
                                        <th className="p-2 text-left w-32">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {details.map((detail, index) => (
                                        <tr key={index} className="border-b">
                                            <td className="w-5">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeDetail(index)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </td>
                                            <td className="p-2">
                                                <Input
                                                    type="number"
                                                    value={detail.quantity.toString()}
                                                    className="h-8"
                                                    onChange={(e) => updateDetailField(index, 'quantity', Number(e.target.value))}
                                                />
                                            </td>
                                            <td className="p-2">
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            role="combobox"
                                                            className={cn(
                                                                "w-[240px] justify-between",
                                                                !detail.productName && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {detail.productName || "Seleccione un servicio"}
                                                            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-[240px] p-0">
                                                        <Command>
                                                            <CommandInput placeholder="Buscar servicio..." />
                                                            <CommandList>
                                                                <CommandEmpty>No se encontraron servicios.</CommandEmpty>
                                                                <CommandGroup>
                                                                    {listService.items.map((item) => (
                                                                        <CommandItem
                                                                            key={item.id}
                                                                            value={item.nombre}
                                                                            onSelect={() => {
                                                                                updateServiceInRow(index, item);
                                                                            }}
                                                                        >
                                                                            {item.nombre}
                                                                            <Check
                                                                                className={cn(
                                                                                    "ml-auto",
                                                                                    detail.productName === item.nombre
                                                                                        ? "opacity-100"
                                                                                        : "opacity-0"
                                                                                )}
                                                                            />
                                                                        </CommandItem>
                                                                    ))}
                                                                </CommandGroup>
                                                            </CommandList>
                                                        </Command>
                                                    </PopoverContent>
                                                </Popover>
                                            </td>
                                            <td className="p-2">
                                                <Input
                                                    type="number"
                                                    value={detail.price.toString()}
                                                    className="h-8"
                                                    onChange={(e) => updateDetailField(index, 'price', Number(e.target.value))}
                                                />
                                            </td>
                                            <td className="p-2">
                                                <Input
                                                    type="number"
                                                    value={detail.rate.toString()}
                                                    className="h-8"
                                                    readOnly
                                                />
                                            </td>
                                            <td className="p-2">
                                                <Input
                                                    type="number"
                                                    defaultValue="0.00"
                                                    className="h-8"
                                                    onChange={(e) => updateDetailField(index, 'discount', Number(e.target.value))}
                                                />
                                            </td>
                                            <td className="p-2">
                                                <Input
                                                    type="number"
                                                    value={((detail.price - (detail.subTotal / detail.quantity)) * detail.quantity).toString()}
                                                    className="h-8"
                                                    readOnly
                                                />
                                            </td>
                                            <td className="p-2">
                                                <Input
                                                    type="number"
                                                    value={detail.subTotal.toString()}
                                                    className="h-8"
                                                    readOnly
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <Button
                            className="mt-4 w-fit"
                            onClick={addRowDetail}
                        >
                            Ingresar otro producto
                        </Button>
                    </CardContent>
                </Card>
                <Card className="w-1/2">
                    <CardHeader className="px-6">
                        <h3 className="text-lg font-semibold flex items-center gap-2">Pago</h3>
                    </CardHeader>
                    <CardContent className="px-6">
                        <Select
                            defaultValue="20"
                            onValueChange={(value) => setPaymentMethodCode(value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccione un método de pago" />
                            </SelectTrigger>
                            <SelectContent>
                                {paymentMethods.map((item) => (
                                    <SelectItem key={item.codigo} value={item.codigo}>
                                        {item.descripcion}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>

            </div>

            <div className="mx-auto w-full">
                <Card className="w-full p-6">
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-md font-semibold flex items-center gap-2">Descripcion</h3>
                            <Textarea
                                id="description"
                                onChange={(e) => setDescription(e.target.value)}
                                className="mt-2 mx-auto"
                                rows={4}
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-end items-center gap-3">
                                <span className="text-sm">Subtotal 15%:</span>
                                <div className="flex items-center gap-1">
                                    <span>$</span>
                                    <Input readOnly type="number" defaultValue="0.00" className="w-32" />
                                </div>
                            </div>
                            <div className="flex justify-end items-center gap-3">
                                <span className="text-sm">Subtotal 5%:</span>
                                <div className="flex items-center gap-1">
                                    <span>$</span>
                                    <Input readOnly type="number" defaultValue="0.00" className="w-32" />
                                </div>
                            </div>
                            <div className="flex justify-end items-center gap-3">
                                <span className="text-sm">Subtotal 0%:</span>
                                <div className="flex items-center gap-1">
                                    <span>$</span>
                                    <Input readOnly type="number" value={getSubTotal(details)} defaultValue="0.00" className="w-32" />
                                </div>
                            </div>
                            <div className="flex justify-end items-center gap-3">
                                <span className="text-sm">Descuento:</span>
                                <div className="flex items-center gap-1">
                                    <span>$</span>
                                    <Input readOnly type="number" defaultValue="0.00" className="w-32 font-medium" />
                                </div>
                            </div>
                            <div className="flex justify-end items-center gap-3">
                                <span className="text-sm">IVA 15%:</span>
                                <div className="flex items-center gap-1">
                                    <span>$</span>
                                    <Input readOnly type="number" defaultValue="0.00" className="w-32" />
                                </div>
                            </div>
                            <div className="flex justify-end items-center gap-3">
                                <span className="text-sm">IVA 5%:</span>
                                <div className="flex items-center gap-1">
                                    <span>$</span>
                                    <Input readOnly type="number" defaultValue="0.00" className="w-32" />
                                </div>
                            </div>

                            <div className="flex justify-end items-center">
                                <span className="text-sm">Total:</span>
                                <div className="flex items-center gap-1">
                                    <span>$</span>
                                    <Input readOnly type="number" value={getTotal(details)} defaultValue="0.00" className="w-32" />
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>


        </>
    );
}