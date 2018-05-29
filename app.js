const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const webpages = __dirname + '/static/';

app.get('/', (req, res) => {
    res.sendFile(webpages + 'index.html');
});

io.on('connection', (socket) => {
    console.log("A user connected!");
    socket.on('disconnect', () => {
        console.log("A user has disconnected!");
    })
})

http.listen(3000, function(){
    console.log('listening on *:3000');
});