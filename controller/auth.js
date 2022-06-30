const { response } = require("express");
const Usuario = require("../models/usuario");
const bcrypt = require('bcryptjs');
const { generarJwt } = require("../helpers/jswt");



const crearUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try {
        const existeEmail = await Usuario.findOne({ email });

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya esta registrado'
            });
        }

        const usuario = new Usuario(req.body);

        //encriptar contrasena
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);


        await usuario.save();

        // generar  JWT json web token
        const token = await generarJwt(usuario.id);

        res.json(
            {
                ok: true,
                usuario,
                token
            }
        );
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }



}

const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        const usuarioDb = await Usuario.findOne({ email });

        if (!usuarioDb) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            })
        }

        const validPassword = bcrypt.compareSync(password, usuarioDb.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contrasena no valida'
            })
        }

        // si pasa genera JWT

        const token = await generarJwt(usuarioDb.id);

        res.json(
            {
                ok: true,
                usuario: usuarioDb,
                token
            }
        );

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}


const renewToken = async (req, res = response) => {

    const uid = req.uid;
    const token = await generarJwt(uid);

    const usuario = await Usuario.findById(uid);

    res.json({
        ok: true,
        usuario,
        token
    })
}

module.exports = { crearUsuario, login, renewToken };