'use client'

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "next-auth/react"; // Cambiamos la importación
import { useRouter } from "next/navigation";

// Definir el esquema de validación
const loginSchema = z.object({
    usuario: z.string().nonempty("El usuario es obligatorio"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});


export default function Login() {
    const router = useRouter();


    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),

    })



    async function onSubmit(values: z.infer<typeof loginSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        try {
            const result = await signIn("credentials", {
                username: values.usuario,
                password: values.password,
                redirect: false, // Importante: manejamos la redirección manualmente
            });

            if (result?.error) {
                // Manejar errores de autenticación
                form.setError("root", {
                    message: "Usuario o contraseña incorrectos"
                });
                return;
            }

            if (result?.ok) {
                // Redireccionar al dashboard o página principal
                router.push("/");
                router.refresh(); // Refresca la página para actualizar el estado de la sesión
            }
        } catch (error) {
            console.error("Error durante el login:", error);
            form.setError("root", {
                message: "Ocurrió un error durante el inicio de sesión"
            });
        }
    }






    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Card className="mx-auto max-w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl">Login</CardTitle>
                        <CardDescription>Por favor, introduce tus credenciales para iniciar sesión.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="usuario"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Usuario</FormLabel>
                                    <FormControl>
                                        <Input placeholder="usuario" {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>

                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full hover:bg-blue-500 transition-colors">Ingresar</Button>
                    </CardFooter>
                </Card>

            </form>
        </Form>

    )

}