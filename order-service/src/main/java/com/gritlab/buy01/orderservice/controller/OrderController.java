package com.gritlab.buy01.orderservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gritlab.buy01.orderservice.dto.Cart;
import com.gritlab.buy01.orderservice.dto.OrderStatusUpdate;
import com.gritlab.buy01.orderservice.dto.PersonalOrders;
import com.gritlab.buy01.orderservice.exception.UnexpectedPrincipalTypeException;
import com.gritlab.buy01.orderservice.payload.response.ErrorMessage;
import com.gritlab.buy01.orderservice.security.UserDetailsImpl;
import com.gritlab.buy01.orderservice.service.OrderService;

@CrossOrigin
@RestController
@RequestMapping("/api")
public class OrderController {

  private final OrderService orderService;

  @Autowired
  public OrderController(OrderService orderService) {
    this.orderService = orderService;
  }

  @PreAuthorize("isAuthenticated()")
  @GetMapping("/orders/")
  public ResponseEntity<?> getOrders() {
    try {
      UserDetailsImpl principal = getPrincipal();

      PersonalOrders orders = orderService.getOrders(principal);
      if (orders == null) {
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
      }

      return new ResponseEntity<>(orders, HttpStatus.OK);
    } catch (Exception e) {
      ErrorMessage error =
          new ErrorMessage(
              "An error was encountered during fetching the orders",
              HttpStatus.INTERNAL_SERVER_ERROR.value());
      return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PreAuthorize("isAuthenticated()")
  @PostMapping("/orders")
  public ResponseEntity<?> placeOrder(@RequestBody Cart cart) {
    // send cart over to product service for validation
    UserDetailsImpl principal = getPrincipal();

    if (!principal.hasRole("ROLE_CLIENT")) {
      ErrorMessage error =
          new ErrorMessage("Error: only clients can place orders", HttpStatus.FORBIDDEN.value());
      return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
    }

    return new ResponseEntity<>(HttpStatus.OK);
  }

  @PreAuthorize("isAuthenticated()")
  @PutMapping("/orders")
  public ResponseEntity<?> changeOrderStatus(@RequestBody OrderStatusUpdate update) {
    try {
      // get the order from the database by id, check the user role,
      // validate the status based on that, update the order in the database,
      // send the order back to the user

      return new ResponseEntity<>(HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private UserDetailsImpl getPrincipal() throws UnexpectedPrincipalTypeException {
    Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    if (principal instanceof UserDetailsImpl userDetailsImpl) {
      return userDetailsImpl;
    } else {
      throw new UnexpectedPrincipalTypeException("Unexpected principal type");
    }
  }
}
