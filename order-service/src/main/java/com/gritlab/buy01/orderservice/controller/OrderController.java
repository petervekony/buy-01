package com.gritlab.buy01.orderservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
import com.gritlab.buy01.orderservice.exception.ForbiddenException;
import com.gritlab.buy01.orderservice.exception.NotFoundException;
import com.gritlab.buy01.orderservice.exception.UnexpectedPrincipalTypeException;
import com.gritlab.buy01.orderservice.model.Order;
import com.gritlab.buy01.orderservice.payload.response.ErrorMessage;
import com.gritlab.buy01.orderservice.security.UserDetailsImpl;
import com.gritlab.buy01.orderservice.service.OrderService;

@CrossOrigin
@RestController
@RequestMapping("/api")
public class OrderController {

  private final OrderService orderService;

  private static final String SELLER = "ROLE_SELLER";
  private static final String CLIENT = "ROLE_CLIENT";

  @Autowired
  public OrderController(OrderService orderService) {
    this.orderService = orderService;
  }

  @PreAuthorize("isAuthenticated()")
  @GetMapping("/orders/")
  public ResponseEntity<?> getOrders() {
    try {
      UserDetailsImpl principal = UserDetailsImpl.getPrincipal();

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

  // TODO: finish this on the product-service side
  @PreAuthorize("isAuthenticated()")
  @PostMapping("/orders")
  public ResponseEntity<?> placeOrder(@RequestBody Cart cart) {
    // send cart over to product service for validation
    UserDetailsImpl principal = UserDetailsImpl.getPrincipal();

    if (!principal.hasRole(CLIENT)) {
      ErrorMessage error =
          new ErrorMessage("Error: only clients can place orders", HttpStatus.FORBIDDEN.value());
      return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
    }

    return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);
  }

  @PreAuthorize("isAuthenticated()")
  @PutMapping("/orders")
  public ResponseEntity<?> changeOrderStatus(@RequestBody OrderStatusUpdate update) {
    try {
      UserDetailsImpl principal = UserDetailsImpl.getPrincipal();
      String role;
      if (principal.hasRole(CLIENT)) {
        role = CLIENT;
      } else {
        role = SELLER;
      }

      Order order = orderService.changeOrderStatus(update, principal.getId(), role);

      return new ResponseEntity<>(order, HttpStatus.OK);
    } catch (ForbiddenException | UnexpectedPrincipalTypeException e) {
      ErrorMessage error = new ErrorMessage(e.getMessage(), HttpStatus.FORBIDDEN.value());
      return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
    } catch (NotFoundException e) {
      ErrorMessage error = new ErrorMessage(e.getMessage(), HttpStatus.NOT_FOUND.value());
      return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    } catch (Exception e) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
