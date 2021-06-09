const bcrypt = require("bcrypt");
const { conn } = require("../db");

const saltRounds = 10; //semente para salt de hash de senha

async function create(data) {
    const sql = `
  INSERT INTO
    users (id, login, password)
  VALUES
    (?, ?, ?)
  `;

    const db = await conn();

    const { id, login, password } = data;

    const hash = await bcrypt.hash(password, saltRounds);

    const { lastID } = await db.run(sql, [id, login, hash]);

    return lastID;
}

async function createAutoInc(data) {
    const sql = `
  INSERT INTO
    users (login, pwd_hash)
  VALUES
    (?, ?)
  `;

    const db = await conn();
    const { login, password } = data;
    const hash = await bcrypt.hash(password, saltRounds);
    const { lastID } = await db.run(sql, [login, hash]);
    return lastID;
}

async function readById(id) {
    const sql = `
    SELECT
      *
    FROM
      users
    WHERE
      users.id = ?
  `;

    const db = await conn();

    const food = await db.get(sql, id);

    return food;
}

async function readByLogin(login) {
    const sql = `
    SELECT
      *
    FROM
      users
    WHERE
      users.login = ?
  `;

    const db = await conn();

    const user = await db.get(sql, login);

    return user;
}

module.exports = { create, createAutoInc, readById, readByLogin };
