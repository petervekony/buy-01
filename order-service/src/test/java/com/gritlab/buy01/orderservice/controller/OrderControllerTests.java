package com.gritlab.buy01.orderservice.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.Collections;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import com.gritlab.buy01.orderservice.dto.PersonalOrders;
import com.gritlab.buy01.orderservice.security.UserDetailsImpl;
import com.gritlab.buy01.orderservice.service.OrderService;

@ExtendWith(MockitoExtension.class)
class OrderControllerTest {

  @Mock private OrderService orderService;

  @InjectMocks private OrderController orderController;

  @Mock private UserDetailsImpl mockUserDetails;

  @BeforeEach
  void setUp() {
    mockUserDetails =
        new UserDetailsImpl(
            "userId",
            "userName",
            Collections.singletonList(new SimpleGrantedAuthority("ROLE_CLIENT")));
    SecurityContext securityContext = mock(SecurityContext.class);
    lenient()
        .when(securityContext.getAuthentication())
        .thenReturn(
            new UsernamePasswordAuthenticationToken(
                mockUserDetails, null, mockUserDetails.getAuthorities()));
    SecurityContextHolder.setContext(securityContext);
  }

  @Test
  void getOrdersSuccess() throws Exception {
    when(orderService.getOrders(any(UserDetailsImpl.class)))
        .thenReturn(new PersonalOrders(null, null, null));
    ResponseEntity<Object> response = orderController.getOrders();
    assertEquals(HttpStatus.OK, response.getStatusCode());
  }

  // @Test
  // void placeOrderSuccess() throws NotFoundException, TimeoutException {
  //   // Given
  //   String mockUserId = "userId";
  //   mockUserDetails =
  //       new UserDetailsImpl(
  //           mockUserId,
  //           "userName",
  //           Collections.singletonList(new SimpleGrantedAuthority("ROLE_CLIENT")));

  //   Authentication authentication =
  //       new UsernamePasswordAuthenticationToken(
  //           mockUserDetails, null, mockUserDetails.getAuthorities());
  //   SecurityContext securityContext = Mockito.mock(SecurityContext.class);
  //   SecurityContextHolder.setContext(securityContext);
  //   when(securityContext.getAuthentication()).thenReturn(authentication);

  //   CartResponse expectedResponse = new CartResponse(new Cart(), true, new OrderModifications());
  //   when(orderService.placeOrder(mockUserId)).thenReturn(expectedResponse);

  //   // When
  //   ResponseEntity<Object> response = orderController.placeOrder(null);

  //   // Then
  //   assertEquals(HttpStatus.OK, response.getStatusCode());
  //   assertNotNull(response.getBody());
  //   verify(orderService).placeOrder(mockUserId);
  // }
}
