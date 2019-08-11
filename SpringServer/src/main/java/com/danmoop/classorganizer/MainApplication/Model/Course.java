package com.danmoop.classorganizer.MainApplication.Model;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class Course
{
    private String name;
    private String codeName;
    private double units;
    private boolean isMajor;
}