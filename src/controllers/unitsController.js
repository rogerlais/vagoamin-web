const Unit = require("../models/Unit");

const readAll = async (req, res) => {
    const units = await Unit.readAll();

    res.json(units);
};

const readById = async (req, res) => {
    const { id }  = req.params;
    const unit = await Unit.readById( id );
    res.json(unit);
};


const create = async (req, res) => {
    const { name, admId } = req.body;

    const newUnit = { name, admId };

    const unitId = await Unit.createAutoInc(newUnit);

    const unit = await Unit.readById(unitId);

    res.json(unit);
};

const update = async (req, res) => {
    const { id } = req.params;

    const { name, admId } = req.body;

    const updateUnit = { name, admId };

    await Unit.update(id, updateUnit);

    const unit = await Unit.readById(id);

    res.json(unit);
};

const destroy = async (req, res) => {
    const { id } = req.params;

    await Unit.destroy(id);

    res.status(204).send();
};

module.exports = { readAll, readById, create, update, destroy };
