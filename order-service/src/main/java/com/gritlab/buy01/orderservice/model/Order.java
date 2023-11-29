package com.gritlab.buy01.orderservice.model;

import java.sql.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.gritlab.buy01.orderservice.dto.ProductDTO;
import com.gritlab.buy01.orderservice.model.enums.OrderStatus;

import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Document(collection = "orders")
@Data
public class Order {
  @Id private String id;

  private String sellerId;

  private String buyerId;

  private ProductDTO[] products;

  private OrderStatus status;

  private Double totalPrice;

  private Date orderPlacedAt;

  public Order(String sellerId, String buyerId, ProductDTO[] products) {
    this.sellerId = sellerId;
    this.buyerId = buyerId;
    this.products = products;

    this.status = OrderStatus.PENDING;

    this.totalPrice = 0.0;
    for (ProductDTO product : this.products) {
      totalPrice += product.getPrice();
    }
  }
}
