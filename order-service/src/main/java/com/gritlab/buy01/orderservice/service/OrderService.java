package com.gritlab.buy01.orderservice.service;

import java.util.ArrayList;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gritlab.buy01.orderservice.dto.Cart;
import com.gritlab.buy01.orderservice.dto.CartResponse;
import com.gritlab.buy01.orderservice.dto.PersonalOrders;
import com.gritlab.buy01.orderservice.kafka.message.CartValidationRequest;
import com.gritlab.buy01.orderservice.kafka.message.CartValidationResponse;
import com.gritlab.buy01.orderservice.model.Order;
import com.gritlab.buy01.orderservice.repository.OrderRepository;
import com.gritlab.buy01.orderservice.security.UserDetailsImpl;

@Service
public class OrderService {
  private final OrderRepository orderRepository;
  private final KafkaService kafkaService;

  @Autowired
  public OrderService(OrderRepository orderRepository, KafkaService kafkaService) {
    this.orderRepository = orderRepository;
    this.kafkaService = kafkaService;
  }

  public PersonalOrders getOrders(UserDetailsImpl principal) {
    Optional<Order[]> ordersQuery;
    if (principal.hasRole("ROLE_SELLER")) {
      ordersQuery = orderRepository.findAllBySellerId(principal.getId());
    } else {
      ordersQuery = orderRepository.findAllByBuyerId(principal.getId());
    }

    if (ordersQuery.isEmpty()) {
      return null;
    }

    Order[] orders = ordersQuery.get();
    ArrayList<Order> pending = new ArrayList<>();
    ArrayList<Order> confirmed = new ArrayList<>();
    ArrayList<Order> cancelled = new ArrayList<>();

    for (Order order : orders) {
      switch (order.getStatus()) {
        case PENDING:
          pending.add(order);
          break;
        case CONFIRMED:
          confirmed.add(order);
          break;
        case CANCELLED:
          cancelled.add(order);
      }
    }
    return new PersonalOrders(
        pending.toArray(new Order[0]),
        confirmed.toArray(new Order[0]),
        cancelled.toArray(new Order[0]));
  }

  public CartResponse placeOrder(Cart cart) {
    CartValidationRequest cartValidationRequest = new CartValidationRequest();
    cartValidationRequest.setCorrelationId(UUID.randomUUID().toString());
    cartValidationRequest.setCart(cart);

    CartValidationResponse cartValidationResponse =
        kafkaService.sendCartValidationRequestAndWaitForResponse(cartValidationRequest);

    if (cartValidationResponse == null) {
      return null;
    }

    return new CartResponse(
        cartValidationResponse.getProcessedOrders(),
        cartValidationResponse.getUnprocessedOrders(),
        cartValidationResponse.getOrderModifications());
  }
}
