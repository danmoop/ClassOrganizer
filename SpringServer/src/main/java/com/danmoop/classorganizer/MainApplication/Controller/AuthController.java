package com.danmoop.classorganizer.MainApplication.Controller;

import com.danmoop.classorganizer.MainApplication.Database.UserDatabase;
import com.danmoop.classorganizer.MainApplication.Model.Response;
import com.danmoop.classorganizer.MainApplication.Model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@CrossOrigin
public class AuthController
{
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
    public Response isRegistered(@RequestBody User user)
    {
        if (userDatabase.findByUsername(user.getUsername()) == null)
        {
            user.setPassword(passwordEncoder.encode(user.getPassword()));

            User userForSaving = new User(user.getUsername(), user.getSchoolName(), user.getPassword(), user.getEmail());
            userDatabase.save(userForSaving);

            return Response.OK;
        }

        return Response.USER_EXISTS;
    }
}