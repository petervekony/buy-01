package com.gritlab.buy01.userservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gritlab.buy01.userservice.model.User;
import com.gritlab.buy01.userservice.payload.request.LoginRequest;
import com.gritlab.buy01.userservice.payload.request.SignupRequest;
import com.gritlab.buy01.userservice.service.AuthService;

import jakarta.validation.Valid;

@CrossOrigin(maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
  @Autowired AuthService authService;

  @PostMapping("/signin")
  public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
    return authService.authenticateUser(loginRequest);
  }

  @PostMapping("/signup")
  public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signupRequest) {
    return authService.registerUser(signupRequest);
  }

  @GetMapping("/check")
  public ResponseEntity<?> checkAuth(@CookieValue(name = "buy-01") String cookie) {
    User user = authService.checkAuth(cookie);
    if (user != null) return new ResponseEntity<>(user, HttpStatus.OK);
    return new ResponseEntity<>(HttpStatus.FORBIDDEN);
  }
}
