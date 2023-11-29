package com.gritlab.buy01.orderservice.kafka.message;

import java.util.HashMap;

import com.gritlab.buy01.orderservice.dto.OrderModifications;
import com.gritlab.buy01.orderservice.model.Order;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CartValidationResponse {
  private String correlationId;

  // in the product-service from the orders the processed ones are separated from the ones that
  // could not be
  // processed because of changed details or low quantity
  private HashMap<String, Order> processedOrders;

  private HashMap<String, Order> unprocessedOrders;

  // this contains all the modifications for the unprocessed orders
  private HashMap<String, OrderModifications> orderModifications;
}
