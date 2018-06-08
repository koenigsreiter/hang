const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const osmosis = require('osmosis');
const webpages = __dirname + '/static/';
const uuidv1 = require('uuid/v1');

var words = {
    Word: "Donaudampfschiffahrtskapitän",
    Desc: "Kapitän eines Schiffes, das auf der Donau fährt",
};
// randomword.com

app.get('/', (req, res) => {
    res.sendFile(webpages + 'index.html');
});

io.on('connection', (socket) => {
    var userName = "";
    console.log("A user connected!");

    socket.on('login', (msg) => {
        userName = msg;
        console.log("The username is: " + msg);
    });

    socket.emit('login/resp', {
        length: words.Word.length,
        roomID: uuidv1(),
    });
    
    socket.on('disconnect', () => {
        console.log(`${userName} has Disconnected!`);
    });

    socket.on('input', (msg) => {
        if (words.Word.toLowerCase().includes(msg)) {
            console.log(`User ${userName} submitted ${msg} which was in the Word!`);
            var indexes = [];
            for (let index = 0; index < words.Word.length; index++) {
                const char = words.Word[index].toLowerCase();
                if (char == msg) {
                    indexes.push(index);
                }
            }
            socket.emit('resp', {
                status: true,
                indizes: indexes,
                char: msg
            });
        } else {
            console.log(`User ${userName} submitted ${msg} which was not in the Word!`);
            socket.emit('resp', {
                status: false
            });
        }
    });

    socket.on('lose', (msg) => {
        socket.broadcast.emit('lose/resp', {
            roomID: msg,
            userName: userName
        });
    })
})

http.listen(3000, function(){
    console.log('listening on *:3000');
});