package com.example.InternShip.service;

import com.example.InternShip.dto.request.GoogleLoginRequest;
import com.example.InternShip.dto.request.LoginRequest;
import com.example.InternShip.dto.request.RefreshTokenRequest;
import com.example.InternShip.dto.request.RegisterRequest;
import com.example.InternShip.dto.response.TokenResponse;
import com.example.InternShip.entity.User;
import com.nimbusds.jose.JOSEException;

import java.text.ParseException;

public interface  AuthService {
    void register(RegisterRequest request);
    TokenResponse login(LoginRequest request) throws JOSEException;
    TokenResponse loginWithGoogle(GoogleLoginRequest request) throws Exception;
    TokenResponse refreshToken(RefreshTokenRequest request) throws JOSEException, ParseException;

    void linkGoogleAccount(GoogleLoginRequest request) throws Exception;

    User getUserLogin();
}
