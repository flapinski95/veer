package com.veer.user.model.exception;

public class UserAlreadyExistsException extends AlreadyExistsException {
    
    public UserAlreadyExistsException(String message) { super(message); }
}
