package com.gritlab.buy01.productservice.security.jwt;

import java.io.IOException;
import java.util.ArrayList;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import com.gritlab.buy01.productservice.kafka.message.TokenValidationRequest;
import com.gritlab.buy01.productservice.kafka.message.TokenValidationResponse;
import com.gritlab.buy01.productservice.service.KafkaService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class AuthTokenFilter extends OncePerRequestFilter {

  private final KafkaService kafkaService;

  public AuthTokenFilter(KafkaService kafkaService) {
    this.kafkaService = kafkaService;
  }

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    try {
      String jwt = parseJwt(request);
      if (jwt != null) {
        TokenValidationRequest validationRequest = new TokenValidationRequest();
        validationRequest.setJwtToken(jwt);
        TokenValidationResponse validationResponse =
            kafkaService.validateTokenWithUserMicroservice(validationRequest);

        // Assuming that a null response means an invalid token.
        if (validationResponse != null && validationResponse.getUserId() != null) {
          UserDetails userDetails = new User(validationResponse.getName(), "", new ArrayList<>());
          UsernamePasswordAuthenticationToken authentication =
              new UsernamePasswordAuthenticationToken(
                  userDetails, null, userDetails.getAuthorities());
          authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
          SecurityContextHolder.getContext().setAuthentication(authentication);
        }
      }
    } catch (Exception e) {
      logger.error("Failed to validate the token: ", e);
    }

    filterChain.doFilter(request, response);
  }

  private String parseJwt(HttpServletRequest request) {
    Cookie[] cookies = request.getCookies();
    if (cookies != null) {
      for (Cookie cookie : cookies) {
        if ("buy-01".equals(cookie.getName())) {
          return cookie.getValue();
        }
      }
    }
    return null;
  }
}
