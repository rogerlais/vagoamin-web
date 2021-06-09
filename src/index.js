//src/index.js

require("dotenv").config();
const fs = require("fs");
const express = require("express");
const morgan = require("morgan");
const nunjucks = require("nunjucks");
const routes = require("./routes");
//todo: - repor - const Seed = require("./seeders");
//todo: - repor - const Migration = require("./migrations");
//todo: - repor - const { dbFile } = require("./db");

const app = express();

app.use(morgan("tiny"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

//!Nunjucks configuration
//
app.set("view engine", "njk");

//Registro de rotina global
function getVars() {
    return this.getVariables();
}
const cfg = nunjucks.configure("src/views", {
    express: app,
    autoescape: true,
    noCache: true,
});
nunjucks.defaultCfg = cfg;
cfg.addGlobal("getNunjucksVars", getVars);

//todo - repor abaixo
// (async () => {
// 	if (!fs.existsSync(dbFile)) {
// 		await Migration.up();
// 		await Seed.up();
// 	}
// })();


//ajuste das rotas
app.use(routes);

app.use((req, res, next) => {
    res.status(404).send("Content not found");
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Internal server error");
});

let port = 3003;
app.listen(port, () => {
    // const addr = this.server.address();
    // const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
    // debug(`Listening on ${bind}`);
    // console.log(`Listening on ${JSON.stringify(addr)}`);

    console.log(`Server running on port ${port}`);
    console.log("Rotas presentes nesta aplicação:");
    if (app._router.stack) {
        app._router.stack.forEach(function (r) {
            if (r.route && r.route.path) {
                console.log(r.route.path);
            }
        });
    } else {
        console.log("Nenhum registrada");
    }
    const bkUtils = require("./bk_utils");
    bkUtils.logRoutes(app);
    console.log("Serviço iniciado!");
});
