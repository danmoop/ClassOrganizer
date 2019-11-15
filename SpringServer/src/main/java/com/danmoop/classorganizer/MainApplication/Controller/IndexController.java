package com.danmoop.classorganizer.MainApplication.Controller;

import com.danmoop.classorganizer.MainApplication.Database.UserDatabase;
import com.danmoop.classorganizer.MainApplication.Model.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
public class IndexController {

  @Autowired
  private UserDatabase userDatabase;

  /**
   * This request is just for pinging
   * So just if you want to check if server is running,
   * you can call this request
   */
  @GetMapping("/")
  public Response response() {
    return Response.OK;
  }
}
