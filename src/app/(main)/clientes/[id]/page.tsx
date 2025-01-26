'use client'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useDataStore } from "@/core/zustand"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Axios } from "@/core/axios"
import { useToast } from "@/hooks/use-toast"
import { useSWRConfig } from "swr"


const formSchema = z.object({
    nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres.").max(50, "El nombre no debe exceder los 50 caracteres."),
    apellido: z.string().min(2, "El apellido debe tener al menos 2 caracteres.").max(50, "El apellido no debe exceder los 50 caracteres."),
    cedula: z
        .string().min(10, "El numero debe tener 10 digitos"),
    nro_tel_princ: z
        .string().min(10, "El numero debe tener 10 digitos"),

    email: z
        .string()
        .email("Debe ser un correo electrónico válido."),
    ruc: z.string(),
    direccion: z
        .string()
        .min(5, "La dirección debe tener al menos 5 caracteres.")
        .max(100, "La dirección no debe exceder los 100 caracteres."),
    tipo: z.enum(["natural", "jurídico"], {
        errorMap: () => ({ message: "El tipo debe ser 'natural' o 'jurídico'." }),
    }),
    estado: z.enum(["Activo", "Inactivo"], {
        errorMap: () => ({ message: "El estado debe ser 'Activo' o 'Inactivo'." }),
    }),
})
export default function Cliente() {
    
    const { toast } = useToast()

    const { type, data } = useDataStore();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),

    })
    const { mutate } = useSWRConfig()

    function onSubmit(values: z.infer<typeof formSchema>) {
        if (type == 'update') {

            Axios.put(`/clientes/editar/${data.id}`, values)
                .then(() => {
                    toast({
                        title: "Actualizado",
                        description: "Se ha actualizado el cliente",
                        variant: "default"
                    })
                    //mutate('/https://apiexpress.fichafamiliarchambo.site/clientes')
                })
                .catch((e) => {
                    toast({
                        title: "Error",
                        description: "No se ha actualizado el cliente",
                        variant: "destructive"
                    })

                })

        } else {
            Axios.post(`/clientes/crear/`, values)
                .then(() => {
                    toast({
                        title: "Creado",
                        description: "Se ha creado el cliente",
                        variant: "default"
                    })
                })
                .catch((e) => {
                    toast({
                        title: "Error",
                        description: "No se ha creado el cliente",
                        variant: "destructive"
                    })

                })
        }


    }
    return (

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                <Card className="w-[350px]">
                    <CardHeader>
                        <CardTitle> {type == 'update' ? "Actualizacion" : "Guardar"} Cliente</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <FormField
                            control={form.control}
                            defaultValue={data?.nombre}
                            name="nombre"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombres:</FormLabel>
                                    <FormControl>
                                        <Input defaultValue={field.value} placeholder="Nombres" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            defaultValue={data?.apellido}
                            name="apellido"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Apellido:</FormLabel>
                                    <FormControl>
                                        <Input defaultValue={field.value} placeholder="Apellidos" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="cedula"
                            defaultValue={data?.cedula}

                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cedula:</FormLabel>
                                    <FormControl>
                                        <Input defaultValue={field.value} type="number" placeholder="Cedula" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="ruc"
                            defaultValue={data?.ruc}

                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ruc:</FormLabel>
                                    <FormControl>
                                        <Input defaultValue={field.value} type="number" placeholder="ruc" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            defaultValue={data?.email}


                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>email:</FormLabel>
                                    <FormControl>
                                        <Input defaultValue={field.value} placeholder="email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            defaultValue={data?.direccion}

                            name="direccion"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Direccion:</FormLabel>
                                    <FormControl>
                                        <Input defaultValue={field.value} placeholder="domicilio" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            defaultValue={data?.nro_tel_princ}
                            name="nro_tel_princ"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>telefono:</FormLabel>
                                    <FormControl>
                                        <Input defaultValue={field.value} placeholder="telefono" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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
                        <FormField
                            control={form.control}
                            name="tipo"
                            defaultValue={data?.tipo}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tipo de cliente</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona el tipo de cliente" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="natural">
                                                <Badge variant="outline">Natural</Badge>
                                            </SelectItem>
                                            <SelectItem value="jurídico">
                                                <Badge variant="outline">Jurídico</Badge>

                                            </SelectItem>

                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />




                    </CardContent>
                    <CardFooter className="flex">
                        <Button className="w-full" type="submit">Guardar</Button>
                    </CardFooter>
                </Card>



            </form>
        </Form>
    )
}