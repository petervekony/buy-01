package com.gritlab.buy01.orderservice.dto;

import com.gritlab.buy01.orderservice.model.enums.OrderStatus;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OrderStatusUpdate {
  private String id;
  private OrderStatus status;
}
