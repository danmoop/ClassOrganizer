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

    @PostMapping("/addCourse")
    public Response addCourse(@RequestBody Course course, Principal principal)
    {
        User user = userDatabase.findByUsername(principal.getName());

        user.getAllCourses().add(course);

        userDatabase.save(user);

        return Response.COURSE_ADDED;
    }

    @PostMapping("/deleteCourse")
    public Response deleteCourse(@RequestBody Course course, Principal principal)
    {
        User user = userDatabase.findByUsername(principal.getName());

        user.getAllCourses().remove(course);

        userDatabase.save(user);

        return Response.COURSE_DELETED;
    }
}