'use server';
import pool from "./conecction";
import { revalidatePath } from 'next/cache';

export const fetchFacturas = async () => {
  try {
    const { rows } = await pool.query(`
      SELECT *
      FROM facturas_detalles
      ORDER BY fecha_emision DESC
    `);
    revalidatePath('/ver-facturas');
    
    return rows;

  } catch (error) {
    throw new Error('Error al obtener las facturas');
  }
};

