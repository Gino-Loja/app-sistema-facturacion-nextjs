'use server';
import pool from "./conecction";

export const fetchFacturas = async () => {
  try {
    const { rows } = await pool.query(`
      SELECT *
      FROM facturas_detalles
      ORDER BY fecha_emision ASC
    `);
    return rows;
  } catch (error) {
    console.error('Error fetching facturas:', error);
    throw new Error('Error al obtener las facturas');
  }
};