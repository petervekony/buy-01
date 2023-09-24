package com.gritlab.buy01.mediaservice.service;

import java.io.IOException;
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
      Media media = new Media(new Binary(bytes), productId, userId);
      mediaRepository.save(media);
    } catch (IOException e) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return new ResponseEntity<>(HttpStatus.CREATED);
  }
}
