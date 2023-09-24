package com.gritlab.buy01.mediaservice.payload.response;

import lombok.Data;

@Data
public class ErrorMessage {
  String status;
  String message;

  public ErrorMessage(String message, String status) {
    this.message = message;
    this.status = status;
  }
}
