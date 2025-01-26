'use server'
import { Cliente } from '@/types';
import pool from './conecction'

import { revalidatePath } from 'next/cache';
//import exp from 'constants';
export type QueryResultError<T> = { success: true, data: T } | { success: false, error: string };

export async function getListAllUser(): Promise<Cliente[] | { error: any }> {
    try {
        const user: Cliente[] = (await pool.query('SELECT * FROM clientes ORDER BY nombre ASC;')).rows;
        return user
    } catch (error) {
        return { error: `Error al obtener todos los usuarios: ${error}` };
    }
}


export async function getListAllUserByName(name: string): Promise<QueryResultError<{ id: number; nombre: string; cedula: string }[]>> {
    try {
        const user: { id: number; nombre: string; cedula: string }[] = (await pool.query(`SELECT 
                u.cedula,
                u.nombre,
                u.id
            FROM 
                clientes u
            WHERE 
                u.nombre ILIKE '%' || $1 || '%' OR
                u.cedula ILIKE '%' || $1 || '%'

            ORDER BY 
                u.nombre ASC
            LIMIT 8;`, [name])).rows;
        
        return { success: true, data: user };
    } catch (error) {
        return { success: false, error: `Error al obtener todos los usuarios: ${error}` };
    }
}

