package com.gritlab.buy01.userservice.controller;

import com.gritlab.buy01.userservice.model.User;
import com.gritlab.buy01.userservice.payload.response.UserUpdateRequest;
import com.gritlab.buy01.userservice.security.PrincipalData;
import com.gritlab.buy01.userservice.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    UserService userService;

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers(@RequestParam(required = false) String name) {
        try {
            List<User> users = userService.getAllUsers(name);

            if (users.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            return new ResponseEntity<>(users, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable("id") String id) {
        Optional<User> userData = userService.getUserById(id);

        return userData
                .map(userModel -> new ResponseEntity<>(userModel, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PreAuthorize("isAuthenticated()")
    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable("id") String id, @Valid @RequestBody UserUpdateRequest userUpdateRequest) {
        PrincipalData principalData = new PrincipalData();
        boolean isSelf = principalData.isSelf(id);

        if (!principalData.authCheck(id)) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        // TODO: user update role might not need to be implemented
        /*
        if (principalData.isAdmin() && !Objects.isNull(userUpdateRequest.getRole())) {
            Optional<User> promotedUser = userService.updateUserRole(id, userUpdateRequest.getRole());
            if (promotedUser.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }
        */

        return userService.updateUser(id, userUpdateRequest, isSelf);
    }

    // TODO: implement user deletion

    /*
    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/users/{id}")
    public ResponseEntity<HttpStatus> deleteUser(@PathVariable String id) {
        try {
            PrincipalData principalData = new PrincipalData();

            if (!principalData.authCheck(id)) {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }

            userService.deleteUser(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    */
}
