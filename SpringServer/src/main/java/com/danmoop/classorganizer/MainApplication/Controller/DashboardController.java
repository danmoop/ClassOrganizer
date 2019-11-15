package com.danmoop.classorganizer.MainApplication.Controller;

import com.danmoop.classorganizer.MainApplication.Database.UserDatabase;
import com.danmoop.classorganizer.MainApplication.Model.Course;
import com.danmoop.classorganizer.MainApplication.Model.Response;
import com.danmoop.classorganizer.MainApplication.Model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/dashboard")
public class DashboardController {

  @Autowired
  private UserDatabase userDatabase;

  /**
   * This request is handled when user adds a course to their list
   * The course will be saved to user's allCoursesList
   *
   * @param course is taken from client. Principal is assigned when authenticated
   * @return response if everything is ok, add course, save to db
   */
  @PostMapping("/addCourse")
  public Response addCourse(@RequestBody Course course, Principal principal) {
    User user = userDatabase.findByUsername(principal.getName());

    user.getAllCourses().add(course);

    userDatabase.save(user);

    return Response.COURSE_ADDED;
  }

  /**
   * This request is handled when user deletes a course from their list
   * The course will be deleted and user information will be updated
   *
   * @param course is taken from client. Principal is assigned when authenticated
   * @return response if everything is ok, remove course, save to db
   */
  @PostMapping("/deleteCourse")
  public Response deleteCourse(@RequestBody Course course, Principal principal) {
    User user = userDatabase.findByUsername(principal.getName());

    user.getAllCourses().remove(course);

    userDatabase.save(user);

    return Response.COURSE_DELETED;
  }

  /**
   * This request is handled when user takes a course for current semester
   * A course will be moved to currentCourses list
   *
   * @param course is taken from client. Principal is assigned when authenticated
   * @return response if everything is ok, move course from one ArrayList to another, save to db
   */
  @PostMapping("/takeCourse")
  public Response takeCourse(@RequestBody Course course, Principal principal) {
    User user = userDatabase.findByUsername(principal.getName());

    user.getAllCourses().remove(course);
    user.getCurrentCourses().add(course);

    userDatabase.save(user);

    return Response.COURSE_TRANSFERRED;
  }

  /**
   * This request is handled when user completes a course and
   * it is moved to completedCourses list
   *
   * @param course is taken from client. Principal is assigned when authenticated
   * @return response if everything is ok, move course from one ArrayList to another, save to db
   */
  @PostMapping("/completeCourse")
  public Response completeCourse(@RequestBody Course course, Principal principal) {
    User user = userDatabase.findByUsername(principal.getName());

    user.getCurrentCourses().remove(course);
    user.getCompletedCourses().add(course);

    userDatabase.save(user);

    return Response.COURSE_TRANSFERRED;
  }

  /**
   * This request is handled when user changed the amount of their semesters
   * A new amount of semesters will be assigned to user
   *
   * @param data is taken from client, it contains new integer of semesters
   * @return response if new amount of semesters isn't out of Integer bounds. Set new number to user & save to db
   */
  @PostMapping("/changeSemestersAmount")
  public Response changeSemestersAmount(@RequestBody Map<String, Integer> data, Principal principal) {
    User user = userDatabase.findByUsername(principal.getName());
    int semesters = data.get("semestersAmount");

    user.setSemestersLeft(semesters);
    userDatabase.save(user);

    return Response.OK;
  }
}
