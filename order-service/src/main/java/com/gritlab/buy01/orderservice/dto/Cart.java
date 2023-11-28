package com.gritlab.buy01.orderservice.dto;

import java.util.HashMap;

import com.gritlab.buy01.orderservice.model.Order;

import lombok.Data;

@Data
public class Cart {
  private String buyerId;

  private HashMap<String, Order> order;
}
