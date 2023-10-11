package com.gritlab.buy01.mediaservice.service;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

import org.bson.types.Binary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.gritlab.buy01.mediaservice.model.Media;
import com.gritlab.buy01.mediaservice.payload.response.ErrorMessage;
import com.gritlab.buy01.mediaservice.payload.response.SingleMediaResponse;
import com.gritlab.buy01.mediaservice.repository.MediaRepository;

@Service
public class MediaService {

  @Autowired MediaRepository mediaRepository;

  public Optional<List<Media>> getAllMediaByProductId(String productId) {
    Optional<List<Media>> media = mediaRepository.findAllByProductId(productId);
    return media;
  }

  public ResponseEntity<?> deleteMediaById(String userId, String productId) {
    ErrorMessage errorMessage =
        new ErrorMessage("Error: media not found", HttpStatus.NOT_FOUND.toString());
    if (userId != null) {
      if (!mediaRepository.findByUserId(userId).isEmpty()) {
        return new ResponseEntity<>(errorMessage, HttpStatus.NOT_FOUND);
      }
      mediaRepository.deleteByUserId(userId);
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    if (productId != null) {
      if (!mediaRepository.findAllByProductId(productId).isEmpty()) {
        return new ResponseEntity<>(errorMessage, HttpStatus.NOT_FOUND);
      }
      mediaRepository.deleteAllByProductId(productId);
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    return new ResponseEntity<>(errorMessage, HttpStatus.NOT_FOUND);
  }

  public ResponseEntity<?> createMedia(MultipartFile image, String userId, String productId) {
    if (image.getSize() > 2 * 1024 * 1024) {
      ErrorMessage errorMessage =
          new ErrorMessage(
              "Error: too large file. Maximum filesize 2MB",
              HttpStatus.PAYLOAD_TOO_LARGE.toString());
      return new ResponseEntity<>(errorMessage, HttpStatus.PAYLOAD_TOO_LARGE);
    }
    try {
      byte[] bytes = image.getBytes();
      String contentType = image.getContentType();
      System.out.println("MEDIATYPE: !!!!!!!!!!!!!!!!!!!!!!!!!!! " + contentType);
      Media media = new Media(new Binary(bytes), productId, userId);
      media.setMimeType(contentType);
      mediaRepository.save(media);
    } catch (IOException e) {
      System.out.println("THIS IS MESSAGE" + e.getMessage());
      System.out.println("THIS IS CAUSE" + e.getCause());
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return new ResponseEntity<>(HttpStatus.CREATED);
  }

  public void deleteAllUserAvatars(String userId) {
    mediaRepository.deleteAllByUserId(userId);
  }

  public void deleteAllProductMedia(String productId) {
    mediaRepository.deleteAllByProductId(productId);
  }

  public ResponseEntity<?> getProductThumbnail(String productId) {
    Optional<Media> mediaOpt = mediaRepository.findFirstByProductId(productId);
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
}
