package com.gritlab.buy01.productservice.kafka.message;

import lombok.Data;

@Data
public class TokenValidationRequest {
  private String jwtToken;
  private String correlationId;
}
