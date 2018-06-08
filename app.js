const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const osmosis = require('osmosis');
const webpages = __dirname + '/static/';
var words = {
    Word: "Donaudampfschiffahrtskapitän",
    Desc: "Kapitän eines Schiffes, das auf der Donau fährt",
};
// randomword.com

app.get('/', (req, res) => {
    res.sendFile(webpages + 'index.html');
});

io.on('connection', (socket) => {
    console.log("A user connected!");
    
    socket.on('disconnect', () => {
        console.log("A user has disconnected!");
    });
    socket.on('input', (msg) => {
        if (words.Word.includes(msg)) {
            console.log(`User submitted ${msg} which was in the Word!`);
            socket.emit('resp', true);
        } else {
            console.log(`User submitted ${msg} which was not in the Word!`);
            socket.emit('resp', false);
        }
    });
})

http.listen(3000, function(){
    console.log('listening on *:3000');
});