// path: /api/mensajes


const { Router } = require('express');
const { obtenerChat } = require('../controller/mensajes');
const { validarJwt } = require('../middlewares/validar-jwt');


const router = Router();



// middleware validarJWT
router.get('/:de', validarJwt, obtenerChat);


module.exports = router;