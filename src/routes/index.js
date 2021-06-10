const express = require("express");
const router = express.Router();
const hostsController = require("../controllers/hostsController");
const unitsController = require('../controllers/unitsController');
const Unit = require( '../models/Unit');
//const admsController = require('../controllers/admsController');
const usersController = require('../controllers/usersController');
const authController = require('../controllers/authController');
const Auth = require('../middleware/auth');

router.get("/", async (req, res) => {
    const units =  await Unit.readAll();
    res.render("index.njk", {
        viewDebug: true,
        logged: false,
        units: units,
        locals: req.locals,
    });
});

router.post('/hosts', Auth.isAuthenticated, hostsController.create);
router.get('/hosts', Auth.isAuthenticated, hostsController.readAll);
router.get('/hosts/unit/:id', Auth.isAuthenticated, hostsController.readAllByUnit);
router.get('/hosts/unit/:id/enabled', Auth.isAuthenticated, hostsController.readAllEnabledByUnit);
router.delete('/hosts/:id', Auth.isAuthenticated, hostsController.destroy);
router.put('/hosts/:id', Auth.isAuthenticated, hostsController.update);

//unidades
router.get( '/units', Auth.isAuthenticated, unitsController.readAll );
router.get( '/units/:id', Auth.isAuthenticated, unitsController.readById );
router.post( '/units', Auth.isAuthenticated, unitsController.create );
router.put( '/units/:id', Auth.isAuthenticated, unitsController.update );
router.delete( '/units/:id', Auth.isAuthenticated, unitsController.destroy );


router.post('/signin', authController.signin);

router.get('/signout', Auth.isAuthenticated, authController.signout);


//usuários
router.get('/users', Auth.isAuthenticated, usersController.readAll);
router.post('/signup', usersController.store);

module.exports = router;
