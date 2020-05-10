'use strict'
const express = require('express')
const path = require('path')
const app = express()

/**
 * Import protocol HTTP
 * pass createServer to APP
 * and define protocol HTTP
 */
const server = require('http').createServer(app)


/**
 * WebSocket.OI is a new protocol and it's to inner 
 * the back-end with front end
 */
const io = require('socket.io')(server)//protocol WSS and pass to IO

/**
 * define the folder responsable for the public files
 * Use Express.static to inform that folder will be static
 * path.join -> It's join the root + public
 */
app.use(express.static(path.join(__dirname, 'public')))

/**
 * Using VIEWS as HTML, because NOJE uses EJS as default
 * and indicates where are the files
 */
app.set('views',path.join(__dirname,'public'))
//define the engine
app.engine('html', require('ejs').renderFile)
app.set('view engine','view')

//route
app.use('/', (req, res) => {
    res.render('index.html')
})

/**
 * Define what is the conexion
 *
 */

 let messages = [] //save all messages

 //On receice all data
 io.on('connection', socket => {
     console.log(`Socket has been connected: ${socket.id}`)

     //when a new socket is connected it'll send all messages
     socket.emit('previuosMessages', messages)
     
     //the same name what is on the front
     //it'll receive th data
     socket.on('sendMessage', data => {
         //push a message
        messages.push(data)
        //This method will do a broadcast to every socket connected
        socket.broadcast.emit('receiveMessage', data)
     })
 })

server.listen(3000)
console.log(`Server is running on the port 3000`)