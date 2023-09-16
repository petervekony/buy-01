package com.gritlab.buy01.userservice.service;

import com.gritlab.buy01.userservice.model.User;
import com.gritlab.buy01.userservice.model.enums.Role;
import com.gritlab.buy01.userservice.payload.response.MessageResponse;
import com.gritlab.buy01.userservice.payload.response.UserUpdateRequest;
import com.gritlab.buy01.userservice.repository.UserRepository;
import com.gritlab.buy01.userservice.security.UserDetailsServiceImpl;
import com.gritlab.buy01.userservice.utils.EmailValidator;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    public UserRepository userRepository;

    //@Autowired
    // public ProductRepository productRepository;

    // @Autowired
    // public AuthService authService;

    @Autowired
    public UserDetailsServiceImpl userDetailsServiceImpl;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Value("${admin.username}")
    private String adminUsername;

    @Value("${admin.password}")
    private String adminPassword;

    @Value("${admin.email}")
    private String adminEmail;

    public List<User> getAllUsers(String name) {
        List<User> users = new ArrayList<>();
        if (name == null) {
            userRepository.findAll().forEach(users::add);
        } else {
            userRepository.findByName(name).forEach(users::add);
        }
        return users;
    }

    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    public ResponseEntity<?> updateUser(String id, UserUpdateRequest userUpdateRequest, boolean isSelf) {
        Optional<User> userData = userRepository.findById(id);
        if (userData.isPresent()) {
            User _user = userData.get();

            // if username is not updated, ignore it
            if (userUpdateRequest.getName() != null) {
                if (userRepository.existsByName(userUpdateRequest.getName())) {
                    return ResponseEntity
                            .badRequest()
                            .body(new MessageResponse("Error: Username is already taken!"));
                }
                _user.setName(userUpdateRequest.getName());
            };

            // if email is not updated, or it is the same as before, ignore it
            if (userUpdateRequest.getEmail() != null && !_user.getEmail().equals(userUpdateRequest.getEmail())) {
                userUpdateRequest.setEmail(userUpdateRequest.getEmail().toLowerCase(Locale.ROOT));
                if (userRepository.existsByEmail(userUpdateRequest.getEmail())) {
                    return ResponseEntity
                            .badRequest()
                            .body(new MessageResponse("Error: Email is already in use!"));
                }
                if (!EmailValidator.isValidEmail(userUpdateRequest.getEmail())) {
                    return ResponseEntity
                            .badRequest()
                            .body(new MessageResponse("Error: Invalid email format"));
                }
                _user.setEmail(userUpdateRequest.getEmail());
            }

            // if password is not updated, ignore it
            if (userUpdateRequest.getPassword() != null) _user.setPassword(passwordEncoder.encode(userUpdateRequest.getPassword()));

            User savedUser = userRepository.save(_user);

            if (isSelf && !savedUser.getName().equals(userUpdateRequest.getName())) {
                UserDetails newDetails = userDetailsServiceImpl.loadUserById(savedUser.getId());
                UsernamePasswordAuthenticationToken newAuthentication = new UsernamePasswordAuthenticationToken(newDetails, null, newDetails.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(newAuthentication);
            }

            return new ResponseEntity<>(savedUser, HttpStatus.OK);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    public Optional<User> updateUserRole(String id, Role role) {
        Optional<User> userData = userRepository.findById(id);
        if (userData.isPresent()) {
            User _user = userData.get();
            _user.setRole(role);

            User updatedUser = userRepository.save(_user);

            if (SecurityContextHolder.getContext().getAuthentication().getName().equals(_user.getName())) {
                // update SecurityContextHolder with new details
                UserDetails newDetails = userDetailsServiceImpl.loadUserById(updatedUser.getId());
                UsernamePasswordAuthenticationToken newAuthentication = new UsernamePasswordAuthenticationToken(newDetails, null, newDetails.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(newAuthentication);
            }

            return Optional.of(updatedUser);
        } else {
            return Optional.empty();
        }
    }

    // TODO: implement user deletion
    /*
    public void deleteUser(String id) {
        productRepository.deleteAllByUserId(id);
        userRepository.deleteById(id);
    }
    */

    @PostConstruct
    public void initDefaultAdmin() {
        List<User> optionalAdmin = userRepository.findByName(adminUsername);
        if (!optionalAdmin.isEmpty()) {
            return;
        }

        // Create admin user
        User adminUser = new User(adminUsername, adminEmail, passwordEncoder.encode(adminPassword), Role.ADMIN);

        userRepository.save(adminUser);
    }
}

