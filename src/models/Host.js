const { conn } = require("../db");

const HOST_FIELDS =
    "hosts.id, hosts.name, hosts.IPV4, hosts.online, hosts.lastcheck, hosts.unit_id, hosts.always_on, hosts.mac";

async function filter(statment) {
    const sql = `
    SELECT
    ${HOST_FIELDS}
    FROM
      hosts
    WHERE
        ${statment}
  `;
    const db = await conn();
    const hosts = await db.all(sql);
    return hosts;
}

async function create(data) {
    const sql = `
    INSERT INTO
      hosts (id, name, unit_id, always_on)
    VALUES
      (?, ?, ?, ?)
    `;

    const db = await conn();

    const { id, name, unit_id, always_on } = data;

    const { lastID } = await db.run(sql, [id, name, unit_id, always_on]);

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
    ${HOST_FIELDS}
    FROM
      hosts
  `;

    const db = await conn();
    const hosts = await db.all(sql);
    return hosts;
}

async function readAllEnabledByUnit(unitId) {
    const sql = `
    SELECT
    ${HOST_FIELDS}
    FROM
      hosts
    WHERE
      ( hosts.unit_id = ? ) and ( hosts.always_on )
  `;

    const db = await conn();
    const hosts = await db.all(sql, unitId);
    return hosts;
}

async function readAllByUnit(unitId) {
    const sql = `
    SELECT
    ${HOST_FIELDS}
    FROM
      hosts
    WHERE
      hosts.unit_id = ?
  `;

    const db = await conn();

    const hosts = await db.all(sql, unitId);

    return hosts;
}

async function readById(id) {
    const sql = `
    SELECT
    ${HOST_FIELDS}
    FROM
      hosts 
    WHERE
      hosts.id = ?
  `;

    const db = await conn();

    const host = await db.get(sql, id);

    return host;
}


async function wake( id, data ){
    console.log( "Rotina não implementada - Acordar computador !!");
    //todo referencia para iniciar processo wol.sh com os argumentos
    const execSync = require('child_process').execSync;
    // import { execSync } from 'child_process';  // replace ^ if using ES modules
    
    const output = execSync('ls', { encoding: 'utf-8' });  // the default is 'buffer'
    console.log('Output was:\n', output);    
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

module.exports = {
    create,
    createAutoInc,
    filter,
    readAll,
    readById,
    readAllByUnit,
    readAllEnabledByUnit,
    update,
    destroy,
};
