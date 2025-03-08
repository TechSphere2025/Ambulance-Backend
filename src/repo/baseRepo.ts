import pool from '../database';

class BaseRepository {
  async findAll<T>(table: string): Promise<T[]> {
    const result = await pool.query(`SELECT * FROM ${table}`);
    return result.rows;
  }

  async findOne<T>(table: string, condition: string, values: any[]): Promise<T | null> {
    const result = await pool.query(`SELECT * FROM ${table} WHERE ${condition} LIMIT 1`, values);
    return result.rows[0] || null;
  }

  async insert<T>(table: string, data: Record<string, any>, schema: Record<string, any>): Promise<T> {
    // Validate data against schema
    for (const key of Object.keys(schema)) {
      if (schema[key].required && !data[key]) {
        throw new Error(`${key} is required`);
      }
    }

    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');

    const result = await pool.query(
      `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`,
      values
    );
    return result.rows[0];
  }
}
  
  export default new BaseRepository();
  