package com.danmoop.classorganizer.MainApplication.Controller;

import com.danmoop.classorganizer.MainApplication.Database.UserDatabase;
import com.danmoop.classorganizer.MainApplication.Model.Response;
import com.danmoop.classorganizer.MainApplication.Model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.Map;

@RestController
@CrossOrigin
public class UserController
{
    @Autowired
    private UserDatabase userDatabase;

    /**
     * This request is handled when user changed the amount of their semesters
     * A new amount of semesters will be assigned to user
     *
     * @param data is taken from client, it contains new integer of semesters
     * @return response if new amount of semesters isn't out of Integer bounds. Set new number to user & save to db
    */
    @PostMapping("/changeSemestersAmount")
    public Response changeSemestersAmount(@RequestBody Map<String, Integer> data, Principal principal)
    {
        User user = userDatabase.findByUsername(principal.getName());
        int semesters = data.get("semestersAmount");

        user.setSemestersLeft(semesters);
        userDatabase.save(user);

        return Response.OK;
    }
}
