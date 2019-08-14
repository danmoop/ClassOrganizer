package com.danmoop.classorganizer.MainApplication.Configuration;

import com.danmoop.classorganizer.MainApplication.Database.MongoUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@EnableWebSecurity
public class Config extends WebSecurityConfigurerAdapter
{
    @Autowired
    private MongoUserDetailsService userDetailsService;

    /*
        urls is an array of strings. Each string is a path
        that will require user to authenticate. So each request
        to add course, delete course or anything else requires
        another authentication using username & password.
    */
    private final String[] urls = {
            "/login", "/user", "/addCourse", "/deleteCourse",
            "/takeCourse", "/completeCourse", "/changeSemestersAmount"
    };

    @Override
    protected void configure(HttpSecurity http) throws Exception
    {
        http.cors().and()
                .csrf().disable()
                .authorizeRequests()
                .antMatchers(urls).authenticated() // this string requires us to auth every time we send a request to specific path
                .and()
                .httpBasic();
    }

    // This configuration linked authentication with users' data stored in mongodb database
    @Override
    public void configure(AuthenticationManagerBuilder auth) throws Exception
    {
        auth.userDetailsService(userDetailsService)
                .and().inMemoryAuthentication();
    }

    // This is an encoder to store passwords in an encrypted way
    @Bean
    public PasswordEncoder passwordEncoder()
    {
        return new BCryptPasswordEncoder();
    }
}