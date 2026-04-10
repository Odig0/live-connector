CREATE TABLE IF NOT EXISTS live_count (
    id SERIAL PRIMARY KEY,
    channel_name VARCHAR(255) NOT NULL,
    platform VARCHAR(50) NOT NULL CHECK (platform IN ('tiktok', 'facebook', 'youtube')),
    view_count INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLA 2: HISTÓRICO (Guarda cada 30 segundos)
CREATE TABLE IF NOT EXISTS live_count_history (
    id SERIAL PRIMARY KEY,
    live_count_id INTEGER REFERENCES live_count(id) ON DELETE CASCADE,
    channel_name VARCHAR(255) NOT NULL,
    platform VARCHAR(50) NOT NULL,
    view_count INTEGER DEFAULT 0,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_live_count_channel_platform ON live_count(channel_name, platform);
CREATE INDEX IF NOT EXISTS idx_live_count_history_live_id ON live_count_history(live_count_id);
CREATE INDEX IF NOT EXISTS idx_live_count_history_recorded_at ON live_count_history(recorded_at);
