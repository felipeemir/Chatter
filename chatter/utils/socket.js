'use strict';

const path = require('path');
const helper = require('./helper');

class Socket{
    
    constructor(socket){
        this.io = socket;
    }
    
    socketEvents(){
        
        this.io.on('connection', (socket) => {
            console.log('entrou socket');
            let chatListResponse = {};
            
            socket.on('chat-list', (data) => {
            
            if (data.userId == ''){
                chatListResponse.error = true;
                chatListResponse.message = 'User does not exists.';
                
                this.io.emit('chat-list-response',chatListResponse);
            }else{
                helper.getUserInfo(data.userId, (err, UserInfoResponse) => {
                    delete UserInfoResponse.password;
                    
                    helper.getChatList( socket.id, (err, response) => {
                        this.io.to(socket.id).emit('chat-list-response', {
                            error : false,
                            singleUser : false,
                            chatList : response
                        });
                        
                        socket.broadcast.emit('chat-list-response', {
                            error : false,
                            singleUser : true,
                            chatList : UserInfoResponse
                        });
                    });
                });
            }
            });
            
            socket.on('add-message', (data) => {
                console.log('enviar mensagem');
                console.log(data.message);
                if(data.message == ''){
                    console.log('erro1');
                    this.io.to(socket.id).emit('add-message-response', 'Message cant be empty.');
                }else if(data.fromUserId === ''){
                    console.log('erro2');
                    this.io.to(socket.id).emit('add-message-response', 'Unexpected error.');
                }else if(data.toUserId === ''){
                    console.log('erro3');
                    this.io.to(socke.id).emit('add-message-response', 'Select a user to chat.');
                }else{
                    console.log('acertou');
                    let toSocketId = data.toSocketId;
                    let fromSocketId = data.fromSocketId;
                    delete data.toSocketId;
                    data.timestamp = Math.floor(new Date() / 1000);
                    
                    helper.insertMessages(data, (error, response) => {
                        this.io.to(socket.id).emit('add-message-response', data);
                    });
                }
                
            });
            
            socket.on('logout', (data) => {
                const userId = data.userId;
                
                helper.logout(userId, false, (error, result) => {
                    
                    this.io.to(socket.id).emit('logout-response', {
                        error : false
                    });
                    
                    socket.broadcast.emit('chat-list-response', {
                        error : false,
                        userDisconnected : true,
                        SocketId : socket.id
                    });
                    
                });
            });
            
            socket.on('disconnect', () => {
                socket.broadcast.emit('chat-list-response', {
                    error : false,
                    userDisconnected : true,
                    socketId : socket.id
                });
            });
            
        });
        
    }
    
    socketConfig(){
        
        this.io.use(function(socket, next){
            let userId = socket.request._query['userId'];
            let userSocketId = socket.id;
            const data = {
                id : userId,
                value : {
                    $set : {
                        socketId : userSocketId,
                        online : 'Y'
                    }
                }
            }
            
            helper.addSocketId( data, (error, response) => {
                //scket id updated.
            });
            next();
        });
        
        this.socketEvents();
    }
    
}

module.exports = Socket;