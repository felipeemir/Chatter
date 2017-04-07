import { Injectable } from '@angular/core';

import { HttpService } from './http.service';

@Injectable()
export class ChatService {
    
    constructor(private httpService : HttpService) { }
    
    public checkUserNameCheck(params,callback){
        this.httpService.userNameCheck(params).subscribe(
            response => {
                callback(response);
            },
            error => {
                alert('HTTP fail.');
            }
        );
    }
    
    public login(params,callback):any{
        this.httpService.login(params).subscribe(
            response => {
                callback(false,response);
            },
            error => {
                callback(true,'Erro Login.');
            }
        );
    }
    
    public registerUser(params,callback):any{
        console.log('Registro');
        this.httpService.registerUser(params).subscribe(
            response => {
                console.log('Deu');
                callback(false,response);
            },
            error => {
                console.log('Não deu');
                callback(true,'Erro Registro.');
            }
        );
    }
    
    public getMessages(params,callback):any{
        this.httpService.getMessages(params).subscribe(
            response => {
                callback(false,response);
            },
            error => {
                callback(true,'HTTP fail.');
            }
        );
    }
    
    public userSessionCheck(userId,callback):any{
        this.httpService.userSessionCheck({userId : userId}).subscribe(
            response => {
                callback(false,response);
            },
            error => {
                callback(true,'HTTP fail.');
            }
        );
    }
    
}
