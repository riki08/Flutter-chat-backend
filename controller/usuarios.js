const { response } = require("express");

const Usuario = require('../models/usuario');


const getUsuarios = async (req, res = response) => {

    const desde = Number(req.query.desde) || 0;

    const usuarios = await Usuario.find({ _id: { $ne: req.uid } })
        .sort('-online')
        .skip(desde)
        .limit(20)

    // {ok: true, msg: 'usuarios'}
    res.json({
        ok: true,
        usuarios,
        desde
    })
}


module.exports = {
    getUsuarios
}