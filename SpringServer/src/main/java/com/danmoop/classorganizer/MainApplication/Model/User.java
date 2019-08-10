package com.danmoop.classorganizer.MainApplication.Model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@Document(value = "Users")
public class User
{
    @Id
    private String id;

    private String username;
    private String schoolName;
    private String password;
    private String email;

    private List<Course> courses;

    public User(String username, String schoolName, String password, String email)
    {
        this.username = username;
        this.schoolName = schoolName;
        this.password = password;
        this.email = email;

        this.courses = new ArrayList<>();
    }
}