package com.gritlab.buy01.orderservice.service;

import java.util.ArrayList;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.gritlab.buy01.orderservice.dto.Cart;
import com.gritlab.buy01.orderservice.dto.CartItemDTO;
import com.gritlab.buy01.orderservice.dto.ProductDTO;
import com.gritlab.buy01.orderservice.exception.ForbiddenException;
import com.gritlab.buy01.orderservice.exception.NotFoundException;
import com.gritlab.buy01.orderservice.model.CartItem;
import com.gritlab.buy01.orderservice.model.Order;
import com.gritlab.buy01.orderservice.repository.CartRepository;

@Service
public class CartService {
  private final CartRepository cartRepository;

  public CartService(CartRepository cartRepository) {
    this.cartRepository = cartRepository;
  }

  public Cart getCart(String userId) {
    Optional<ArrayList<CartItem>> cartQuery = cartRepository.findAllByBuyerId(userId);

    if (cartQuery.isEmpty()) {
      return null;
    }

    Cart cart = new Cart();
    ArrayList<Order> orders = new ArrayList<>();
    ArrayList<CartItem> cartItems = cartQuery.get();
    for (CartItem item : cartItems) {
      Order order = new Order();
      order.setId(item.getId());
      order.setSellerId(item.getSellerId());
      order.setBuyerId(item.getBuyerId());
      order.setProduct(item.getProduct());
      order.setQuantity(item.getQuantity());

      orders.add(order);
    }
    cart.setOrders(orders.toArray(new Order[0]));

    return cart;
  }

  public CartItem addToCart(CartItemDTO cartItemDTO) {
    CartItem item = new CartItem(cartItemDTO);
    return this.cartRepository.save(item);
  }

  public void updateCartContents(Order[] contents) {
    for (Order content : contents) {
      Optional<CartItem> cartItemQuery = cartRepository.findById(content.getId());
      if (cartItemQuery.isPresent()) {
        CartItem cartItem = cartItemQuery.get();
        ProductDTO contentProduct = content.getProduct();
        cartItem.setSellerId(contentProduct.getUserId());
        cartItem.setProduct(contentProduct);
        cartRepository.save(cartItem);
      }
    }
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

  public void deleteUserCart(String userId) {
    cartRepository.deleteAllByBuyerId(userId);
  }
}
