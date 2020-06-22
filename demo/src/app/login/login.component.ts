import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  socket: SocketIOClient.Socket;
  
  constructor() { 
    this.socket = io.connect(`http://localhost:8080`);

  }
  
  ngOnInit(): void {
  }

  

  login(event){
    event.preventDefault();
    const target = event.target;
    const username = target.querySelector('#username').value;
    const password = target.querySelector('#password').value;
    this.socket.emit('LOGIN', {username, password});
  }
  
}
