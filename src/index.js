const path = require('path') //it comes with node, I dont have to install it
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

const app = express()
const server = http.createServer(app) //it does change things express library does this behind the scenes.....
const io = socketio(server)


const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))


// Socket.emit => sends an event  to a specific client 
// Io.emit => sends an event to every connected client
// Socket.broadcast.emit => sends an event to every connected client except the original socket(e.g someone that leaves the group)
// io.to.emit => is used to emit an event to everybody in a specific room = to emit to everybody in the room and not to people outside the room
// socket.broadcast.to.emit => is to emit event to everybody in the group except the <socket>




io.on('connection', (socket) => { //connections are built i event
    console.log('New WebSocket connection')

    socket.on('join', (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options }) 
      
        if (error) {
            return callback(error)
        }

        socket.join(user.room)
        
    socket.emit('message', generateMessage('Admin', 'Welcome'))
    socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined !`))
    io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room)
    })

    callback()

    })

    // send message callback emit message
    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('Profanity is prohibited !')
        }


        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback()
    })


// Send message callback emit location message
    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })
    
    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
 
        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left the group`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }      
    })
})



//instead of app.listen, we change it to server.listen
server.listen(port, () => {
    console.log(`Server is running on port ${port} ! !! !!!`)
})


