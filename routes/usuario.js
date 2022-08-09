// path api/usuarios


const { Router } = require('express');
const { validarJwt } = require('../middlewares/validar-jwt');
const { getUsuarios } = require('../controller/usuarios');

const router = Router();



// middleware validarJWT
router.get('/', validarJwt, getUsuarios);


module.exports = router;