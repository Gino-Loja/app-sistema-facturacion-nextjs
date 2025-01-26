'use server'
import { Cliente } from '@/types';
import pool from './conecction'

import { revalidatePath } from 'next/cache';
import { QueryResultError } from './clientes';
import { InformationCompany } from '@/components/pages/facturas/types';
//import exp from 'constants';

type Servicio = {
    id: number;
    cod_principal: string;
    cod_auxiliar: string;
    nombre: string;
    tipo: string;
    cod_iva: string;
    im_valor_agre: string;
    ICE: string;
}
export async function getServicesAll(): Promise<QueryResultError<Servicio[]>> {
    try {
        const user: Servicio[] = (await pool.query('SELECT * FROM productos_fac')).rows;

        return { success: true, data: user };

    } catch (error) {
        return { success: false, error: `Error al obtener todos los usuarios: ${error}` };
    }
}

export async function getInformationCompany(): Promise<QueryResultError<InformationCompany[]>> {
    try {
        const user: InformationCompany[] = (await pool.query('SELECT * FROM empresa_informacion')).rows;
        return { success: true, data: user };
    } catch (error) {
        return { success: false, error: `Error al obtener todos los usuarios: ${error}` };
    }
}


export const getNumberInvoice = async (): Promise<QueryResultError<number>> => {
    try {
        const secuencial: number = (await pool.query(`
            SELECT LPAD((COALESCE(MAX(id::INTEGER), 0) + 1)::text, 9, '0') AS secuencial
            FROM public.facturas_detalles;

        `)).rows[0].secuencial;
        return { success: true, data: secuencial };
    } catch (error) {
        return { success: false, error: `Error al obtener los datos: ${error}` };
    }
};

export type PaymentMethod = {
    id: number;
    codigo: string;
    descripcion: string;
}

export const getPaymentMethods = async (): Promise<QueryResultError<PaymentMethod[]>> => {
    try {
        const paymentMethods: PaymentMethod[] = (await pool.query(`
            select
                *
            from
                metodos_pagos
        `)).rows;
        return { success: true, data: paymentMethods };
    } catch (error) {
        return { success: false, error: `Error al obtener los datos: ${error}` };
    }
};