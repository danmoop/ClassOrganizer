package com.danmoop.classorganizer.MainApplication.Controller;

import com.danmoop.classorganizer.MainApplication.Database.UserDatabase;
import com.danmoop.classorganizer.MainApplication.Model.Response;
import com.danmoop.classorganizer.MainApplication.Model.User;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.ArrayList;

@RestController
@CrossOrigin
public class AuthController
{
    private ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private UserDatabase userDatabase;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/login")
    public User user(Principal principal)
    {
        return userDatabase.findByUsername(principal.getName());
    }

    @PostMapping("/register")
    public Response isRegistered(@RequestBody Object userData)
    {
        User user = objectMapper.convertValue(userData, User.class);

        if (userDatabase.findByUsername(user.getUsername()) == null)
        {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            user.setCourses(new ArrayList<>());

            userDatabase.save(user);

            return Response.OK;
        }

        return Response.USER_EXISTS;
    }
}