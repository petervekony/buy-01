package com.gritlab.buy01.orderservice.model;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.gritlab.buy01.orderservice.dto.CartItemDTO;
import com.gritlab.buy01.orderservice.dto.ProductDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "carts")
@Data
public class CartItem {
  @Id private String id;

  private String sellerId;

  private String buyerId;

  private ProductDTO product;

  private Integer quantity;

  private Date addedToCartAt;

  public CartItem(String sellerId, String buyerId, ProductDTO product, Integer quantity) {
    this.sellerId = sellerId;
    this.buyerId = buyerId;
    this.product = product;
    this.quantity = quantity;
    this.addedToCartAt = new Date();
  }

  public CartItem(CartItemDTO cartItemDTO) {
    this.sellerId = cartItemDTO.getSellerId();
    this.buyerId = cartItemDTO.getBuyerId();
    this.product = cartItemDTO.getProduct();
    this.quantity = cartItemDTO.getQuantity();
    this.addedToCartAt = new Date();
  }
}
