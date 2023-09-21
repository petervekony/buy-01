package com.gritlab.buy01.productservice.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.gritlab.buy01.productservice.model.ProductModel;
import com.gritlab.buy01.productservice.service.ProductService;

@CrossOrigin
@RestController
@RequestMapping("/api")
public class ProductController {
  @Autowired ProductService productService;

  @GetMapping("/products")
  public ResponseEntity<List<ProductModel>> getAllProducts(
      @RequestParam(required = false) String name) {
    try {
      List<ProductModel> products = productService.getAllProducts(name);

      if (products.isEmpty()) {
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
      }

      return new ResponseEntity<>(products, HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @GetMapping("/products/{id}")
  public ResponseEntity<ProductModel> getProductById(@PathVariable("id") String id) {
    Optional<ProductModel> productData = productService.getProductById(id);

    return productData
        .map(productModel -> new ResponseEntity<>(productModel, HttpStatus.OK))
        .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
  }

  // @PreAuthorize("isAuthenticated()")
  // @PostMapping("/products")
  // public ResponseEntity<ProductModel> createProduct(@Valid @RequestBody ProductModel
  // productModel) {
  //   try {
  //     PrincipalData principalData = new PrincipalData();

  //     UserDetailsImpl userDetails = principalData.getUserDetails();

  //     productModel.setUserId(userDetails.getId());

  //     ProductModel _productModel = productService.createProduct(productModel);

  //     return new ResponseEntity<>(_productModel, HttpStatus.CREATED);
  //   } catch (Exception e) {
  //     return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }

  // @PreAuthorize("isAuthenticated()")
  // @PutMapping("/products/{id}")
  // public ResponseEntity<ProductModel> updateProduct(
  //     @PathVariable("id") String id, @Valid @RequestBody ProductModel productModel) {
  //   Optional<ProductModel> existingProduct = productService.getProductById(id);
  //   if (existingProduct.isEmpty()) {
  //     return new ResponseEntity<>(HttpStatus.NOT_FOUND);
  //   }

  //   PrincipalData principalData = new PrincipalData();

  //   if (!principalData.authCheck(existingProduct.get().getUserId())) {
  //     return new ResponseEntity<>(HttpStatus.FORBIDDEN);
  //   }

  //   Optional<ProductModel> updatedProduct = productService.updateProduct(id, productModel);

  //   return updatedProduct
  //       .map(product -> new ResponseEntity<>(product, HttpStatus.OK))
  //       .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
  // }

  // @PreAuthorize("isAuthenticated()")
  // @DeleteMapping("products/{id}")
  // public ResponseEntity<HttpStatus> deleteProduct(@PathVariable String id) {
  //   Optional<ProductModel> product = productService.getProductById(id);
  //   if (product.isEmpty()) {
  //     return new ResponseEntity<>(HttpStatus.NOT_FOUND);
  //   }

  //   PrincipalData principalData = new PrincipalData();

  //   if (!principalData.authCheck(product.get().getUserId())) {
  //     return new ResponseEntity<>(HttpStatus.FORBIDDEN);
  //   }

  //   try {
  //     productService.deleteProduct(id);
  //     return new ResponseEntity<>(HttpStatus.NO_CONTENT);
  //   } catch (Exception e) {
  //     return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }
}
