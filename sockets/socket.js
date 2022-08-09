const { io } = require('../index');

const Bands = require('../models/bands');
const Band = require('../models/band');
const { comprobarJwt } = require('../helpers/jswt');
const { usuarioConectado, usuarioDesconectado, grabarMensaje } = require('../controller/socket');

const bands = new Bands();

bands.addBand(new Band('Breaking Benjamin'));
bands.addBand(new Band('Bon Jovi'));
bands.addBand(new Band('Héroes del Silencio'));
bands.addBand(new Band('Metallica'));


// Mensajes de Sockets
io.on('connection', async (client) => {
    console.log('Cliente conectado');

    const [valido, uid] = comprobarJwt(client.handshake.headers['x-token']);

    // verificar autenticacion
    if (!valido) { return client.disconnect(); }

    // cliente autenticado
    usuarioConectado(uid);

    // ingresar a usuario a una sala
    // sala  global todos conectados grupal
    // enviar algo a un usuario es con el client.id
    client.join(uid);

    // client.to(uid).emit('')

    // escuchar mensaje personal

    client.on('mensaje-personal', async (payload) => {
        // Grabar mensaje
        await grabarMensaje(payload)
        io.to(payload.para).emit('mensaje-personal', payload);
    })


    client.on('disconnect', () => {
        console.log('Cliente desconectado');
        usuarioDesconectado(uid);
    });

});
