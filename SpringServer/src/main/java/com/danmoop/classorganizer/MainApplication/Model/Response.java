package com.danmoop.classorganizer.MainApplication.Model;

public class Response
{
    private Status status;

    public static final Response OK = new Response(Status.OK);
    public static final Response FAILED = new Response(Status.FAILED);
    public static final Response USER_EXISTS = new Response(Status.USER_EXISTS);

    public Response(Status status)
    {
        this.status = status;
    }

    private enum Status
    {
        OK, FAILED, USER_EXISTS
    }

    public Status getStatus()
    {
        return status;
    }
}