/**
 * Servicio para operaciones con live_count
 * 
 * Maneja toda la lógica de negocio para registros de transmisiones en vivo
 */

const dbHelpers = require('../../config/db-helpers');

// ============================================================================
// TABLA PRINCIPAL: live_count (Totales)
// ============================================================================

/**
 * Crear o actualizar registro en tabla principal
 */
const createLiveRecord = async (data) => {
  try {
    return await dbHelpers.createOrUpdateLiveCount({
      channel_name: data.channel_name,
      platform: data.platform,
      view_count: data.view_count || 0,
    });
  } catch (error) {
    throw new Error(`Error al crear registro: ${error.message}`);
  }
};

/**
 * Obtener todos los registros
 */
const getAllRecords = async () => {
  try {
    return await dbHelpers.getAllLiveCount();
  } catch (error) {
    throw new Error(`Error al obtener registros: ${error.message}`);
  }
};

/**
 * Obtener registros por plataforma
 */
const getRecordsByPlatform = async (platform) => {
  try {
    return await dbHelpers.getLiveCountByPlatform(platform);
  } catch (error) {
    throw new Error(`Error al obtener registros por plataforma: ${error.message}`);
  }
};

/**
 * Obtener registros por canal
 */
const getRecordsByChannel = async (channel) => {
  try {
    return await dbHelpers.getLiveCountByChannel(channel);
  } catch (error) {
    throw new Error(`Error al obtener registros por canal: ${error.message}`);
  }
};

/**
 * Actualizar un registro
 */
const updateRecord = async (id, data) => {
  try {
    return await dbHelpers.updateLiveCount(id, {
      view_count: data.view_count,
    });
  } catch (error) {
    throw new Error(`Error al actualizar registro: ${error.message}`);
  }
};

/**
 * Eliminar un registro
 */
const deleteRecord = async (id) => {
  try {
    return await dbHelpers.deleteLiveCount(id);
  } catch (error) {
    throw new Error(`Error al eliminar registro: ${error.message}`);
  }
};

// ============================================================================
// TABLA HISTÓRICO: live_count_history (Se guarda cada 30 segundos)
// ============================================================================

/**
 * Guardar snapshot en histórico (cada 30 segundos)
 */
const saveHistorySnapshot = async (data) => {
  try {
    return await dbHelpers.recordHistorySnapshot({
      channel_name: data.channel_name,
      platform: data.platform,
      view_count: data.view_count || 0,
      live_count_id: data.live_count_id || null,
    });
  } catch (error) {
    throw new Error(`Error al guardar snapshot en histórico: ${error.message}`);
  }
};

/**
 * Obtener histórico por canal y plataforma
 */
const getHistoryByChannelPlatform = async (channel, platform, limit = 100) => {
  try {
    return await dbHelpers.getHistoryByChannelPlatform(channel, platform, limit);
  } catch (error) {
    throw new Error(`Error al obtener histórico: ${error.message}`);
  }
};

/**
 * Obtener histórico por fecha
 */
const getHistoryByDate = async (date) => {
  try {
    return await dbHelpers.getHistoryByDate(date);
  } catch (error) {
    throw new Error(`Error al obtener histórico por fecha: ${error.message}`);
  }
};

/**
 * Obtener histórico por plataforma
 */
const getHistoryByPlatform = async (platform, limit = 100) => {
  try {
    return await dbHelpers.getHistoryByPlatform(platform, limit);
  } catch (error) {
    throw new Error(`Error al obtener histórico por plataforma: ${error.message}`);
  }
};

/**
 * Obtener resumen estadístico del histórico
 */
const getHistorySummary = async (platform, date) => {
  try {
    return await dbHelpers.getHistorySummary(platform, date);
  } catch (error) {
    throw new Error(`Error al obtener resumen: ${error.message}`);
  }
};

module.exports = {
  // Tabla Principal
  createLiveRecord,
  getAllRecords,
  getRecordsByPlatform,
  getRecordsByChannel,
  updateRecord,
  deleteRecord,
  
  // Tabla Histórico
  saveHistorySnapshot,
  getHistoryByChannelPlatform,
  getHistoryByDate,
  getHistoryByPlatform,
  getHistorySummary,
};
