package com.gritlab.buy01.orderservice.repository;

import java.util.ArrayList;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.gritlab.buy01.orderservice.model.CartItem;

public interface CartRepository extends MongoRepository<CartItem, String> {
  Optional<CartItem> findById(String id);

  Optional<ArrayList<CartItem>> findAllBySellerId(String sellerId);

  Optional<ArrayList<CartItem>> findAllByBuyerId(String buyerId);

  void deleteById(String id);

  void deleteAllBySellerId(String sellerId);

  void deleteAllByBuyerId(String buyerId);
}
