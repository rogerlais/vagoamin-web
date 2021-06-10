const jwt = require("jsonwebtoken");

function isAuthenticated(req, res, next) {
    const authorization = req.headers.authorization;
    if (!authorization) {
        //return false;
        // res.statusCode = 404;
        // res.setHeader("Content-Type", "text/plain");
        // res.end("Cannot " + req.method + " " + req.url);
        //return res.redirect( '/signin' );
        //return next( req, res );
        //res.res.send({ auth: false, message: "Token não informado." }).
        re.status(401).send({ auth: false, message: "Token não informado." });
    } else {
        const [, token] = authorization.split(" ");
        jwt.verify(token, process.env.SECRET, function (err, decoded) {
            if (err) {
                return res
                    .status(500)
                    .send({ auth: false, message: "Token inválido." });
            } else {
                const { userId } = decoded;
                req.userId = userId;
                req.locals = {
                    userId,
                    isAuth: true,
                };
                next();
            }
        });
    }
}

module.exports = { isAuthenticated };
