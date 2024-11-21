'use server'
import { Cliente } from '@/types';
import pool from './conecction'

import { revalidatePath } from 'next/cache';
//import exp from 'constants';

export async function getListAllUser(): Promise<Cliente[] | { error: any }> {
    try {
        const user: Cliente[] = (await pool.query('SELECT * FROM clientes ORDER BY nombre ASC;')).rows;
        return user
    } catch (error) {
        return { error: `Error al obtener todos los usuarios: ${error}` };
    }
}