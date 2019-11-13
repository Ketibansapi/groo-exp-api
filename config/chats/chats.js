const client = require('socket.io').listen(4000).sockets;

    // Connect Socket.io
    client.on('connection', function(socket){
        let chat = db.collection('chats');
        
        sendStatus = function(s){
            socket.emit('status', s);
        }

        chat.find().limit(100).sort({_id:1}).toArray(function(err, res){
            if(err){
                throw err;
            }
            socket.emit('output', res);
        });

        // Input events
        socket.on('input', function(data){
            let name = data.name;
            let message = data.message;

            if(name == '' || message == ''){
                sendStatus('Please fill the name and messages');
            } else {
                chat.insert({name: name, message: message}, function(){
                    client.emit('output', [data]);
                    sendStatus({
                        message: 'Message sent',
                        clear: true
                    });
                });
            }
        });

        // Clear the chats from mongo
        socket.on('clear', function(data){
            chat.remove({}, function(){
                socket.emit('cleared');
            });
        });
    });