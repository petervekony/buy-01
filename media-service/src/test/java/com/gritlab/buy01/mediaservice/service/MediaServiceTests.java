package com.gritlab.buy01.mediaservice.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import com.gritlab.buy01.mediaservice.model.Media;
import com.gritlab.buy01.mediaservice.repository.MediaRepository;

public class MediaServiceTests {

  @Mock private MediaRepository mediaRepository;

  @InjectMocks private MediaService mediaService;

  @BeforeEach
  public void setUp() {
    MockitoAnnotations.openMocks(this);
  }

  @Test
  public void testGetMediaById() {
    String mediaId = "123";
    Media expectedMedia = new Media();
    expectedMedia.setId(mediaId);

    when(mediaRepository.findById(mediaId)).thenReturn(Optional.of(expectedMedia));

    Optional<Media> result = mediaService.getMediaById(mediaId);

    assertNotNull(result, "Result should not be null");
    assertEquals(expectedMedia, result.get(), "Returned media should match the expected media");
  }

  @Test
  public void testGetAllMediaByProductId() {
    String productId = "product123";
    List<Media> expectedMediaList = new ArrayList<>();

    when(mediaRepository.findAllByProductId(productId)).thenReturn(Optional.of(expectedMediaList));

    Optional<List<Media>> result = mediaService.getAllMediaByProductId(productId);

    assertNotNull(result, "Result should not be null");
    assertEquals(
        expectedMediaList, result.get(), "Returned media list should match the expected list");
  }

  @Test
  public void testDeleteById() {
    String mediaId = "123";

    ResponseEntity<?> response = mediaService.deleteById(mediaId);

    assertEquals(
        HttpStatus.NO_CONTENT, response.getStatusCode(), "Status code should be 204 NO_CONTENT");
    Mockito.verify(mediaRepository, Mockito.times(1)).deleteById(mediaId);
  }

  @Test
  public void testDeleteMediaById_UserId() {
    String userId = "user123";

    ResponseEntity<?> response = mediaService.deleteMediaById(userId, null);

    assertEquals(
        HttpStatus.NO_CONTENT, response.getStatusCode(), "Status code should be 204 NO_CONTENT");
    Mockito.verify(mediaRepository, Mockito.times(1)).deleteAllByUserId(userId);
  }

  @Test
  public void testDeleteMediaById_ProductId() {
    String productId = "product123";

    ResponseEntity<?> response = mediaService.deleteMediaById(null, productId);

    assertEquals(
        HttpStatus.NO_CONTENT, response.getStatusCode(), "Status code should be 204 NO_CONTENT");
    Mockito.verify(mediaRepository, Mockito.times(1)).deleteAllByProductId(productId);
  }

  @Test
  public void testCreateMedia() throws IOException {
    MultipartFile image = createTestMultipartFile();
    String userId = "user123";
    String productId = "product123";

    Media expectedMedia = new Media();
    when(mediaRepository.save(expectedMedia)).thenReturn(expectedMedia);

    ResponseEntity<?> response = mediaService.createMedia(image, userId, productId);

    assertNotNull(response, "Response is null");
    assertEquals(HttpStatus.CREATED, response.getStatusCode(), "Status code should be 201 CREATED");
  }

  @Test
  public void testCreateMedia_TooLargeFile() throws IOException {
    MultipartFile image = createLargeTestMultipartFile();
    String userId = "user123";
    String productId = "product123";

    ResponseEntity<?> response = mediaService.createMedia(image, userId, productId);

    assertEquals(
        HttpStatus.PAYLOAD_TOO_LARGE,
        response.getStatusCode(),
        "Status code should be 413 PAYLOAD_TOO_LARGE");
  }

  private MultipartFile createTestMultipartFile() {
    return new MultipartFile() {
      @Override
      public String getName() {
        return "test-file";
      }

      @Override
      public String getOriginalFilename() {
        return "test.jpg";
      }

      @Override
      public String getContentType() {
        return "image/jpeg";
      }

      @Override
      public boolean isEmpty() {
        return false;
      }

      @Override
      public long getSize() {
        return 1024;
      }

      @Override
      public byte[] getBytes() throws IOException {
        return new byte[1024];
      }

      @Override
      public InputStream getInputStream() throws IOException {
        return null;
      }

      @Override
      public void transferTo(File dest) throws IOException, IllegalStateException {}
    };
  }

  private MultipartFile createLargeTestMultipartFile() {
    return new MultipartFile() {
      @Override
      public String getName() {
        return "test-large-file";
      }

      @Override
      public String getOriginalFilename() {
        return "large.jpg";
      }

      @Override
      public String getContentType() {
        return "image/jpeg";
      }

      @Override
      public boolean isEmpty() {
        return false;
      }

      @Override
      public long getSize() {
        return 3 * 1024 * 1024;
      }

      @Override
      public byte[] getBytes() throws IOException {
        return new byte[3 * 1024 * 1024];
      }

      @Override
      public InputStream getInputStream() throws IOException {
        return null;
      }

      @Override
      public void transferTo(File dest) throws IOException, IllegalStateException {}
    };
  }
}
