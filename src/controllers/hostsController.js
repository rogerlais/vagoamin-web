const Host = require("../models/Host.js");
//!const Adm = require("../models/Adm.js");

const readAll = async (req, res) => {
    const hosts = await Host.readAll();

    res.json(hosts);
};

const create = async (req, res) => {
    const { name } = req.body;

    const newHost = { name };

    const hostId = await Host.createAutoInc(newHost);

    const host = await Host.readById(hostId);

    res.json(host);
};

const update = async (req, res) => {
    const { id } = req.params;

    const { name } = req.body;

    const updateHost = { name };

    await Host.update(id, updateHost);

    const host = await Host.readById(id);

    res.json(host);
};

const destroy = async (req, res) => {
    const { id } = req.params;

    await Host.destroy(id);

    res.status(204).send();
};

module.exports = { readAll, create, update, destroy };
