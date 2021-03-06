// Server config
const express = require('express');
const app = express();
var server = require('http').Server(app);
const io = require('socket.io').listen(server);
const path = require('path');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host     : '10.25.10.21',
    user     : 'g1',
    password : 'XyNFK1br8uvvb9IS',
    database : 'g1'
  });

connection.connect();

app.use('/js',express.static(__dirname + '/src/app/game/js'));
app.use('/assets',express.static(__dirname + '/src/assets'));


// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/demo'));

app.get('/*', function(req, res) {
    res.sendFile('index.html', {root: 'dist/demo/'}
  );
  });


// Player config
const players = {};
io.on('connection', function (socket) {
    console.log('a player connected: ', socket.id);

    // create a new player and add it to our players object
    players[socket.id] = {
        flipX: false,
        x: Math.floor(50),
        y: Math.floor(100),
        playerId: socket.id
    };

    // send all current players
    socket.emit('CURRENT_PLAYERS', players);

    // update all other players of the new player
    socket.broadcast.emit('NEW_PLAYER', players[socket.id]);

    socket.on('PLAYER_CONNECTED', function () {
        socket.broadcast.emit('PLAYER_CONNECTED', players[socket.id]);
        console.log('A player connected!')
    });

    // update movements of player
    socket.on('PLAYER_MOVED', function (movementData) {
        players[socket.id].x = movementData.x;
        players[socket.id].y = movementData.y;

        socket.broadcast.emit('PLAYER_MOVED', players[socket.id]);
    });

    // when a player disconnects, remove them from our players object
    socket.on('disconnect', function () {
        console.log('user disconnected: ', socket.id);
        delete players[socket.id];

        // emit a message to all players to remove this player
        io.emit('PLAYER_DISCONNECT', socket.id);
    });

      //Database

      socket.on('SIGNIN', function (enterdata) {
        var sql = "INSERT INTO joueur (id_joueur, pseudo, mdp) VALUES ('"+enterdata.id+"', '"+enterdata.pseudo+"', '"+enterdata.mdp+"')";
    connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
    });

    });


    socket.on('LOGIN', function (enterdata) {
        var sql = "INSERT INTO joueur (pseudo, mdp) VALUES ('"+enterdata.pseudo+"', '"+enterdata.mdp+"')";
    connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
    });

    });



});

// Start the server
const port = 8080;
server.listen(port,function(){
    console.log('Listening on '+server.address().port);
});
