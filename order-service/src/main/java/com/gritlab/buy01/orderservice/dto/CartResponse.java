package com.gritlab.buy01.orderservice.dto;

import java.util.HashMap;

import com.gritlab.buy01.orderservice.model.Order;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartResponse {
  private HashMap<String, Order> processedOrders;

  private HashMap<String, Order> unprocessedOrders;

  private HashMap<String, OrderModifications> orderModifications;
}
