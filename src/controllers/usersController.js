const User = require("../models/User");

const store = async (req, res) => {
    const { login, password } = req.body;

    try {
        const newUser = { login, password };

        await User.createAutoInc(newUser);

        res.json({ message: "user created" });
    } catch (error) {
        let message = error.message;

        if (error.message.includes("UNIQUE")) {
            message = "Login já existe na base de dados";
        }

        console.error(error.message);

        res.status(500).json({ message });
    }
};

const readAll = async ( req, res ) =>{
    const users = await User.readAll();
    res.json(users);
}

module.exports = { store, readAll};
