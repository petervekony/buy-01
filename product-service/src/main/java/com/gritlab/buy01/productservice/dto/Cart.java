package com.gritlab.buy01.productservice.dto;

import com.gritlab.buy01.productservice.model.Order;

import lombok.Data;

@Data
public class Cart {
  private Order[] order;
}
