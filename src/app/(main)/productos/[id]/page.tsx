
'use client'
import { Button } from '@/components/ui/button'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

import {
    ChevronLeft,
    Upload,

} from 'lucide-react'


import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Badge } from '@/components/ui/badge'
import { useDataStore } from '@/core/zustand'
import { useToast } from '@/hooks/use-toast'
import Image from 'next/image'
import { useState } from 'react'
import { Axios } from '@/core/axios'

export default function Productos() {

    const { toast } = useToast()

    const { type, data } = useDataStore();
    const [imagePreview, setImagePreview] = useState<string | null>(data?.imagen || "/placeholder.svg");


    const formSchema = z.object({
        nombre: z.string().min(2, {
            message: "el nombre debe tener al menos 2 caracteres.",
        }),
        categoria: z.string().min(2, {
            message: "la categoria debe tener al menos 2 caracteres.",
        }),
        descripcion: z.string().min(2, {
            message: "la descripcion debe tener al menos 2 caracteres.",
        }),
        precio: z.preprocess((val) => Number(val),
            z.number()
                .min(0, { message: "Coloca un valor positivo" })
        ),

        stock: z.preprocess((val) => Number(val),
            z.number()
                .min(0, { message: "Coloca un valor positivo" })
        ),
        codigo: z.string().min(2, {
            message: "el codigo debe tener al menos 2 caracteres.",
        }),
        imagen: z.instanceof(File).refine((file) => file.size <= 1 * 1024 * 1024, {
            message: "La imagen debe ser menor a 1 MB.",
        }),

        estado: z.enum(["Activo", "Inactivo"], {
            errorMap: () => ({ message: "El estado debe ser Activo o Inactivo." }),
        }),
    })
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),

    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {

        if (type == 'create') {
            Axios.post(`/productos/create/`, values, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then(() => {
                    toast({
                        title: "Creado",
                        description: "Se ha creado el producto",
                        variant: "default"
                    })
                })
                .catch((e) => {
                    toast({
                        title: "Error",
                        description: "No se ha creado el producto",
                        variant: "destructive"
                    })

                })
        } else {
            Axios.put(`/productos/editar/${data.id}`, values, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then(() => {
                    toast({
                        title: "Actualizado",
                        description: "Se ha actualizado el producto",
                        variant: "default"
                    })
                })
                .catch((e) => {
                    toast({
                        title: "Error",
                        description: "No se ha actualizado el producto",
                        variant: "destructive"
                    })

                })

        }
    }
    return (
        <div className='flex min-h-screen w-full flex-col bg-muted/40 '>
            <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 my-2">

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">


                        <div className="flex items-center gap-4">
                            <Button type='button' variant="outline" size="icon" className="h-7 w-7">
                                <ChevronLeft className="h-4 w-4" />
                                <span className="sr-only">Back</span>
                            </Button>
                            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                                Productos
                            </h1>

                            <div className="hidden items-center gap-2 md:ml-auto md:flex">

                                <Button type='submit' variant={'default'} size="sm">
                                    Guardar Producto
                                </Button>
                            </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Detalle del producto</CardTitle>
                                        <CardDescription>
                                            Editar el Producto
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid gap-6">
                                            <div className="grid gap-3">
                                                <FormField

                                                    control={form.control}
                                                    defaultValue={data?.nombre}
                                                    name="nombre"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Nombre del Producto</FormLabel>
                                                            <FormControl>
                                                                <Input defaultValue={field.value} placeholder="shadcn" {...field} />
                                                            </FormControl>

                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="grid gap-3">
                                                <FormField
                                                    control={form.control}
                                                    defaultValue={data?.descripcion}

                                                    name="descripcion"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Descripcion</FormLabel>
                                                            <FormControl>
                                                                <Textarea
                                                                    defaultValue={field.value}
                                                                    placeholder="Ingresa la descripcion acerca de tu producto"
                                                                    className="resize-none"
                                                                    {...field}
                                                                />
                                                            </FormControl>

                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="grid gap-3">
                                                <FormField
                                                    control={form.control}
                                                    defaultValue={data?.codigo}

                                                    name="codigo"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Codigo</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    defaultValue={field.value}
                                                                    className="resize-none w-1/2"
                                                                    {...field}
                                                                />
                                                            </FormControl>

                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Stock</CardTitle>
                                        <CardDescription>
                                            Ingresa el precio y stock
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>

                                                    <TableHead>Stock</TableHead>
                                                    <TableHead>Precio</TableHead>

                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>
                                                        <FormField
                                                            control={form.control}
                                                            defaultValue={data?.stock}
                                                            name="stock"
                                                            render={({ field }) => (
                                                                <FormItem>

                                                                    <FormControl>
                                                                        <Input type='number' defaultValue={field.value} placeholder="stock" {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <FormField
                                                            control={form.control}
                                                            defaultValue={data?.precio_unidad}
                                                            name="precio"
                                                            render={({ field }) => (
                                                                <FormItem>

                                                                    <FormControl>
                                                                        <Input type='number' defaultValue={field.value} placeholder="Precio" {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </TableCell>

                                                </TableRow>

                                            </TableBody>
                                        </Table>
                                    </CardContent>

                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Categoria</CardTitle>
                                        <CardDescription>
                                            Ingresa la categoria
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <FormField
                                            control={form.control}
                                            name="categoria"
                                            defaultValue={data?.categoria}

                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Categoria del producto</FormLabel>
                                                    <FormControl>
                                                        <Input defaultValue={field.value} placeholder="categoria" {...field} />
                                                    </FormControl>

                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>

                                </Card>

                            </div>
                            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Estado del Producto</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid gap-6">
                                            <FormField
                                                control={form.control}
                                                name="estado"
                                                defaultValue={data?.estado}

                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Estado</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Selecciona el estado" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="Activo">
                                                                    <Badge variant="outline">Activo</Badge>
                                                                </SelectItem>

                                                                <SelectItem value="Inactivo">
                                                                    <Badge variant="outline">Inactivo</Badge>
                                                                </SelectItem>

                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="overflow-hidden">
                                    <CardHeader>
                                        <CardTitle>Imagen del Producto</CardTitle>
                                        <CardDescription>
                                            Lipsum dolor sit amet, consectetur adipiscing elit
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid gap-2">

                                            <Image
                                                alt="Product image"
                                                className="aspect-square w-full rounded-md object-cover"
                                                height="200"
                                                src={imagePreview || "/placeholder.svg"}
                                                width="230"
                                            />

                                            <FormField
                                                control={form.control}
                                                name="imagen"
                                                render={({ field: { value, onChange, ...fieldProps } }) => (
                                                    <FormItem>
                                                        <FormLabel>Imagen</FormLabel>
                                                        <FormControl >

                                                            <Input
                                                                {...fieldProps}
                                                                name='imagen'
                                                                placeholder="imagen"
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(event) => {
                                                                    onChange(event.target.files && event.target.files[0])
                                                                    if (event.target.files && event.target.files[0]) {
                                                                        setImagePreview(URL.createObjectURL(event.target.files && event.target.files[0])); // Actualiza la vista previa
                                                                    }
                                                                }

                                                                }

                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                            </div>
                        </div>

                    </form>
                </Form>

            </main>
        </div>

    );
}