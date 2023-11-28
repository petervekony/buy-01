package com.gritlab.buy01.orderservice.dto;

import com.gritlab.buy01.orderservice.model.enums.OrderStatus;

import lombok.Data;

@Data
public class OrderStatusUpdate {
  private String id;
  private OrderStatus status;
}
