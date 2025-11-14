package com.example.InternShip.exception;

import com.example.InternShip.dto.response.ApiResponse;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.Objects;

@ControllerAdvice
public class GlobalExceptionHandler {

    // --- Corrected Generic Handlers ---

    @ExceptionHandler(value = RuntimeException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    ResponseEntity<ApiResponse> handlingRuntimeException(RuntimeException exception){
        ApiResponse apiResponse = new ApiResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), "An unexpected internal server error occurred.", null);
        // Log the exception for debugging purposes
        exception.printStackTrace();
        return new ResponseEntity<>(apiResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(value = IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    ResponseEntity<ApiResponse> handlingIllegalArgumentException(IllegalArgumentException exception){
        ApiResponse apiResponse = new ApiResponse(HttpStatus.BAD_REQUEST.value(), exception.getMessage(), null);
        return new ResponseEntity<>(apiResponse, HttpStatus.BAD_REQUEST);
    }

    // --- Custom Exception Handlers ---

    @ExceptionHandler(value = ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    ResponseEntity<ApiResponse> handlingResourceNotFoundException(ResourceNotFoundException exception) {
        ApiResponse apiResponse = new ApiResponse(HttpStatus.NOT_FOUND.value(), exception.getMessage(), null);
        return new ResponseEntity<>(apiResponse, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = UserNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    ResponseEntity<ApiResponse> handlingUserNotFoundException(UserNotFoundException exception) {
        ApiResponse apiResponse = new ApiResponse(HttpStatus.NOT_FOUND.value(), exception.getMessage(), null);
        return new ResponseEntity<>(apiResponse, HttpStatus.NOT_FOUND);
    }
    
    @ExceptionHandler(value = EntityNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    ResponseEntity<ApiResponse> handlingEntityNotFoundException(EntityNotFoundException exception){
        ApiResponse apiResponse = new ApiResponse(HttpStatus.NOT_FOUND.value(), exception.getMessage(), null);
        return new ResponseEntity<>(apiResponse, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = ForbiddenException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    ResponseEntity<ApiResponse> handlingForbiddenException(ForbiddenException exception) {
        ApiResponse apiResponse = new ApiResponse(HttpStatus.FORBIDDEN.value(), exception.getMessage(), null);
        return new ResponseEntity<>(apiResponse, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(value = UnauthorizedException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    ResponseEntity<ApiResponse> handlingUnauthorizedException(UnauthorizedException exception) {
        ApiResponse apiResponse = new ApiResponse(HttpStatus.UNAUTHORIZED.value(), exception.getMessage(), null);
        return new ResponseEntity<>(apiResponse, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(value = BadRequestException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    ResponseEntity<ApiResponse> handlingBadRequestException(BadRequestException exception) {
        ApiResponse apiResponse = new ApiResponse(HttpStatus.BAD_REQUEST.value(), exception.getMessage(), null);
        return new ResponseEntity<>(apiResponse, HttpStatus.BAD_REQUEST);
    }

    // --- Existing Application-Specific Handlers ---

    @ExceptionHandler(value = InvalidSprintDateException.class)
    ResponseEntity<ApiResponse> handlingInvalidSprintDateException(InvalidSprintDateException exception){
        ApiResponse apiResponse = new ApiResponse(HttpStatus.BAD_REQUEST.value(), exception.getMessage(), null);
        return new ResponseEntity<>(apiResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = SprintConflictException.class)
    ResponseEntity<ApiResponse> handlingSprintConflictException(SprintConflictException exception){
        ApiResponse apiResponse = new ApiResponse(HttpStatus.CONFLICT.value(), exception.getMessage(), null);
        return new ResponseEntity<>(apiResponse, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(value = SprintUpdateException.class)
    ResponseEntity<ApiResponse> handlingSprintUpdateException(SprintUpdateException exception){
        ApiResponse apiResponse = new ApiResponse(HttpStatus.BAD_REQUEST.value(), exception.getMessage(), null);
        return new ResponseEntity<>(apiResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler( value = MethodArgumentNotValidException.class)
    ResponseEntity<ApiResponse> handlingMethodArgumentNotValidException(MethodArgumentNotValidException exception){
        String message = "Validation failed";
        String enumKey = Objects.requireNonNull(exception.getFieldError()).getDefaultMessage();
        if (enumKey != null) {
            try {
                message = ErrorCode.valueOf(enumKey).getMessage();
            } catch (IllegalArgumentException e) {
                message = "Invalid input for field " + exception.getFieldError().getField();
            }
        }
        ApiResponse apiResponse = new ApiResponse(HttpStatus.BAD_REQUEST.value(), message, null);
        return new ResponseEntity<>(apiResponse, HttpStatus.BAD_REQUEST);
    }
}
