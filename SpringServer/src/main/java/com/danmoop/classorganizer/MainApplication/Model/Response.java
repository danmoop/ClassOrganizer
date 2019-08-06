package com.danmoop.classorganizer.MainApplication.Model;

public class Response
{
    private Status status;

    public static final Response OK = new Response(Status.OK);
    public static final Response FAILED = new Response(Status.FAILED);

    public Response(Status status)
    {
        this.status = status;
    }

    private enum Status
    {
        OK, FAILED
    }

    public Status getStatus()
    {
        return status;
    }
}