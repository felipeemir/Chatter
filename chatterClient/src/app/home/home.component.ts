import { Component, OnInit  } from '@angular/core';
import { ActivatedRoute ,Router } from '@angular/router';

import { SocketService } from './../socket.service';
import { HttpService } from './../http.service';
import { ChatService } from './../chat.service';

@Component({
	selector: 'app-home',
  	templateUrl: './home.component.html',
  	styleUrls: ['./home.component.css'],
  	providers : [ChatService,HttpService,SocketService]
})
export class HomeComponent implements OnInit {
	
	private overlayDisplay = false;
	private selectedUserId = '';
	private selectedSocketId = '';
	private selectedUserName = '';	

	private username = null;
	private userId = null;
	private socketId = null;
	private chatListUsers = [];
	private message = '';
	private messages = null;

	constructor( 
    	private chatService : ChatService,
		private socketService : SocketService,
		private route :ActivatedRoute,
		private router :Router
	) { }

	ngOnInit() {
        if(this.messages == null){
            this.messages = [];
        }
        
		this.userId = this.route.snapshot.params['userid'];

		if(this.userId === '' || typeof this.userId == 'undefined') {
			this.router.navigate(['/']);
		}else{

			this.chatService.userSessionCheck(this.userId,( error, response )=>{
	    		if(error) {
	    			this.router.navigate(['/']); /* Home page redirection */
	    		}else{
	    			
	    			this.username = response.username;
	      			this.overlayDisplay = true;

					this.socketService.connectSocket(this.userId);

					this.socketService.getChatList(this.userId).subscribe(response => {
	      				
	      				if(!response.error) {
	      					
	      					if(response.singleUser) {

	      						if(this.chatListUsers.length > 0) {
	      							this.chatListUsers = this.chatListUsers.filter(function( obj ) {
										return obj._id !== response.chatList._id;
									});
	      						}

	      						this.chatListUsers.push(response.chatList);

	      					}else if(response.userDisconnected){
	      						this.chatListUsers = this.chatListUsers.filter(function( obj ) {
									return obj.socketId !== response.socketId;
								});
	      					}else{
	      						this.chatListUsers = response.chatList;
	      					}
	      				}else{
	      					alert(`Chat list failure.`);
	      				}
			    	});

                    console.log('1');
			    	this.socketService.receiveMessages().subscribe(response => {
                    console.log('2');
			    		if(this.selectedUserId && this.selectedUserId == response.fromUserId) {
                        console.log('3');
			    			this.messages.push(response);
                            console.log('4');
			    			setTimeout( () =>{
                            console.log('5');
			    					document.querySelector(`.message-thread`).scrollTop = document.querySelector(`.message-thread`).scrollHeight;
			    			},100);
			    		}else{
                        console.log('merda foda');
                        }
			    	});
	    		}
	    	});
		}
	}

	selectedUser(user):void{
		this.selectedUserId = user._id;
		this.selectedSocketId = user.socketId;
		this.selectedUserName = user.username;

        console.log('dfdf');
		this.chatService.getMessages({ userId : this.userId,toUserId :user._id} , ( error , response)=>{
			if(!response.error) {
                console.log(response);
				this.messages = response.messages;
			}else{
                console.log(response);
            }
		});
	}

	isUserSelected(userId:string):boolean{
		if(!this.selectedUserId) {
			return false;
		}
		return this.selectedUserId ===  userId ? true : false;
	}

	sendMessage(event){
        if(this.messages == null){
            this.messages = [];
        }
        
		if(event.keyCode === 13) {
			if(this.message === '' || this.message === null) {
				alert(`Message can't be empty.`);
			}else{
                if (this.message === '' || this.message === null) {
					alert(`Message can't be empty.`);
				}else if(this.userId === ''){
					this.router.navigate(['/']);					
				}else if(this.selectedUserId === ''){
					alert(`Select a user to chat.`);
				}else{
                    
                    this.socketId = this.socketService.getSocketId(this.userId);
                
					const data = {
						fromUserId : this.userId,
						message : (this.message).trim(),
						toUserId : this.selectedUserId,
						toSocketId : this.selectedSocketId,
						fromSocketId : this.socketId
					}
                    
					this.messages.push(data);
					
                    setTimeout( () =>{
	    					document.querySelector(`.message-thread`).scrollTop = document.querySelector(`.message-thread`).scrollHeight;
	    			},100);
					
					this.message = null;
					this.socketService.sendMessage(data);
				}
			}
		}
	}

	alignMessage(userId){
		return this.userId ===  userId ? false : true;
	}


	logout(){
		this.socketService.logout({userId : this.userId}).subscribe(response => {
			this.router.navigate(['/']); /* Home page redirection */
		});
	}

}