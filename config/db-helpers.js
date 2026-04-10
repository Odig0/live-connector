/**
 * Funciones auxiliares para la base de datos
 * 
 * Manejo simple de operaciones para monitoreo de transmisiones en vivo
 */

const db = require('./database');

// ============================================================================
// TABLA PRINCIPAL: live_count (TOTALES - Lectura rápida)
// ============================================================================

/**
 * Crear o actualizar registro en tabla principal
 */
const createOrUpdateLiveCount = async (data) => {
  try {
    // Primero intentar actualizar si existe
    const updateQuery = `
      UPDATE live_count 
      SET view_count = $3, updated_at = CURRENT_TIMESTAMP
      WHERE channel_name = $1 AND platform = $2
      RETURNING *
    `;
    
    const updateResult = await db.query(updateQuery, [
      data.channel_name,
      data.platform,
      data.view_count || 0,
    ]);
    
    // Si se actualizó
    if (updateResult.rows.length > 0) {
      const record = updateResult.rows[0];
      
      // Guardar snapshot en histórico automáticamente
      const historyQuery = `
        INSERT INTO live_count_history (live_count_id, channel_name, platform, view_count)
        VALUES ($1, $2, $3, $4)
      `;
      
      await db.query(historyQuery, [
        record.id,
        record.channel_name,
        record.platform,
        record.view_count,
      ]);
      
      return record;
    }
    
    // Si no existe, insertarlo
    const insertQuery = `
      INSERT INTO live_count (channel_name, platform, view_count)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    
    const insertResult = await db.query(insertQuery, [
      data.channel_name,
      data.platform,
      data.view_count || 0,
    ]);
    
    const record = insertResult.rows[0];
    
    // Guardar snapshot en histórico para el nuevo registro
    const historyQuery = `
      INSERT INTO live_count_history (live_count_id, channel_name, platform, view_count)
      VALUES ($1, $2, $3, $4)
    `;
    
    await db.query(historyQuery, [
      record.id,
      record.channel_name,
      record.platform,
      record.view_count,
    ]);
    
    return record;
  } catch (error) {
    throw new Error(`Error en createOrUpdateLiveCount: ${error.message}`);
  }
};

/**
 * Obtener todos los registros del total
 */
const getAllLiveCount = async () => {
  const query = `
    SELECT * FROM live_count 
    ORDER BY updated_at DESC
  `;
  
  return await db.query(query);
};

/**
 * Obtener registros por plataforma
 */
const getLiveCountByPlatform = async (platform) => {
  const query = `
    SELECT * FROM live_count 
    WHERE platform = $1
    ORDER BY updated_at DESC
  `;
  
  return await db.query(query, [platform]);
};

/**
 * Obtener registros por canal
 */
const getLiveCountByChannel = async (channelName) => {
  const query = `
    SELECT * FROM live_count 
    WHERE channel_name = $1
    ORDER BY updated_at DESC
  `;
  
  return await db.query(query, [channelName]);
};

/**
 * Actualizar totales
 */
const updateLiveCount = async (id, data) => {
  const query = `
    UPDATE live_count 
    SET view_count = COALESCE($2, view_count),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *
  `;
  
  const result = await db.query(query, [
    id,
    data.view_count,
  ]);
  
  return result.rows[0];
};

/**
 * Eliminar un registro
 */
const deleteLiveCount = async (id) => {
  const query = `
    DELETE FROM live_count 
    WHERE id = $1
    RETURNING *
  `;
  
  const result = await db.query(query, [id]);
  return result.rows[0];
};

// ============================================================================
// TABLA HISTÓRICO: live_count_history (Se guarda cada 30 segundos)
// ============================================================================

/**
 * Guardar en histórico (cada 30 segundos)
 */
const recordHistorySnapshot = async (data) => {
  // Primero obtener el ID de live_count
  let liveCountId = data.live_count_id;
  
  if (!liveCountId) {
    // Si no existe, crear o actualizar en live_count
    const liveRecord = await createOrUpdateLiveCount({
      channel_name: data.channel_name,
      platform: data.platform,
      view_count: data.view_count,
    });
    liveCountId = liveRecord.id;
  }
  
  // Ahora guardar en histórico
  const query = `
    INSERT INTO live_count_history (
      live_count_id, channel_name, platform, view_count
    ) VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  
  const result = await db.query(query, [
    liveCountId,
    data.channel_name,
    data.platform,
    data.view_count || 0,
  ]);
  
  return result.rows[0];
};
const getHistoryByChannelPlatform = async (channelName, platform, limit = 100) => {
  const query = `
    SELECT * FROM live_count_history 
    WHERE channel_name = $1 AND platform = $2
    ORDER BY recorded_at DESC
    LIMIT $3
  `;
  
  return await db.query(query, [channelName, platform, limit]);
};

/**
 * Obtener histórico por fecha
 */
const getHistoryByDate = async (date) => {
  const query = `
    SELECT * FROM live_count_history 
    WHERE DATE(recorded_at) = $1
    ORDER BY recorded_at DESC
  `;
  
  return await db.query(query, [date]);
};

/**
 * Obtener histórico por plataforma
 */
const getHistoryByPlatform = async (platform, limit = 100) => {
  const query = `
    SELECT * FROM live_count_history 
    WHERE platform = $1
    ORDER BY recorded_at DESC
    LIMIT $2
  `;
  
  return await db.query(query, [platform, limit]);
};

/**
 * Obtener resumen estadístico del histórico
 */
const getHistorySummary = async (platform, date) => {
  const query = `
    SELECT 
      channel_name,
      platform,
      COUNT(*) as total_snapshots,
      AVG(view_count) as avg_views,
      MAX(view_count) as max_views,
      MIN(view_count) as min_views,
      MAX(view_count) - MIN(view_count) as diff_views
    FROM live_count_history 
    WHERE platform = $1 AND DATE(recorded_at) = $2
    GROUP BY channel_name, platform
    ORDER BY max_views DESC
  `;
  
  return await db.query(query, [platform, date]);
};

// ============================================================================
// EXPORTAR FUNCIONES
// ============================================================================

module.exports = {
  // Tabla Principal (Totales)
  createOrUpdateLiveCount,
  getAllLiveCount,
  getLiveCountByPlatform,
  getLiveCountByChannel,
  updateLiveCount,
  deleteLiveCount,
  
  // Tabla Histórico
  recordHistorySnapshot,
  getHistoryByChannelPlatform,
  getHistoryByDate,
  getHistoryByPlatform,
  getHistorySummary,
};
