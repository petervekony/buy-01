package com.gritlab.buy01.orderservice.dto;

import java.util.Date;

import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class CartItemDTO {
  private String sellerId;

  private String buyerId;

  private ProductDTO product;

  private Integer quantity;

  private Date addedToCartAt;

  public CartItemDTO(String sellerId, String buyerId, ProductDTO product, Integer quantity) {
    this.sellerId = sellerId;
    this.buyerId = buyerId;
    this.product = product;
    this.quantity = quantity;
  }
}
