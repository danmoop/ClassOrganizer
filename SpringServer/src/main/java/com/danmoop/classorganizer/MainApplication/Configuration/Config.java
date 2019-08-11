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

    private final String[] urls = {"/login", "/user", "/addCourse", "/deleteCourse"};

    @Override
    protected void configure(HttpSecurity http) throws Exception
    {
        http.cors().and()
                .csrf().disable()
                .authorizeRequests()
                .antMatchers(urls).authenticated()
                .and()
                .httpBasic();
    }

    @Override
    public void configure(AuthenticationManagerBuilder auth) throws Exception
    {
        auth.userDetailsService(userDetailsService)
                .and().inMemoryAuthentication();
    }


    @Bean
    public PasswordEncoder passwordEncoder()
    {
        return new BCryptPasswordEncoder();
    }
}