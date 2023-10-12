package com.gritlab.buy01.mediaservice.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.gritlab.buy01.mediaservice.kafka.message.ProductOwnershipRequest;
import com.gritlab.buy01.mediaservice.kafka.message.ProductOwnershipResponse;
import com.gritlab.buy01.mediaservice.model.Media;
import com.gritlab.buy01.mediaservice.payload.response.MediaResponse;
import com.gritlab.buy01.mediaservice.security.UserDetailsImpl;
import com.gritlab.buy01.mediaservice.service.KafkaService;
import com.gritlab.buy01.mediaservice.service.MediaService;

import jakarta.servlet.http.HttpServletRequest;

@CrossOrigin
@RestController
@RequestMapping("/api")
public class MediaController {
  @Autowired MediaService mediaService;

  @Autowired RestTemplate restTemplate;

  @Autowired KafkaService kafkaService;

  @PreAuthorize("isAuthenticated()")
  @GetMapping("/media/{id}")
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
      @RequestPart MultipartFile image,
      HttpServletRequest request) {

    if (userId != null && productId != null) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

    try {
      Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
      UserDetailsImpl userDetails = null;

      if (principal instanceof UserDetailsImpl) {
        userDetails = (UserDetailsImpl) principal;
      } else {
        throw new Exception("Unexpected principal type");
      }

      if (productId != null) {

        ProductOwnershipRequest ownershipRequest =
            new ProductOwnershipRequest(productId, userDetails.getId());
        System.out.println("ownershipRequest: " + ownershipRequest);
        ProductOwnershipResponse ownershipResponse =
            kafkaService.sendProductOwnershipRequestAndWaitForResponse(ownershipRequest);

        System.out.println("ownershipResponse: " + ownershipResponse);

        if (!ownershipResponse.isOwner()) {
          System.out.println("ownership declined for some reason");
          return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        return mediaService.createMedia(image, userId, productId);
      }

      if (userId != null) {
        if (!userDetails.getId().equals(userId)) {
          return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        return mediaService.createMedia(image, userId, productId);
      }
    } catch (Exception e) {
      System.out.println(e.toString());
      return new ResponseEntity<>(HttpStatus.FORBIDDEN);
    }

    return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
  }

  @PreAuthorize("isAuthenticated()")
  @GetMapping("/media/product/{productId}")
  public ResponseEntity<?> getProductThumbnail(@PathVariable("productId") String productId) {
    return mediaService.getProductThumbnail(productId);
  }
}
