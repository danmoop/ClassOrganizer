package com.danmoop.classorganizer.MainApplication.Controller;

import com.danmoop.classorganizer.MainApplication.Database.UserDatabase;
import com.danmoop.classorganizer.MainApplication.Model.Course;
import com.danmoop.classorganizer.MainApplication.Model.Response;
import com.danmoop.classorganizer.MainApplication.Model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@CrossOrigin
public class DashboardController
{
    @Autowired
    private UserDatabase userDatabase;

    /**
     * @param course is taken from client. Principal is assigned when authenticated
     * @return response if everything is ok, add course, save to db
     */
    @PostMapping("/addCourse")
    public Response addCourse(@RequestBody Course course, Principal principal)
    {
        User user = userDatabase.findByUsername(principal.getName());

        user.getAllCourses().add(course);

        userDatabase.save(user);

        return Response.COURSE_ADDED;
    }

    /**
     * @param course is taken from client. Principal is assigned when authenticated
     * @return response if everything is ok, remove course, save to db
     */
    @PostMapping("/deleteCourse")
    public Response deleteCourse(@RequestBody Course course, Principal principal)
    {
        User user = userDatabase.findByUsername(principal.getName());

        user.getAllCourses().remove(course);

        userDatabase.save(user);

        return Response.COURSE_DELETED;
    }

    /**
     * @param course is taken from client. Principal is assigned when authenticated
     * @return response if everything is ok, move course from one ArrayList to another, save to db
     */
    @PostMapping("/takeCourse")
    public Response takeCourse(@RequestBody Course course, Principal principal)
    {
        User user = userDatabase.findByUsername(principal.getName());

        user.getAllCourses().remove(course);
        user.getCurrentCourses().add(course);

        userDatabase.save(user);

        return Response.COURSE_TRANSFERRED;
    }

    /**
     * @param course is taken from client. Principal is assigned when authenticated
     * @return response if everything is ok, move course from one ArrayList to another, save to db
    */
    @PostMapping("/completeCourse")
    public Response completeCourse(@RequestBody Course course, Principal principal)
    {
        User user = userDatabase.findByUsername(principal.getName());

        user.getCurrentCourses().remove(course);
        user.getCompletedCourses().add(course);

        userDatabase.save(user);

        return Response.COURSE_TRANSFERRED;
    }
}