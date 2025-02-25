
'use server';
import pool from "./conecction";
import { revalidatePath } from 'next/cache';

export const TotalFacturas = async () => {
    try {
        const { rows } = await pool.query(`
        SELECT COUNT(*) as total_facturas
        FROM facturas_detalles
      `);
        revalidatePath('/');

        return rows;

    } catch (error) {
        throw new Error('Error al obtener las facturas');
    }
};

export const TotalValorFacturas = async () => {
    try {
        const { rows } = await pool.query(`
        SELECT SUM((factura_json -> 'payment' ->> 'totalAmount')::numeric) AS total_val
        FROM facturas_detalles;
      `);
        revalidatePath('/');
        return rows;
    } catch (error) {
        throw new Error('Error al obtener las facturas');
    }
};

//facturas emitidas hoy
export const TotalFacturasHoy = async () => {
    try {
        const { rows } = await pool.query(`
        SELECT COUNT(*) as total_facturas
        FROM facturas_detalles
        WHERE fecha_emision = now()::date;
      `);
        revalidatePath('/');

        return rows;

    } catch (error) {
        throw new Error('Error al obtener las facturas');
    }
};
// suma de valor de facturas emitidas hoy
export const TotalValorFacturasHoy = async () => {
    try {
        const { rows } = await pool.query(`
        SELECT SUM((factura_json -> 'payment' ->> 'totalAmount')::numeric) AS total_val
        FROM facturas_detalles
        WHERE fecha_emision = now()::date;
      `);
        revalidatePath('/');
        return rows;
    } catch (error) {
        throw new Error('Error al obtener las facturas');
    }
};

// lista de  facturas con el cliente que emitió y el valor de la factura
export const FechtlistaFacturasClientesSemanal = async () => {
    try {
        const { rows } = await pool.query(`
        SELECT 
          fd.fecha_emision AS fecha,
          c.nombre,
          c.cedula,
          fd.estado AS estado_factura,
          (fd.factura_json -> 'payment' ->> 'totalAmount')::numeric AS monto
        FROM facturas_detalles fd
        JOIN clientes c ON fd.usuario_id = c.id
        WHERE fd.fecha_emision >= date_trunc('week', current_date)
      `);
        return rows;
    } catch (error) {
        throw new Error('Error al obtener la lista de facturas');
    }
};

export interface ClienteConFacturas {
    nombre: string;
    cedula: string;
    total_facturas: number;
}

export const ClientesConMasFacturas = async (): Promise<ClienteConFacturas[]> => {
    try {
        const { rows } = await pool.query(`
        SELECT 
          c.nombre,
          c.cedula,
          COUNT(fd.id) as total_facturas
        FROM facturas_detalles fd
        JOIN clientes c ON fd.usuario_id = c.id
        WHERE fd.fecha_emision >= current_date - interval '7 days'
        GROUP BY c.id, c.nombre, c.cedula
        ORDER BY total_facturas DESC;
      `);
        return rows.map(row => ({
            nombre: row.nombre,
            cedula: row.cedula,
            total_facturas: parseInt(row.total_facturas, 10),
        }));
    } catch (error) {
        throw new Error('Error al obtener los clientes con más facturas');
    }
};