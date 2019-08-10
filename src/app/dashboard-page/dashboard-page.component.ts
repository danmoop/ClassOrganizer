import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.css']
})
export class DashboardPageComponent implements OnInit {

  constructor(private router: Router) { }

  API = 'http://localhost:1337';
  user: any;
  userData: string;

  isAddingCourse = false;

  courseName = "";
  courseCode = "";
  courseUnits = 1;
  isCourseMajor = false;

  ngOnInit() {
    if(localStorage.getItem('token') == null) {
      this.logOut();
    } else {
      axios(this.API + '/login', {
        method: 'get',
        auth: this.getAuth()
      }).then(user => {
        this.user = user.data;
        this.userData = JSON.stringify(user.data);
      });
    }
  }

  logOut() {
    localStorage.clear();
    this.router.navigateByUrl('/');
  }

  getAuth() {
    var token = window.atob(localStorage.getItem('token'));

    var auth = {
      username: token.split(":")[0],
      password: token.split(":")[1]
    }

    return auth;
  }

  toggleAddingCourse() {
    this.isAddingCourse = !this.isAddingCourse;
  }

  addCourse() {
    var course = {
      name: this.courseName,
      codeName: this.courseCode,
      units: this.courseUnits,
      isMajor: this.isCourseMajor
    }

    this.userData = JSON.stringify(course);

    this.user.allCourses.push(course);

    console.log(this.user);

    this.toggleAddingCourse();
    console.log(course);
  }
}