package com.gritlab.buy01.orderservice.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class CartItemDTO {
  private String id;

  private String sellerId;

  private String buyerId;

  private ProductDTO product;

  private Integer quantity;

  private Date addedToCartAt;

  public CartItemDTO(
      String id, String sellerId, String buyerId, ProductDTO product, Integer quantity) {
    this.id = id;
    this.sellerId = sellerId;
    this.buyerId = buyerId;
    this.product = product;
    this.quantity = quantity;
  }
}
