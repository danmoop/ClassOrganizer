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

  /**
   * @param API is a place where all the request are being sent
   * for example API/register, API/login etc.
   */
  API = 'http://localhost:1337';

  /**
   * @param registered states whether sign-in or sign-up form is opened
   * if user is registered -> show them sign-in window and vice-versa
   */
  registered = true;

  /* All these parameters are users' data when they want to register
   * It is empty by default, when users type in their data it is updated here
   */
  schoolName = "";
  password = "";
  username = "";
  email = "";

  /**
   * @param token is user's unique token for authentication
   * 
   * if there is no token saved users will have to sign-in again
   * but if there is token (so user is logged in) -> redirect to dashboard page
   */
  token: string;

  constructor(private snackBar: MatSnackBar, private router: Router) {}

  ngOnInit() {
    /**
     * If user's token is not null, they are already logged in
     * @param login will be assigned to true, user will be redirected
     */
    if(localStorage.getItem('token') != null)
      this.login(true);
  }

  toggleRegisterWindow() {
    // Toggles sign-up or sign-in form by pressing a button
    this.registered = !this.registered;
  }

  /**
   * when user presses 'register' button this function is executed
   * @param user is created using data from input fields
   * a request is being sent to api/register
   * 
   * if response == OK then @param registered is true
   * and user will be asked to type in their data and sign-in
   * 
   * if response != OK then user will be notified that
   * such user already exists
   */
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

  /**
   * This function authorizes user to the app
   * 
   * @param isAuto states whether authentication is manual or not
   * if @param isAuto == false then users data (username & pass) is taken from input fields
   * and there is no token in their storage
   * 
   * if @param isAuto == true then user is signed-in automatically because there is token in their storage
   *
   * if credentials are valid -> create a token, store it and redirect to dashboard
   * if they are not valid -> display a snackbar with error message
   */
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

  /**
   * This function returns user credentials from a token stored in a localStorage
   */
  getAuth() {
    var token = window.atob(localStorage.getItem('token'));

    var auth = {
      username: token.split(":")[0],
      password: token.split(":")[1]
    }

    return auth;
  }

  /**
   * This function displays a message with @param message for 2 seconds
   * By default there is simple button 'OK' to close snackbar
   */
  openSnackBar(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 2000
    });
  }
}