package com.danmoop.classorganizer.MainApplication.Model;

public class Data<T>
{
    private T data;

    public void setData(T data)
    {
        this.data = data;
    }

    public T getData()
    {
        return data;
    }
}