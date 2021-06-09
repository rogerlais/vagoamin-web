const express = require("express");
const router = express.Router();
const hostsController = require("../controllers/hostsController");
const unitsController = require('../controllers/unitsController');
const Unit = require( '../models/Unit');
// const admsController = require('../controllers/admsController');
const usersController = require('../controllers/usersController');
const authController = require('../controllers/authController');
const Auth = require('../middleware/auth');

router.get("/", async (req, res) => {
    //res.render("index.njk", { viewDebug: true, hosts: hosts, data : JSON.stringify( hosts ) });
    const units =  await Unit.readAll();
    res.render("index.njk", {
        viewDebug: true,
        logged: false,
        units: units,
    });
});

router.post('/hosts', Auth.isAuthenticated, hostsController.create);
router.get('/hosts', Auth.isAuthenticated, hostsController.readAll);
router.get('/hosts/unit/:id', Auth.isAuthenticated, hostsController.readAllByUnit);
router.delete('/hosts/:id', Auth.isAuthenticated, hostsController.destroy);
router.put('/hosts/:id', Auth.isAuthenticated, hostsController.update);

//unidades
router.get( '/units', Auth.isAuthenticated, unitsController.readAll );
router.post( '/units', Auth.isAuthenticated, unitsController.create );
router.put( '/units', Auth.isAuthenticated, unitsController.update );
router.delete( '/units/:id', Auth.isAuthenticated, unitsController.destroy );


// router.get('/adms', Auth.isAuthenticated, admsController.readAll);

router.post('/signin', authController.signin);

router.get('/signout', Auth.isAuthenticated, authController.signout);

router.post('/signup', usersController.store);

module.exports = router;
