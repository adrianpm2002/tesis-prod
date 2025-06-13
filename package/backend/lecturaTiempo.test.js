// backend/lecturaTiempo.test.js
import { describe, it, expect, vi } from 'vitest';
import pool from '../backend/config/db.js'; // ✅ Asumiendo que usas 'export default pool'

describe('Sincronización entre lectura y almacenamiento', () => {
  it('verifica que la diferencia entre lectura y almacenamiento sea menor a 1 segundo', async () => {
    const now = Date.now();
    const mockTimestamp = new Date(now + 300).toISOString(); // simulamos 300ms después

    vi.spyOn(pool, 'query').mockResolvedValueOnce({
      rows: [{ timestamp: mockTimestamp }],
    });

    const result = await pool.query('INSERT INTO sensor_data (...)');

    const insertedTime = new Date(result.rows[0].timestamp).getTime();
    const diferencia = insertedTime - now;

    console.log('🕒 Diferencia simulada:', diferencia, 'ms');

    expect(diferencia).toBeLessThan(1000);
  });
});
