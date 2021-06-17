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

const readById = async (req, res) => {
    const { id } = req.params;

    const ret = await Host.readById(id);
    res.status(200).send(ret);
};

const readAllEnabledByUnit = async (req, res) => {
    const { id } = req.params;

    const ret = await Host.readAllEnabledByUnit(id);
    res.status(200).send(ret);
};

const readAllByUnit = async (req, res) => {
    const { id } = req.params;

    const ret = await Host.readAllByUnit(id);
    res.status(200).send(ret);
};

const filter = async ( req, res ) => {
    //no momento não questiona nada, passa a clausula para a consulta
    const { query } = req.body;  //todo: tratar corretamente a entrada para montar uma "where" eficiente
    const ret = await Host.filter( query );
    res.status(200).send( ret );
}

module.exports = { filter, readAll, readById, readAllByUnit, readAllEnabledByUnit, create, update, destroy };
