package com.gritlab.buy01.userservice.model.enums;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class RoleTests {

    @Test
    public void testRoleEnumValues() {
        assertEquals(2, Role.values().length);
        assertEquals(Role.CLIENT, Role.valueOf("CLIENT"));
        assertEquals(Role.SELLER, Role.valueOf("SELLER"));
    }
}
