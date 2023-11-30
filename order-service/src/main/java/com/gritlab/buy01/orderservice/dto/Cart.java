package com.gritlab.buy01.orderservice.dto;

import com.gritlab.buy01.orderservice.model.Order;

import lombok.Data;

@Data
public class Cart {
  private Order[] order;
}
