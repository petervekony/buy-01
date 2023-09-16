package com.gritlab.buy01.userservice.model;

import com.gritlab.buy01.userservice.model.enums.Role;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class UserTests {

    private Validator validator;

    @BeforeEach
    public void setUp() {
        validator = Validation.buildDefaultValidatorFactory().getValidator();
    }

    @Test
    public void createUserWithValidFields() {
        User user = new User("John Doe", "john.doe@example.com", "password123", Role.CLIENT);
        Set<ConstraintViolation<User>> violations = validator.validate(user);
        assertTrue(violations.isEmpty());
    }

    @Test
    public void createUserWithShortName() {
        User user = new User("Jo", "john.doe@example.com", "password123", Role.CLIENT);
        Set<ConstraintViolation<User>> violations = validator.validate(user);
        assertEquals(1, violations.size());
        assertEquals("Error: Name has to be between 3 and 40 characters long", violations.iterator().next().getMessage());
    }

    @Test
    public void createUsersWithCorrectRoles() {
        User user1 = new User("Taneli", "taneli@taneli.com", "password123", Role.SELLER);
        User user2 = new User("Taneli", "taneli@taneli.com", "password123", Role.CLIENT);
        assertTrue(user1.getRole().equals(Role.SELLER));
        assertTrue(user2.getRole().equals(Role.CLIENT));
    }
}
