package com.danmoop.classorganizer.MainApplication.Controller;

import com.danmoop.classorganizer.MainApplication.Database.UserDatabase;
import com.danmoop.classorganizer.MainApplication.Model.Response;
import com.danmoop.classorganizer.MainApplication.Model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@CrossOrigin
public class IndexController
{
    @Autowired
    private UserDatabase userDatabase;

    @GetMapping("/")
    public Response response()
    {
        return Response.OK;
    }

    @RequestMapping("/user")
    public User user(Principal principal)
    {
        return userDatabase.findByUsername(principal.getName());
    }
}