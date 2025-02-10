
export interface Cliente {
    id: number;                // int8
    nombre: string;            // text
    apellido: string;          // text
    cedula: string;            // text
    nro_tel_princ: string;     // text
    email: string;            // text
    ruc: string | null;              // text
    direccion: string;        // text
}

export interface Factura {
    id: number;
    numero: string;
    codigo: string;
    fecha: string;
    hora: string;
    importe_total: number;
}


export interface Producto {
    id: number;                // int8
    nombre: string;            // text
    codigo: string;            // text
    descripcion: string;            // text
    precio_unidad: number;            // float8
    stock: number;            // int8
    imagen: string | null;              // text 
    estado: string;  
    categoria: string;          // text
}