const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function signin(req, res) {
    const { login, password } = req.body;

    const user = await User.readByLogin(login);

    const match = user
        ? await bcrypt.compare(password, user.pwd_hash)
        : undefined;

    if (user && match) {
        var token = jwt.sign(
            {
                userId: user.id,
            },
            process.env.SECRET,
            {
                expiresIn: 3000, // 50 min
            }
        );

        console.log(token);

        return res.json({ auth: true, token: token });
    } else {
        return res.status(401).send("Login inválido!");
    }
}

function signout(req, res) {
    return res.send({ auth: false, token: null });
}

module.exports = { signin, signout };
