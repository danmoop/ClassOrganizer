package com.danmoop.classorganizer.MainApplication.Database;

import com.danmoop.classorganizer.MainApplication.Model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface UserDatabase extends MongoRepository<User, String>
{
    User findByUsername(String username);
    List<User> findBySchoolName(String schoolName);

    List<User> findAll();
}