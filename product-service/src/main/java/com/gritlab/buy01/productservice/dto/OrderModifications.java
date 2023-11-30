package com.gritlab.buy01.productservice.dto;

import java.util.Set;

import com.gritlab.buy01.productservice.model.Order;

import lombok.Data;

@Data
public class OrderModifications {
  private Set<String> notes;

  private Order[] modifications;
}
