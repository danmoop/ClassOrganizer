import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.css']
})
export class WelcomePageComponent implements OnInit {

  title = 'ClassOrganizer';
  API = 'http://localhost:1337';
  registered = true;

  schoolName = "";
  password = "";
  username = "";
  email = "";

  token: string;

  constructor(private snackBar: MatSnackBar, private router: Router) {}

  ngOnInit() {
    if(localStorage.getItem('token') != null)
      this.login(true);
  }

  toggleRegisterWindow() {
    this.registered = !this.registered;
  }

  register() {
    var user = {
      username: this.username,
      schoolName: this.schoolName,
      email: this.email,
      password: this.password
    }

    axios.post(this.API + '/register', user)
      .then(response => {

        if(response.data.status == 'OK') {
          this.registered = true;
          this.openSnackBar('Successfully registered!');
        } else {
          this.openSnackBar('User with such username already exists!');
        }

      });
  }

  login(isAuto: boolean) {
    var authentication;

    if(!isAuto){
      authentication = {
        username: this.username,
        password: this.password
      }
    } else {
      authentication = this.getAuth();
    }

    axios(this.API + '/login', {
        method: 'get',
        auth: authentication
      })
      .then(response => {
        this.openSnackBar('Logged In! Hello, ' + response.data.username + '!');

        if(!isAuto) {
          localStorage.setItem('token', window.btoa(response.data.username + ":" + this.password));
        }

        this.router.navigateByUrl('/dashboard');
      }).catch(err => this.openSnackBar('Wrong password'));
  }

  getAuth() {
    var token = window.atob(localStorage.getItem('token'));

    var auth = {
      username: token.split(":")[0],
      password: token.split(":")[1]
    }

    return auth;
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 2000
    });
  }
}