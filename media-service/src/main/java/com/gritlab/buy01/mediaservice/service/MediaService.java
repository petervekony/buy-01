package com.gritlab.buy01.mediaservice.service;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

import org.bson.types.Binary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.gritlab.buy01.mediaservice.event.DeleteMediaEvent;
import com.gritlab.buy01.mediaservice.model.Media;
import com.gritlab.buy01.mediaservice.payload.response.ErrorMessage;
import com.gritlab.buy01.mediaservice.payload.response.SingleMediaResponse;
import com.gritlab.buy01.mediaservice.repository.MediaRepository;

@Service
public class MediaService {

  @Autowired MediaRepository mediaRepository;

  @Autowired private ApplicationEventPublisher eventPublisher;

  public void requestDeleteAllUserAvatars(String userId) {
    eventPublisher.publishEvent(new DeleteMediaEvent(this, userId, null));
  }

  public void requestDeleteAllProductMedia(String productId) {
    eventPublisher.publishEvent(new DeleteMediaEvent(this, null, productId));
  }

  public Optional<List<Media>> getAllMediaByProductId(String productId) {
    Optional<List<Media>> media = mediaRepository.findAllByProductId(productId);
    return media;
  }

  public ResponseEntity<?> deleteById(String id) {
    mediaRepository.deleteById(id);
    return new ResponseEntity<>(HttpStatus.NO_CONTENT);
  }

  public ResponseEntity<?> deleteMediaById(String userId, String productId) {
    ErrorMessage errorMessage =
        new ErrorMessage("Error: bad request to delete media", HttpStatus.BAD_REQUEST.value());
    if (userId != null) {
      mediaRepository.deleteAllByUserId(userId);
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    if (productId != null) {
      mediaRepository.deleteAllByProductId(productId);
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    return new ResponseEntity<>(errorMessage, HttpStatus.BAD_REQUEST);
  }

  public ResponseEntity<?> createMedia(MultipartFile image, String userId, String productId) {
    ErrorMessage errorMessage;
    Optional<List<Media>> productMedia = mediaRepository.findAllByProductId(productId);
    if (productMedia.isPresent() && productMedia.get().size() >= 6) {
      errorMessage =
          new ErrorMessage(
              "Error: product has maximum number of media already",
              HttpStatus.UNPROCESSABLE_ENTITY.value());
      return new ResponseEntity<>(errorMessage, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    if (image.getSize() > 2 * 1024 * 1024) {
      errorMessage =
          new ErrorMessage(
              "Error: too large file. Maximum filesize 2MB", HttpStatus.PAYLOAD_TOO_LARGE.value());
      return new ResponseEntity<>(errorMessage, HttpStatus.PAYLOAD_TOO_LARGE);
    }
    Media media;
    try {
      byte[] bytes = image.getBytes();
      String contentType = image.getContentType();
      media = new Media(new Binary(bytes), productId, userId);
      media.setMimeType(contentType);
      media = mediaRepository.save(media);
    } catch (IOException e) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return new ResponseEntity<>(media, HttpStatus.CREATED);
  }

  public void deleteAllUserAvatars(String userId) {
    mediaRepository.deleteAllByUserId(userId);
  }

  public void deleteAllProductMedia(String productId) {
    mediaRepository.deleteAllByProductId(productId);
  }

  public ResponseEntity<?> getProductThumbnail(String productId) {
    Optional<Media> mediaOpt = mediaRepository.findFirstByProductId(productId);
    return convertAndReturnMedia(mediaOpt);
  }

  public ResponseEntity<?> getUserAvatar(String userId) {
    Optional<Media> mediaOpt = mediaRepository.findFirstByUserId(userId);
    return convertAndReturnMedia(mediaOpt);
  }

  private ResponseEntity<?> convertAndReturnMedia(Optional<Media> mediaOpt) {
    if (mediaOpt.isPresent()) {
      Media media = mediaOpt.get();
      String base64Image = Base64.getEncoder().encodeToString(media.getImage().getData());

      SingleMediaResponse response =
          new SingleMediaResponse(
              media.getId(),
              base64Image,
              media.getProductId(),
              media.getUserId(),
              media.getMimeType());
      return new ResponseEntity<>(response, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
  }

  public void deletePreviousUserAvatars(String userId, String id) {
    Optional<List<Media>> fetched = mediaRepository.findAllByUserId(userId);
    if (fetched.isPresent()) {
      List<Media> allMedia = fetched.get();
      for (Media media : allMedia) {
        if (!media.getId().equals(id)) {
          mediaRepository.deleteById(media.getId());
        }
      }
    }
  }
}
