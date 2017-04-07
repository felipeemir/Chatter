import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import * as io from 'socket.io-client';

@Injectable()
export class SocketService {

	private BASE_URL = 'http://localhost:4000';  
  	private socket;

  	constructor() {}

  	connectSocket(userId:string){
  		this.socket = io(this.BASE_URL,{ query: `userId=${userId}`});
  	}
 
	sendMessage(message:any):void{
        console.log('entrou');
		this.socket.emit('add-message', message);
        console.log('saiu');
	}

	logout(userId):any{

		this.socket.emit('logout', userId);

		let observable = new Observable(observer => {
			this.socket.on('logout-response', (data) => {
				observer.next(data);    
			});

			return () => {
				
				this.socket.disconnect();
			};  
		})     
		return observable;
	}

	receiveMessages():any{ 
        console.log('ReceiveMessage');
		let observable = new Observable(observer => {
			this.socket.on('add-message-response', (data) => {
				observer.next(data);    
			});

			return () => {
				this.socket.disconnect();
			};  
		});     
		return observable;
	}

	getChatList(userId:string):any {

		this.socket.emit('chat-list' , { userId : userId });

		let observable = new Observable(observer => {
			this.socket.on('chat-list-response', (data) => {
				observer.next(data);    
			});

			return () => {
				this.socket.disconnect();
			};  
		})     
		return observable;
	} 
    
    getSocketId(userId:string):any {
        return this.socket.io.engine.id;
    }

}
