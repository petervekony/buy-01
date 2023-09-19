package com.gritlab.buy01.userservice.service;

import java.util.Locale;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.gritlab.buy01.userservice.model.User;
import com.gritlab.buy01.userservice.payload.request.LoginRequest;
import com.gritlab.buy01.userservice.payload.request.SignupRequest;
import com.gritlab.buy01.userservice.payload.response.MessageResponse;
import com.gritlab.buy01.userservice.payload.response.UserInfoResponse;
import com.gritlab.buy01.userservice.repository.UserRepository;
import com.gritlab.buy01.userservice.security.UserDetailsImpl;
import com.gritlab.buy01.userservice.security.jwt.JwtUtils;
import com.gritlab.buy01.userservice.utils.EmailValidator;

import jakarta.servlet.http.Cookie;

@Service
public class AuthService {

  @Autowired AuthenticationManager authenticationManager;

  @Autowired UserRepository userRepository;

  @Autowired PasswordEncoder encoder;

  @Autowired JwtUtils jwtUtils;

  public ResponseEntity<?> authenticateUser(LoginRequest loginRequest) {
    Authentication authentication =
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.getName(), loginRequest.getPassword()));

    SecurityContextHolder.getContext().setAuthentication(authentication);

    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

    String jwtToken = jwtUtils.generateTokenFromUserId(userDetails.getId());

    Cookie jwtCookie = new Cookie("buy-01", jwtToken);
    jwtCookie.setHttpOnly(true);
    jwtCookie.setSecure(false);
    jwtCookie.setMaxAge(7 * 24 * 60 * 60);

    String cookieValue =
        jwtCookie.getName()
            + "="
            + jwtCookie.getValue()
            + "; Max-Age="
            + jwtCookie.getMaxAge()
            + "; Secure; HttpOnly";
    HttpHeaders responseHeaders = new HttpHeaders();
    responseHeaders.add("Set-Cookie", cookieValue);

    // TODO: this might need to be fixed
    String role =
        userDetails.getAuthorities().stream()
            .findFirst()
            .map(item -> item.getAuthority())
            .orElse("user");
    ResponseEntity<UserInfoResponse> resp =
        ResponseEntity.ok()
            .headers(responseHeaders)
            .body(
                new UserInfoResponse(
                    userDetails.getId(),
                    userDetails.getUsername(),
                    userDetails.getEmail(),
                    role,
                    jwtToken));
    System.out.println("name" + jwtCookie.getName());
    System.out.println("value" + jwtCookie.getValue());
    System.out.println(resp);
    return resp;
  }

  public ResponseEntity<?> registerUser(SignupRequest signupRequest) {
    if (userRepository.existsByName(signupRequest.getName())) {
      return ResponseEntity.badRequest()
          .body(new MessageResponse("Error: Username is already taken!"));
    }

    signupRequest.setEmail(signupRequest.getEmail().toLowerCase(Locale.ROOT));
    if (!EmailValidator.isValidEmail(signupRequest.getEmail())) {
      return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid email format"));
    }

    if (userRepository.existsByEmail(signupRequest.getEmail())) {
      return ResponseEntity.badRequest()
          .body(new MessageResponse("Error: Email is already in use!"));
    }

    // Create new user's account
    User user =
        new User(
            signupRequest.getName(),
            signupRequest.getEmail(),
            encoder.encode(signupRequest.getPassword()),
            signupRequest.getRole());

    userRepository.save(user);

    return new ResponseEntity<>(
        new MessageResponse("User registered successfully!"), HttpStatus.CREATED);
  }
}
