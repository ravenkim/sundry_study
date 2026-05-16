package org.example.be.api.advice;

import org.example.be.api.response.ApiErrorResponse;
import org.example.be.exception.BusinessLogicException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ControllerAdvice {

    @ExceptionHandler(BusinessLogicException.class)
    public ApiErrorResponse handleIllegalArgumentException(BusinessLogicException e){
        return ApiErrorResponse.fail(e.getErrorCode(), e.getMessage());
    }
}