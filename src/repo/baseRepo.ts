import pool from '../database'; // Assuming you're using a pool for database connections

class BaseRepository {
  async query<T>(query: string, values: any[] = []): Promise<T[]> {
    try {
      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      console.error('Error executing custom query:', error);
      throw new Error('Database query failed');
    }
  }
 
  // Implementing the select method
  async select(arg0: string, arg1: { name: any }, arg2: string[]): Promise<any> {
    try {
      // Prepare the WHERE clause
      const conditions = Object.keys(arg1).map((key, index) => `${key} = $${index + 1}`).join(' AND ');

      // Prepare the SELECT query string
      const query = `SELECT ${arg2.join(', ')} FROM ${arg0} WHERE ${conditions}`;

      // Values to replace the placeholders
      const values = Object.values(arg1);

      // Execute the query
      const result = await pool.query(query, values);

      // Return the result rows
      return result.rows;
    } catch (err) {
      console.error('Error executing select query:', err);
      throw new Error('Database query failed');
    }
  }

  async findAll<T>(table: string, where?: { [key: string]: any }): Promise<T[]> {
    let query = `SELECT * FROM ${table}`;
  
    // If the `where` clause is provided, dynamically build the WHERE condition
    if (where) {
      const conditions = Object.entries(where)
        .map(([key, value]) => `${key} = '${value}'`)
        .join(" AND ");
      query += ` WHERE ${conditions}`;
    }
  
    const result = await pool.query(query);
    return result.rows;
  }
  

  async findOne<T>(table: string, condition: string | { [key: string]: any }, values?: any[]): Promise<T | null> {
    try {
      let query: string;
      let queryValues: any[] = [];
  
      if (typeof condition === 'string') {
        // SQL-style string condition
        query = `SELECT * FROM ${table} WHERE ${condition} LIMIT 1`;
        queryValues = values || [];
      } else {
        // Object condition
        const conditions = Object.keys(condition)
          .map((key, index) => `${key} = $${index + 1}`)
          .join(' AND ');
        
        query = `SELECT * FROM ${table} WHERE ${conditions} LIMIT 1`;
        queryValues = Object.values(condition);
      }
  
      const result = await pool.query(query, queryValues);
      return result.rows[0] || null;
    } catch (err) {
      console.error('Error executing findOne query:', err);
      throw new Error('Database query failed');
    }
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

  async insertMultiple<T>(table: string, data: Record<string, any>[], schema: Record<string, any>): Promise<T[]> {
    try {
      // Validate the data against the schema
      for (const record of data) {
        for (const key of Object.keys(schema)) {
          if (schema[key].required && !record[key]) {
            throw new Error(`${key} is required`);
          }
        }
      }

      // Prepare the keys and values for the bulk insert
      const keys = Object.keys(data[0]); // Assumes all records have the same keys
      const placeholders: string[] = [];
      const values: any[] = [];

      data.forEach((record, index) => {
        const valuePlaceholders = keys.map((_, i) => `$${i + 1 + index * keys.length}`).join(', ');
        placeholders.push(`(${valuePlaceholders})`);
        values.push(...Object.values(record));
      });

      // Build the INSERT query for multiple records
      const query = `
        INSERT INTO ${table} (${keys.join(', ')}) 
        VALUES ${placeholders.join(', ')} 
        RETURNING *
      `;

      // Execute the query
      const result = await pool.query(query, values);

      // Return the inserted rows
      return result.rows;
    } catch (err) {
      console.error('Error executing insertMultiple query:', err);
      throw new Error('Database insert failed');
    }
  }

  async update<T>(
    table: string,
    condition: string,
    conditionValues: any[], // Condition values like [trip_id]
    data: Record<string, any>
  ): Promise<T> {
    try {
      const setClause = Object.keys(data)
        .map((key, index) => `${key} = $${index + 1}`)
        .join(', ');
  
      const updateValues = Object.values(data);
      const adjustedCondition = condition.replace(/\$(\d+)/g, (_, match) => {
        return `$${parseInt(match) + updateValues.length}`;
      });
  
      const finalValues = [...updateValues, ...conditionValues];
      const query = `
        UPDATE ${table}
        SET ${setClause}
        WHERE ${adjustedCondition}
        RETURNING *
      `;

  
      const result = await pool.query(query, finalValues);
      return result.rows[0];
    } catch (error) {
      console.error('Error executing update query:', error);
      throw new Error('Database update failed');
    }
  }
  
  
  
  
  
  
  
  
  

}

export default new BaseRepository();
