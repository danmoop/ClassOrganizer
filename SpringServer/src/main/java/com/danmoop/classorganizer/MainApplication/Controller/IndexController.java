package com.danmoop.classorganizer.MainApplication.Controller;

import com.danmoop.classorganizer.MainApplication.Model.Data;
import com.danmoop.classorganizer.MainApplication.Model.Response;
import com.danmoop.classorganizer.MainApplication.Service.StringService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
public class IndexController
{
    @Autowired
    private StringService stringService;

    @GetMapping("/")
    public Response response()
    {
        return Response.OK;
    }

    @GetMapping("/list")
    public List<String> getList()
    {
        return stringService.getStrings();
    }

    @PostMapping("/add")
    public List<String> insertToList(@RequestBody Data s)
    {
        stringService.add((String) s.getData());

        return stringService.getStrings();
    }

    @PostMapping("/remove")
    public List<String> removeFromList(@RequestBody Data s)
    {
        stringService.getStrings().remove(s.getData());

        return stringService.getStrings();
    }
}