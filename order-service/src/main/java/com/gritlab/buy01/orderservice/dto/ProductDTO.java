package com.gritlab.buy01.orderservice.dto;

import java.io.Serializable;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class ProductDTO implements Serializable {
  private String id;

  private String name;

  private String description;

  private Double price;

  private Integer quantity;

  private String userId;

  private transient List<MultipartFile> images;

  public ProductDTO(
      String name, String description, Double price, Integer quantity, String userId) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.quantity = quantity;
    this.userId = userId;
  }
}
