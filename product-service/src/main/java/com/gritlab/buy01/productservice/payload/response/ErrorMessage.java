package com.gritlab.buy01.productservice.payload.response;

import lombok.Data;

@Data
public class ErrorMessage {
  String status;
  String message;

  public ErrorMessage(String status, String message) {
    this.status = status;
    this.message = message;
  }
}
