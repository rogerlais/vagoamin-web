const { conn } = require("../db");


const UNIT_FIELDS = 'units.id , units.name , units.adm_id , units.max_on, users.login';

async function create(data) {
    const sql = `
    INSERT INTO
      units (id, name, adm_id)
    VALUES
      (?, ?, ?)
    `;

    const db = await conn();

    const { id, name, adm_id } = data;

    const { lastID } = await db.run(sql, [id, name, adm_id]);

    return lastID;
}

async function createAutoInc(data) {
    const sql = `
    INSERT INTO
      units (name, adm_id)
    VALUES
      (?, ?)
    `;

    const db = await conn();

    const { name, admId } = data;

    const { lastID } = await db.run(sql, [name, admId]);

    return lastID;
}

async function readAll() {
    const sql = `
    SELECT 
        ${UNIT_FIELDS}
    from 
        units inner JOIN users
    where 
        ( units.adm_id = users.id )`

    const db = await conn();

    const units = await db.all(sql);

    return units;
}

async function readById(id) {
    const sql = `
    SELECT
    ${UNIT_FIELDS}
    FROM
      units inner join users
    WHERE
      ( units.id = ? ) and ( units.adm_id = users.id )
  `;

    const db = await conn();

    const unit = await db.get(sql, id);

    return unit;
}

async function update(id, data) {
    const sql = `
    UPDATE
    units
    SET
      name = ? , adm_id = ?
    WHERE
      id = ?
  `;
    const db = await conn();
    const { name, admId } = data;
    const { changes } = await db.run(sql, [name, admId, id]);
    return changes;
}

async function destroy(id) {
    const sql = `
    DELETE FROM
    units
    WHERE
      id = ?
  `;

    const db = await conn();
    const { lastID } = await db.run(sql, [id]);
    return lastID;
}

module.exports = { create, createAutoInc, readAll, readById, update, destroy };
