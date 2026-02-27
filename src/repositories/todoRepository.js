const {pool} = require('../db');

async function cargar(status) {
    let query = 'SELECT * FROM todos'
    const {rows}= await pool.query(query);
    return rows;
    
}

async function create(title) {
    const {rows} = await pool.query(
        'INSERT INTO todos (title) VALUES ($1) RETURNING *',
        [title]
    );
    return rows[0]; 
    
}

async function actualizar(id, data) {
  const fields = [];
  const values = [];
  let index = 1;

  if (data.title !== undefined) {
    fields.push(`title = $${index++}`);
    values.push(data.title);
  }

  if (data.completed !== undefined) {
    fields.push(`completed = $${index++}`);
    values.push(data.completed);
  }

  if (!fields.length) return null;

  values.push(id);

  const { rows } = await pool.query(
    `UPDATE todos SET ${fields.join(', ')}, updated_at = NOW()
     WHERE id = $${index}
     RETURNING *`,
    values
  );

  return rows[0];
}

async function eliminar(id) {
  await pool.query('DELETE FROM todos WHERE id = $1', [id]);
}

async function markAll(completed = true) {
  await pool.query('UPDATE todos SET completed = $1',
    [completed]
  );

}
async function inProgress() {
  let query = 'SELECT * FROM todos WHERE completed = false';
  const {rows} = await pool.query(query);
  return rows;


}


async function clearAll(){
  await pool.query('DELETE from todos');
}

async function completed() {
  let query = 'SELECT * FROM todos WHERE completed = true';
  const {rows} = await pool.query(query);
  return rows;


}

module.exports = {
  cargar,
  create,
  actualizar,
  eliminar,
  markAll,
  inProgress,
  clearAll,
  completed,
};