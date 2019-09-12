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

  /**
   * @param API is a place where all the request are being sent
   * for example API/register, API/login etc.
   */
  API = 'http://localhost:1337';

  /**
   * @param user is a user object, which contains all the information
   * like username, school, courses etc.
   * 
   * information is obtained from this object and displayed on html page
   */
  user: any;

  /**
   * @param isAddingCourse states whether there is a form for adding courses displayed
   
   * if @param isAddingCourse == true then there will be a form where you can
   * type in courseName, courseCode, units etc.
   */
  isAddingCourse = false;

  /**
   * All these variables are needed for adding courses
   * later information is obtained from here
   * 
   * These variables are empty by default (strings), when user updates information
   * manually these variables are updated
   */
  courseName = "";
  courseCode = "";
  courseUnits = 1;
  isCourseMajor = false;

  /**
   * @param displayedColumnsEditableCourses has all columns for courses
   * that ARE editable (can take them, can mark them as completed)
   * It has ACTION table where there is a button to add, or complete courses
   */
  displayedColumnsEditableCourses: string[] = ['Name', 'Code', 'Units', 'Type', 'Action'];
  
  /**
   * @param displayedColumnsNonEditableCourses has all columns for courses
   * that ARE NOT editable (they are completed and you can do nothing with them)
   * It has no ACTION button because these courses are completed, can't manipulate w/ them
   */
  displayedColumnsNonEditableCourses: string[] = ['Name', 'Code', 'Units', 'Type'];

  /**
   * @param allCoursesTable 
   * @param currentCoursesTable    are a material tables displayed on html dashboard page
   * @param completedCoursesTable
   */
  @ViewChild('allCoursesTable') allCoursesTable: MatTable < any > ;
  @ViewChild('currentCoursesTable') currentCoursesTable: MatTable < any > ;
  @ViewChild('completedCoursesTable') completedCoursesTable: MatTable < any > ;


  /**
   * When you open dashboard page there is a simple check whether you are signed-in
   * If there is no token stored -> logout and redirect to home page
   * 
   * If there is token stored -> send a request and obtain a user object
   */
  ngOnInit() {
    if (localStorage.getItem('token') == null) {
      this.logOut();
    } else {
      axios(this.API + '/login', {
        method: 'get',
        auth: this.getAuth()
      }).then(user => {
        this.user = user.data;
      });
    }
  }

  /**
   * token is deleted from a localStorage
   * user is redirected to home page
   */
  logOut() {
    localStorage.clear();
    this.router.navigateByUrl('/');
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
   * This function toggles a form where you can add a course
   * if @param isAddingCourse == true -> you can add a course
   */
  toggleAddingCourse() {
    this.isAddingCourse = !this.isAddingCourse;
  }

  /**
   * This function is executed when user submits a course and wants it to be added
   * there is a simple check whether course has no empty fields
   * 
   * course will be added to @param user.allCourses and information on html page will be updated
   * previously typed in information (@param courseCode, @param courseName etc.) will be cleared
   * 
   * a request to API will be sent, if response is OK material table with courses will be updated
   */
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

  /**
   * This function moves @param course from @param user.allCourses to @param user.currentCourses
   *
   * @param course is taken from html page when user clicks on a specific item
   * A request is sent to API and if response is COURSE_TRANSFERRED -> update information in tables
   */
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


  /**
   * This function moves @param course from @param user.currentCourses to @param user.completedCourses
   * @param course is taken from html page when user clicks on a specific item
   * A request is sent to API and if response is COURSE_TRANSFERRED -> update information
   */
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


  /**
   * This function deletes @param course from @param user.allCourses
   * @param course is taken from html page when user clicks on a specific item
   * A request is sent to API and if response is COURSE_DELETED -> update information
   */
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

  /**
   * This function deletes @param course taken from html page from @param user.allCourses locally 
   */
  spliceCourse(course) {
    var index = this.user.allCourses.indexOf(course);
    this.user.allCourses.splice(index, 1);
  }

   /**
   * This function displays a message with @param message for 2 seconds
   * By default there is simple button 'OK' to close snackbar
   */
  openSnackBar(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 1500
    });
  }

  /**
   * @return sum of all @param user.allCourses
   */
  calculateAllCoursesUnits() {
    var sum = 0;
    this.user.allCourses.forEach(element => {
      sum += element.units;
    });
    return sum;
  }

  /**
   * @return sum of all @param user.currentCourses
   */
  calculateCurrentCoursesUnits() {
    var sum = 0;
    this.user.currentCourses.forEach(element => {
      sum += element.units;
    });
    return sum;
  }

  /**
   * @return sum of all @param user.completedCourses
   */
  calculateCompletedCoursesUnits() {
    var sum = 0;
    this.user.completedCourses.forEach(element => {
      sum += element.units;
    });
    return sum;
  }

  /**
   * @return units from all 3 sections
   */
  calculateAllSections() {
    return this.calculateAllCoursesUnits() + this.calculateCompletedCoursesUnits() + this.calculateCurrentCoursesUnits();
  }

  /**
   * @return units per semester
   * it simply does @function calculateAllSections (except @param user.completedCourses) / @param user.semestersLeft
   */
  calculateUnitsPerSem() {
    return ((this.calculateAllCoursesUnits() + this.calculateCurrentCoursesUnits()) / this.user.semestersLeft).toFixed(2);
  }

  /**
   * As user courses list is not to big, this function
   * uses bubble sort with O(n²) to sort @param user.allCourses in a ascending order 
   * if it is already sorted -> simply reverse list
   */
  sortAllCourses() {
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

  /**
   * This function is a part of bubble sort
   * 
   * @param courses is @param user.allCourses
   * @param courseIndex1 is first course index
   * @param courseIndex2 is is second course index
   * 
   * it swaps those courses
   */
  swapCourses(courses, courseIndex1, courseIndex2) {
    var temp = courses[courseIndex1];

    courses[courseIndex1] = courses[courseIndex2];
    courses[courseIndex2] = temp;
  }


  /**
   * A function to find out if @param user.allCourses are sorted
   * @return isSorted
   */
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

  /**
   * This function is called when user changes an amount of semesters in their dashboard
   * A request is sent to API and changes are saved
   */
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
