const { conn } = require("../db");

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
      units (name, adm)
    VALUES
      (?, ?)
    `;

    const db = await conn();

    const { name, adm_id } = data;

    const { lastID } = await db.run(sql, [name, adm_id]);

    return lastID;
}

async function readAll() {
    const sql = `
    SELECT
      units.id, units.name, units.adm_id
    FROM
      units
  `;

    const db = await conn();

    const units = await db.all(sql);

    return units;
}

async function readById(id) {
    const sql = `
    SELECT
    units.id, units.name
    FROM
      unit 
    WHERE
      units.id = ?
  `;

    const db = await conn();

    const unit = await db.get(sql, id);

    return unit;
}

async function update(data) {
    const sql = `
    UPDATE
    units
    SET
      name = ? , adm_id = ?
    WHERE
      id = ?
  `;

    const db = await conn();

    const { name, unit_id } = data;

    const { changes } = await db.run(sql, [name, unit_id, id]);

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
