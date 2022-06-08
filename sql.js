const { Pool } = require ("pg");

const config = {
    user: "postgres",
    host: "localhost",
    password: "Tucambio2306",
    database: "skatepark",
    port: '5432',
};

const pool = new Pool(config);

const nuevoUsuario = async (email, nombre, password, anos_experiencia, especialidad, foto, auth) => {

    const SQLQuery = {
        text: "INSERT INTO skaters (email, nombre, password, anos_experiencia, especialidad, foto, estado) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;",
        values: [email, nombre, password, anos_experiencia, especialidad, foto, false],
    };
    const result = await pool.query(SQLQuery);
    return result.rows[0];
};

const getUsuarios = async () => {
    const SQLQuery = {
        text: "SELECT * FROM skaters",
    };
    const { rows } = await pool.query(SQLQuery);
    return rows;
};


const getUsuarioByEmail = async (email) =>{
    try {
      const result = await pool.query(
        `SELECT * FROM skaters WHERE email = '${email}'`
      );
      return result.rows[0];
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

const login = async ({ email, password}) => {
    const SQLQuery = {
        text: "SELECT * FROM skaters WHERE (email, password) VALUES ($1, $2) RETURNING *;",
        values: [email, password],
    };
    const result = await pool.query(SQLQuery);
    return result.rows[0];
};

const setUsuarioStatus = async ( id, auth) => {
    try{
    const SQLQuery = {
        text: `UPDATE skaters SET estado = $2 WHERE id = $1 RETURNING *;`, 
        values: [id, auth],
    }
    const result = await pool.query(SQLQuery);
    return result.rows[0];
    }catch (e) {
        throw e;
    }
};

const updateSkater = async (id, nombre, hashedNewPassword, anos_experiencia, especialidad) => {
  try{
    const SQLQuery = {
        text: `UPDATE skaters SET  nombre = $2, password = $3 , anos_experiencia = $4 , especialidad = $5  WHERE id = $1 RETURNING *`, 
        values: [id, nombre, hashedNewPassword, anos_experiencia, especialidad],
    }
    const result = await pool.query(SQLQuery);
    return result.rows[0];
    }catch (e) {
        throw e;
    }
};

  const deleteSkater = async (id) => {
    const result = await pool.query(
      `DELETE FROM skaters WHERE id = '${id}' `
    );
    const skater = result.rows[0];
    return skater;
  };


module.exports = {
    nuevoUsuario,
    getUsuarios,
    getUsuarioByEmail,
    login,
    setUsuarioStatus,
    updateSkater,
    deleteSkater
}
