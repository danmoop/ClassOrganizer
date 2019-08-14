package com.danmoop.classorganizer.MainApplication.Model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@Document(value = "users")
public class User
{
    @Id
    private String id;

    private String username;
    private String schoolName;
    private String password;
    private String email;

    private int semestersLeft;

    private List<Course> currentCourses;
    private List<Course> completedCourses;
    private List<Course> allCourses;

    public User(String username, String schoolName, String password, String email)
    {
        this.username = username;
        this.schoolName = schoolName;
        this.password = password;
        this.email = email;
        this.semestersLeft = 6;

        this.currentCourses = new ArrayList<>();
        this.completedCourses = new ArrayList<>();
        this.allCourses = new ArrayList<>();
    }
}