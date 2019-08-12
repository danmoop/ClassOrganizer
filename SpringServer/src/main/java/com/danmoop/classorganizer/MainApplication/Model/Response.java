package com.danmoop.classorganizer.MainApplication.Model;

public class Response
{
    private Status status;

    public static final Response OK = new Response(Status.OK);
    public static final Response FAILED = new Response(Status.FAILED);
    public static final Response USER_EXISTS = new Response(Status.USER_EXISTS);
    public static final Response COURSE_ADDED = new Response(Status.COURSE_ADDED);
    public static final Response COURSE_DELETED = new Response(Status.COURSE_DELETED);
    public static final Response COURSE_TRANSFERRED = new Response(Status.COURSE_TRANSFERRED);

    public Response(Status status)
    {
        this.status = status;
    }

    private enum Status
    {
        OK, FAILED, USER_EXISTS, COURSE_ADDED, COURSE_DELETED, COURSE_TRANSFERRED
    }

    public Status getStatus()
    {
        return status;
    }
}