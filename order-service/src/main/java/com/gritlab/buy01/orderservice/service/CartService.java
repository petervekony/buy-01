package com.gritlab.buy01.orderservice.service;

import java.util.ArrayList;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.gritlab.buy01.orderservice.dto.CartItemDTO;
import com.gritlab.buy01.orderservice.exception.ForbiddenException;
import com.gritlab.buy01.orderservice.exception.NotFoundException;
import com.gritlab.buy01.orderservice.model.CartItem;
import com.gritlab.buy01.orderservice.repository.CartRepository;

@Service
public class CartService {
  private final CartRepository cartRepository;

  public CartService(CartRepository cartRepository) {
    this.cartRepository = cartRepository;
  }

  public ArrayList<CartItem> getCart(String userId) {
    Optional<ArrayList<CartItem>> cartQuery = cartRepository.findAllByBuyerId(userId);

    if (cartQuery.isEmpty()) {
      return new ArrayList<>();
    }

    return cartQuery.get();
  }

  public CartItem addToCart(CartItemDTO cartItemDTO) {
    CartItem item = new CartItem(cartItemDTO);
    return this.cartRepository.save(item);
  }

  public void deleteItemFromCart(String cartItemId, String userId)
      throws ForbiddenException, NotFoundException {
    Optional<CartItem> itemQuery = cartRepository.findById(cartItemId);

    if (itemQuery.isEmpty()) {
      throw new NotFoundException("Error: cart item not found");
    }

    if (!itemQuery.get().getBuyerId().equals(userId)) {
      throw new ForbiddenException("Error: this cartitem is not yours");
    }

    cartRepository.deleteById(cartItemId);
  }
}
