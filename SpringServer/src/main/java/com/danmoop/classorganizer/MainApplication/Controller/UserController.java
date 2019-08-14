package com.danmoop.classorganizer.MainApplication.Controller;

import com.danmoop.classorganizer.MainApplication.Database.UserDatabase;
import com.danmoop.classorganizer.MainApplication.Model.Data;
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
public class UserController
{
    @Autowired
    private UserDatabase userDatabase;

    /**
     * @param data is taken from client, it contains new integer of semesters
     * @return response if new amount of semesters isn't out of Integer bounds. Set new number to user & save to db
    */
    @PostMapping("/changeSemestersAmount")
    public Response changeSemestersAmount(@RequestBody Data data, Principal principal)
    {
        int semesters = (int) data.getObject();

        if (semesters < Integer.MAX_VALUE && semesters > Integer.MIN_VALUE)
        {
            User user = userDatabase.findByUsername(principal.getName());

            user.setSemestersLeft(semesters);

            userDatabase.save(user);

            return Response.OK;
        }

        return Response.FAILED;
    }
}