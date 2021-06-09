const { conn } = require("../db");

async function create(data) {
    const sql = `
    INSERT INTO
      hosts (id, name)
    VALUES
      (?, ?)
    `;

    const db = await conn();

    const { id, name } = data;

    const { lastID } = await db.run(sql, [id, name]);

    return lastID;
}

async function createAutoInc(data) {
    const sql = `
    INSERT INTO
      hosts (name)
    VALUES
      (?)
    `;

    const db = await conn();

    const { name } = data;

    const { lastID } = await db.run(sql, [name]);

    return lastID;
}

async function readAll() {
    const sql = `
    SELECT
      hosts.id, hosts.name
    FROM
      hosts
  `;

    const db = await conn();

    const hosts = await db.all(sql);

    return hosts;
}

async function readById(id) {
    const sql = `
    SELECT
      hosts.id, hosts.name
    FROM
      unit INNER JOIN hosts
    WHERE
      unit.id = hosts.unit_id AND
      hosts.id = ?
  `;

    const db = await conn();

    const host = await db.get(sql, id);

    return host;
}

async function update(id, data) {
    const sql = `
    UPDATE
      hosts
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
      hosts
    WHERE
      id = ?
  `;

    const db = await conn();

    const { lastID } = await db.run(sql, [id]);

    return lastID;
}

module.exports = { create, createAutoInc, readAll, readById, update, destroy };
