package com.danmoop.classorganizer.MainApplication.Service;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class StringService
{
    private List<String> strings = new ArrayList<>(Arrays.asList("Do something", "Forget about something"));

    public List<String> getStrings()
    {
        return strings;
    }

    public void add(String s)
    {
        strings.add(s);
    }
}