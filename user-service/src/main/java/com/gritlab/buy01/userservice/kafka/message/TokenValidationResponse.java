package com.gritlab.buy01.userservice.kafka.message;


import lombok.Data;

@Data
public class TokenValidationResponse {
  private String userId;
  private String name;
  private String role;
  private String errorMessage;
  private String correlationId;
}
