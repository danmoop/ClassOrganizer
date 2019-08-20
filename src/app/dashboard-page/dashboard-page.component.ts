import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  Router
} from '@angular/router';
import axios from 'axios';
import {
  MatSnackBar
} from '@angular/material/snack-bar';
import {
  MatTable
} from '@angular/material/table';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.css']
})
export class DashboardPageComponent implements OnInit {

  constructor(private router: Router, private snackBar: MatSnackBar) {}

  API = 'http://localhost:1337';
  user: any;
  userData: string;

  isAddingCourse = false;

  courseName = "";
  courseCode = "";
  courseUnits = 1;
  isCourseMajor = false;
  isEditingCourse = false;

  displayedColumnsEditableCourses: string[] = ['Name', 'Code', 'Units', 'Type', 'Action'];
  displayedColumnsNonEditableCourses: string[] = ['Name', 'Code', 'Units', 'Type'];

  @ViewChild('allCoursesTable') allCoursesTable: MatTable < any > ;
  @ViewChild('currentCoursesTable') currentCoursesTable: MatTable < any > ;
  @ViewChild('completedCoursesTable') completedCoursesTable: MatTable < any > ;

  ngOnInit() {
    if (localStorage.getItem('token') == null) {
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

  toggleEditingCourse() {
    this.isEditingCourse = !this.isEditingCourse;
  }

  addCourse() {
    if (this.courseName && this.courseCode) {
      var course = {
        name: this.courseName,
        codeName: this.courseCode,
        units: this.courseUnits,
        major: this.isCourseMajor
      }

      this.user.allCourses.unshift(course);
      this.toggleAddingCourse();

      this.courseCode = "";
      this.courseName = "";
      this.isCourseMajor = false;
      this.courseUnits = 1;

      axios(this.API + '/addCourse', {
        method: 'post',
        auth: this.getAuth(),
        data: course
      }).then(response => {
        if (response.data.status == 'COURSE_ADDED') {
          this.openSnackBar('Successfully added!');
        }
      });

      this.allCoursesTable.renderRows();
    }
  }

  takeCourse(course) {
    this.user.allCourses.splice(this.user.allCourses.indexOf(course), 1);
    this.user.currentCourses.unshift(course);

    axios(this.API + '/takeCourse', {
      method: 'post',
      auth: this.getAuth(),
      data: course
    }).then(response => {
      if (response.data.status == 'COURSE_TRANSFERRED') {
        this.openSnackBar('Success!');
      }
    });

    this.allCoursesTable.renderRows();
    this.currentCoursesTable.renderRows();
  }

  completeCourse(course) {
    this.user.currentCourses.splice(this.user.currentCourses.indexOf(course), 1);
    this.user.completedCourses.unshift(course);

    axios(this.API + '/completeCourse', {
      method: 'post',
      auth: this.getAuth(),
      data: course
    }).then(response => {
      if (response.data.status == 'COURSE_TRANSFERRED') {
        this.openSnackBar('Success!');
      }
    });

    this.currentCoursesTable.renderRows();
    this.completedCoursesTable.renderRows();
  }

  deleteCourse(course) {
    this.spliceCourse(course);

    axios(this.API + '/deleteCourse', {
      method: 'post',
      auth: this.getAuth(),
      data: course
    }).then(response => {
      if (response.data.status == 'COURSE_DELETED') {
        this.openSnackBar('Course has been deleted!');
      }
    });
  }

  spliceCourse(course) {
    var index = this.user.allCourses.indexOf(course);
    this.user.allCourses.splice(index, 1);
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 1500
    });
  }

  calculateAllCoursesUnits() {
    var sum = 0;
    this.user.allCourses.forEach(element => {
      sum += element.units;
    });
    return sum;
  }

  calculateCurrentCoursesUnits() {
    var sum = 0;
    this.user.currentCourses.forEach(element => {
      sum += element.units;
    });
    return sum;
  }

  calculateCompletedCoursesUnits() {
    var sum = 0;
    this.user.completedCourses.forEach(element => {
      sum += element.units;
    });
    return sum;
  }

  calculateAllSections() {
    return this.calculateAllCoursesUnits() + this.calculateCompletedCoursesUnits() + this.calculateCurrentCoursesUnits();
  }

  calculateUnitsPerSem() {
    return ((this.calculateAllCoursesUnits() + this.calculateCurrentCoursesUnits()) / this.user.semestersLeft).toFixed(2);
  }

  sortAllCourses() {
    //bubble sort implemented
    if (this.isAllCoursesSorted()) {
      this.user.allCourses = this.user.allCourses.reverse();
    } else {
      for (var i = this.user.allCourses.length - 1; i > 0; i--) {
        for (var j = 0; j < i; j++) {
          if (this.user.allCourses[j].units > this.user.allCourses[j + 1].units) {
            this.swapCourses(this.user.allCourses, j, j + 1);
          }
        }
      }
    }
    this.allCoursesTable.renderRows();
  }

  swapCourses(courses, courseIndex1, courseIndex2) {
    var temp = courses[courseIndex1];

    courses[courseIndex1] = courses[courseIndex2];
    courses[courseIndex2] = temp;
  }

  isAllCoursesSorted() {
    var sorted = true;

    for (var i = 1; i < this.user.allCourses.length; i++) {
      if (this.user.allCourses[i].units < this.user.allCourses[i - 1].units) {
        sorted = false;
        break;
      }
    }

    return sorted;
  }

  changeSemestersAmount() {
    axios(this.API + '/changeSemestersAmount', {
      method: 'post',
      auth: this.getAuth(),
      data: {
        semestersAmount: this.user.semestersLeft
      }
    }).then(response => console.log(response.data.status));
  }
}
