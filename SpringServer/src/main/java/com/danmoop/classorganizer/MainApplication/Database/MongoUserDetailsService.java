package com.danmoop.classorganizer.MainApplication.Database;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class MongoUserDetailsService implements UserDetailsService
{
    @Autowired
    private UserDatabase userDatabase;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException
    {
        com.danmoop.classorganizer.MainApplication.Model.User user = userDatabase.findByUsername(username);

        if (user == null)
            throw new UsernameNotFoundException(username + " not found");

        List<SimpleGrantedAuthority> authorities = Arrays.asList(new SimpleGrantedAuthority("user"));

        return new User(user.getUsername(), user.getPassword(), authorities);
    }
}