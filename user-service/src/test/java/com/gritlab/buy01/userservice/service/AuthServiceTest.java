package com.gritlab.buy01.userservice.service;

import com.gritlab.buy01.userservice.model.User;
import com.gritlab.buy01.userservice.model.enums.Role;
import com.gritlab.buy01.userservice.payload.request.LoginRequest;
import com.gritlab.buy01.userservice.payload.request.SignupRequest;
import com.gritlab.buy01.userservice.security.UserDetailsImpl;
import com.gritlab.buy01.userservice.security.jwt.JwtUtils;
import com.gritlab.buy01.userservice.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder encoder;

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testAuthenticateUser() {
        LoginRequest request = new LoginRequest();
        request.setName("testName");
        request.setPassword("testPassword");

        UserDetailsImpl userDetails = new UserDetailsImpl("1", "testName", "test@email.com", "testPassword", Collections.emptyList());
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(authenticationManager.authenticate(any())).thenReturn(authentication);
        when(jwtUtils.generateTokenFromUserId("1")).thenReturn("testToken");

        var response = authService.authenticateUser(request);

        assertNotNull(response);
        assertTrue(response.getStatusCode().is2xxSuccessful());
    }

    @Test
    public void testRegisterUser() {
        SignupRequest request = new SignupRequest();
        request.setName("testName");
        request.setEmail("test@email.com");
        request.setPassword("testPassword");
        request.setRole(Role.CLIENT);

        when(userRepository.existsByName("testName")).thenReturn(false);
        when(userRepository.existsByEmail("test@email.com")).thenReturn(false);

        var response = authService.registerUser(request);

        assertNotNull(response);
        assertEquals(201, response.getStatusCodeValue());
    }
}
