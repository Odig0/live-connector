/**
 * Configuración de conexión a la base de datos PostgreSQL
 * 
 * Uso:
 *   const db = require('./config/database.js');
 *   const result = await db.query('SELECT * FROM live_count');
 */

const { Pool } = require('pg');
require('dotenv').config();

// Configuración de la conexión
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'tiktok_live_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres123',
  max: 20, // Máximo de conexiones
  idleTimeoutMillis: 30000, // Tiempo de inactividad
  connectionTimeoutMillis: 2000, // Timeout de conexión
});

// Manejo de errores de conexión
pool.on('error', (err) => {
  console.error('❌ Error no esperado en el pool de conexiones:', err);
  process.exit(-1);
});

// Evento de conexión exitosa
pool.on('connect', () => {
  console.log('✅ Conexión establecida con PostgreSQL');
});

/**
 * Ejecutar una consulta SQL
 * @param {string} query - Consulta SQL
 * @param {array} params - Parámetros de la consulta
 * @returns {object} Resultado de la consulta
 */
const query = async (query, params = []) => {
  const start = Date.now();
  try {
    const result = await pool.query(query, params);
    const duration = Date.now() - start;
    console.log(`✅ Query ejecutada en ${duration}ms`);
    return result;
  } catch (error) {
    console.error('❌ Error en query:', error.message);
    console.error('Query:', query);
    console.error('Params:', params);
    throw error;
  }
};

/**
 * Obtener una sola fila
 */
const getOne = async (query, params = []) => {
  const result = await query.call(this, query, params);
  return result.rows.length > 0 ? result.rows[0] : null;
};

/**
 * Obtener todas las filas
 */
const getAll = async (query, params = []) => {
  const result = await query.call(this, query, params);
  return result.rows;
};

/**
 * Insertar datos
 */
const insert = async (table, data) => {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
  
  const insertQuery = `
    INSERT INTO ${table} (${keys.join(', ')}) 
    VALUES (${placeholders})
    RETURNING *
  `;
  
  return await query(insertQuery, values);
};

/**
 * Actualizar datos
 */
const update = async (table, data, where) => {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const whereKeys = Object.keys(where);
  
  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
  const whereClause = whereKeys.map((key, i) => `${key} = $${keys.length + i + 1}`).join(' AND ');
  
  const updateQuery = `
    UPDATE ${table} 
    SET ${setClause} 
    WHERE ${whereClause}
    RETURNING *
  `;
  
  return await query(updateQuery, [...values, ...Object.values(where)]);
};

/**
 * Eliminar datos
 */
const deleteRow = async (table, where) => {
  const whereKeys = Object.keys(where);
  const whereClause = whereKeys.map((key, i) => `${key} = $${i + 1}`).join(' AND ');
  
  const deleteQuery = `
    DELETE FROM ${table} 
    WHERE ${whereClause}
    RETURNING *
  `;
  
  return await query(deleteQuery, Object.values(where));
};

/**
 * Verificar la conexión a la base de datos
 */
const checkConnection = async () => {
  try {
    const result = await query('SELECT NOW()');
    console.log('✅ Conexión a PostgreSQL verificada correctamente');
    return true;
  } catch (error) {
    console.error('❌ No se pudo conectar a PostgreSQL:', error.message);
    return false;
  }
};

/**
 * Cerrar el pool de conexiones
 */
const close = async () => {
  try {
    await pool.end();
    console.log('✅ Pool de conexiones cerrado');
  } catch (error) {
    console.error('❌ Error al cerrar el pool:', error);
  }
};

module.exports = {
  query,
  getOne,
  getAll,
  insert,
  update,
  deleteRow,
  checkConnection,
  close,
  pool,
};
