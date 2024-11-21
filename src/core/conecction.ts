import { Pool, types } from "pg";
import dotenv from "dotenv";
dotenv.config();

// Configuración de tipos personalizados para PostgreSQL
types.setTypeParser(20, (val) => parseInt(val, 10)); // Manejo de enteros
types.setTypeParser(1700, (val) => parseFloat(val)); // Mantiene el valor numérico

// Formato de números
const formatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// Configuración del Pool
let pool: Pool;

try {
  pool = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    port: parseInt(process.env.POSTGRES_PORT || "5432", 10), // Puerto como número
  });

  // Verificar conexión
} catch (err) {
  console.error("Error al inicializar el Pool de conexiones:", (err as Error).message);
  process.exit(1); // Terminar el proceso con un error
}

export default pool;