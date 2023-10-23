package com.gritlab.buy01.userservice.controller;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.reset;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import com.gritlab.buy01.userservice.model.User;
import com.gritlab.buy01.userservice.model.enums.Role;
import com.gritlab.buy01.userservice.security.PrincipalData;
import com.gritlab.buy01.userservice.service.UserService;

@WebMvcTest(UserController.class)
public class UserControllerTest {
  @Autowired private MockMvc mockMvc;

  @MockBean private UserService userService;

  @MockBean private PrincipalData principalData;

  @BeforeEach
  public void setUp() {
    MockitoAnnotations.openMocks(this);
    reset(userService);
  }

  @Test
  @WithMockUser
  public void testGetAllUsers_found() throws Exception {
    List<User> users =
        Arrays.asList(
            new User("First", "first@email.com", "firstPassword", Role.CLIENT),
            new User("Second", "second@email.com", "secondPassword", Role.CLIENT),
            new User("Third", "third@email.com", "thirdPassword", Role.SELLER),
            new User("admin", "admin@email.com", "adminPassword", Role.ADMIN));

    when(userService.getAllUsers(null)).thenReturn(users);

    mockMvc
        .perform(get("/api/users"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$", hasSize(4)));

    verify(userService).getAllUsers(null);
  }

  @Test
  @WithMockUser
  public void testGetAllUsers_notFound() throws Exception {
    when(userService.getAllUsers(anyString())).thenReturn(Collections.emptyList());

    mockMvc.perform(get("/api/users")).andExpect(status().isNoContent());

    verify(userService).getAllUsers(null);
  }

  @Test
  @WithMockUser
  public void testGetUserById_found() throws Exception {
    User user = new User("a", "a@b.com", "pass", Role.CLIENT);
    when(userService.getUserById("someId")).thenReturn(Optional.of(user));

    mockMvc.perform(get("/api/users/someId")).andExpect(status().isOk());

    verify(userService).getUserById("someId");
  }

  @Test
  @WithMockUser
  public void testGetUserById_notFound() throws Exception {
    when(userService.getUserById("someId")).thenReturn(Optional.empty());

    mockMvc.perform(get("/api/users/someId")).andExpect(status().isNotFound());

    verify(userService).getUserById("someId");
  }

  // TODO: this test should work, but it doesn't
  /*
  @Test
  @WithMockUser(roles="ADMIN")
  public void testUpdateUser() throws Exception {
    UserUpdateRequest userUpdateRequest = new UserUpdateRequest("newName", "newEmail", "newPass", Role.CLIENT);

    Authentication auth = new UsernamePasswordAuthenticationToken("admin", "password", Collections.singletonList(new SimpleGrantedAuthority("ADMIN")));
    SecurityContextHolder.getContext().setAuthentication(auth);


    when(principalData.authCheck(anyString())).thenReturn(true);
    when(principalData.isAdmin()).thenReturn(true);
    when(principalData.isSelf(anyString())).thenReturn(true);

    when(userService.updateUser(anyString(), any(UserUpdateRequest.class), anyBoolean())).thenReturn(new ResponseEntity<>(HttpStatus.OK));

    mockMvc.perform(put("/api/users/someId")
            .contentType(MediaType.APPLICATION_JSON)
            .content(new ObjectMapper().writeValueAsString(userUpdateRequest)))
        .andExpect(status().isOk())
        .andDo(print());

    verify(userService).updateUser(anyString(), any(UserUpdateRequest.class), anyBoolean());
  }
   */
}
