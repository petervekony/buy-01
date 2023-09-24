package com.gritlab.buy01.mediaservice.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.gritlab.buy01.mediaservice.model.Media;
import com.gritlab.buy01.mediaservice.payload.response.MediaResponse;
import com.gritlab.buy01.mediaservice.service.MediaService;

@CrossOrigin
@RestController
@RequestMapping("/api")
public class MediaController {
  @Autowired MediaService mediaService;

  @PreAuthorize("isAuthenticated()")
  @GetMapping("/products/{id}")
  public ResponseEntity<MediaResponse> getMediaByProductId(
      @PathVariable("productId") String productId) {
    Optional<List<Media>> media = mediaService.getAllMediaByProductId(productId);
    if (media.isEmpty()) {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    MediaResponse mediaResponse = new MediaResponse();
    mediaResponse.setProductId(productId);
    mediaResponse.setMedia(media.get());
    return new ResponseEntity<>(mediaResponse, HttpStatus.OK);
  }

  @PreAuthorize("isAuthenticated()")
  @DeleteMapping("/media")
  public ResponseEntity<?> deleteById(@RequestParam String userId, @RequestParam String productId) {
    return mediaService.deleteMediaById(userId, productId);
  }

  @PreAuthorize("isAuthenticated()")
  @PostMapping("/media")
  public ResponseEntity<?> createMedia(
      @RequestParam(required = false) String userId,
      @RequestParam(required = false) String productId,
      @RequestPart MultipartFile image) {
    return mediaService.createMedia(image, userId, productId);
  }

  // @PreAuthorize("isAuthenticated()")
  // @PostMapping("/products")
  // public ResponseEntity<?> createProduct(@Valid @RequestBody ProductModel productModel) {
  //   try {
  //     Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
  //     String userId = null;

  //     if (principal instanceof UserDetailsImpl) {
  //       UserDetailsImpl userDetails = (UserDetailsImpl) principal;
  //       userId = userDetails.getId();

  //       // check if the user is ADMIN or SELLER to create product
  //       if (!userDetails.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"))
  //           && !userDetails.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_SELLER")))
  // {
  //         ErrorMessage errorMessage =
  //             new ErrorMessage(
  //                 HttpStatus.FORBIDDEN.toString(),
  //                 "Error: only admins and sellers can create products.");
  //         return new ResponseEntity<>(errorMessage, HttpStatus.FORBIDDEN);
  //       }
  //     } else {
  //       throw new Exception("Unexpected principal type");
  //     }
  //     productModel.setUserId(userId);

  //     ProductModel _productModel = productService.createProduct(productModel);

  //     return new ResponseEntity<>(_productModel, HttpStatus.CREATED);
  //   } catch (Exception e) {
  //     System.out.println(e.toString());
  //     return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
}
