package com.gritlab.buy01.mediaservice.controller;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

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
import com.gritlab.buy01.mediaservice.kafka.message.UserAvatarUpdateRequest;
import com.gritlab.buy01.mediaservice.kafka.message.UserAvatarUpdateResponse;
import com.gritlab.buy01.mediaservice.model.Media;
import com.gritlab.buy01.mediaservice.payload.response.ErrorMessage;
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
  @GetMapping("/media/{productId}")
  public ResponseEntity<MediaResponse> getMediaByProductId(
      @PathVariable("productId") String productId) {
    Optional<List<Media>> media = mediaService.getAllMediaByProductId(productId);
    if (media.isEmpty()) {
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    MediaResponse mediaResponse = new MediaResponse();
    mediaResponse.setProductId(productId);
    mediaResponse.setMedia(media.get());
    return new ResponseEntity<>(mediaResponse, HttpStatus.OK);
  }

  @PreAuthorize("isAuthenticated()")
  @DeleteMapping("/media/{id}")
  public ResponseEntity<?> deleteById(@PathVariable String id) {
    return mediaService.deleteById(id);
  }

  @PreAuthorize("isAuthenticated()")
  @DeleteMapping("/media")
  public ResponseEntity<?> deleteByUserOrProductId(
      @RequestParam(required = false) String userId,
      @RequestParam(required = false) String productId) {
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
        ProductOwnershipResponse ownershipResponse =
            kafkaService.sendProductOwnershipRequestAndWaitForResponse(ownershipRequest);

        if (!ownershipResponse.isOwner()) {
          ErrorMessage error =
              new ErrorMessage(
                  "Media can only be added to your own products", HttpStatus.FORBIDDEN.value());
          return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
        }

        return mediaService.createMedia(image, userId, productId);
      }

      if (userId != null) {
        if (!userDetails.getId().equals(userId)) {
          ErrorMessage error =
              new ErrorMessage(
                  "You can only upload avatar to your user profile", HttpStatus.FORBIDDEN.value());
          return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
        }

        ResponseEntity<?> mediaResponse = mediaService.createMedia(image, userId, productId);
        Object responseBody = mediaResponse.getBody();

        if (responseBody instanceof Media) {
          Media responseMedia = (Media) responseBody;

          // delete all other images
          mediaService.deletePreviousUserAvatars(userId, responseMedia.getId());

          String avatarId = responseMedia.getId();
          UserAvatarUpdateRequest userAvatarUpdateRequest =
              new UserAvatarUpdateRequest(UUID.randomUUID().toString(), userId, avatarId);
          UserAvatarUpdateResponse userAvatarUpdateResponse =
              kafkaService.sendUserAvatarUpdateRequestAndWaitForResponse(userAvatarUpdateRequest);

          if (userAvatarUpdateResponse == null) {
            ErrorMessage error =
                new ErrorMessage(
                    "Timeout while waiting for user avatar update response",
                    HttpStatus.REQUEST_TIMEOUT.value());
            mediaService.deleteMediaById(userId, productId);
            return new ResponseEntity<>(error, HttpStatus.REQUEST_TIMEOUT);
          }

          if (!userAvatarUpdateResponse.isAllowed()) {
            ErrorMessage error =
                new ErrorMessage(
                    String.format(
                        "An error was encountered during user avatar update: %s",
                        userAvatarUpdateResponse.getMessage()),
                    HttpStatus.FORBIDDEN.value());
            mediaService.deleteMediaById(userId, productId);
            return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
          }
          return new ResponseEntity<>(responseMedia, HttpStatus.CREATED);
        } else {
          return mediaResponse;
        }
      }
    } catch (Exception e) {
      System.out.println("Exception caught: " + e.toString());
      System.out.println(e.toString());
      ErrorMessage error =
          new ErrorMessage(
              "An error was encountered during media upload", HttpStatus.FORBIDDEN.value());
      return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
    }
    System.out.println("Returning 400 Bad Request");

    return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
  }

  @PreAuthorize("isAuthenticated()")
  @GetMapping("/media/product/{productId}")
  public ResponseEntity<?> getProductThumbnail(@PathVariable("productId") String productId) {
    return mediaService.getProductThumbnail(productId);
  }

  @PreAuthorize("isAuthenticated()")
  @GetMapping("/media/user/{userId}")
  public ResponseEntity<?> getUserAvatar(@PathVariable("userId") String userId) {
    return mediaService.getUserAvatar(userId);
  }
}
