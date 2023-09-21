package com.gritlab.buy01.productservice.kafka.message;

import lombok.Data;

@Data
public class TokenValidationResponse {
  private String userId;
  private String name;
  private String role;
  private String errorMessage;
  private String correlationId;
}