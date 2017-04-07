import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { ChatService } from './../chat.service';
import { HttpService } from './../http.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers : [ChatService,HttpService]
})
export class LoginComponent{
    
    private username = null;
    private email = null;
    private password = null;
    
    private isUserNameAvaliable = false;
    private userTypingTimeout = 500;
    private typingTimer = null;
    
    constructor(
        private chatService : ChatService,
        private route : Router
    ) { }
    
    public onkeyup(event){
        clearTimeout(this.typingTimer);
        this.typingTimer = setTimeout( () => {
            this.chatService.checkUserNameCheck({
                'username' : this.username
            }, (response) => {
                if(response.error) {
                    this.isUserNameAvaliable = true;
                }else{
                    this.isUserNameAvaliable = false;
                }
            });
        }, this.userTypingTimeout);
    }
    
    public onkeydown(event){
        clearTimeout(this.typingTimer);
    }
    
    public login():void {
        if(this.username === '' || this.username === null) {
            alert(`Nome de usuário não pode estar vazio.`);
        }else if(this.password === '' || this.password === null) {
            alert(`Senha não pode estar vazio.`);
        }else{
            this.chatService.login({
                'username' : this.username,
                'password' : this.password,
            },(error, result) => {
                if(error) {
                    alert(result);
                }else{
                    if(!result.error){
                        this.route.navigate(['/home/'+result.userId]);
                    }else{
                        alert(`Dados Incorretos`);
                    }
                }
            });
        }
    }
    
    public registerUser():void{
        if(this.username === ''){
            alert(`Nome não pode estra vazio`);
        }else if(this.email === ''){
            alert(`Email não pode estra vazio`);
        }else if(this.password === ''){
            alert(`Senha não pode estra vazio`);
        }else{
            this.chatService.registerUser({
                username : this.username,
                email : this.email,
                password : this.password
            },(error , result) => {
                if(error) {
                    alert(result);
                }else{
                    if(!result.error){
                        console.log(result.userId);
                        this.route.navigate(['/home/'+result.userId]);
                    }else{
                        alert(`Falha no Registro`)
                    }
                }
            })
        }
    }
    
}
