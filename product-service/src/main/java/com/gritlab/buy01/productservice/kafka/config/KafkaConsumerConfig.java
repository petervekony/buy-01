package com.gritlab.buy01.productservice.kafka.config;

import java.util.HashMap;
import java.util.Map;

import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.support.serializer.JsonDeserializer;

import com.gritlab.buy01.productservice.kafka.message.TokenValidationResponse;
import com.gritlab.buy01.productservice.kafka.message.UserProfileDeleteMessage;

@Configuration
@EnableKafka
public class KafkaConsumerConfig {

  @Value("${spring.kafka.bootstrap-servers}")
  private String bootstrapServers;

  @Bean
  public Map<String, Object> consumerConfigs() {
    Map<String, Object> props = new HashMap<>();
    props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
    props.put(ConsumerConfig.GROUP_ID_CONFIG, "product-service-group");
    props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
    props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);
    return props;
  }

  @Bean
  public ConsumerFactory<String, TokenValidationResponse> consumerFactory() {
    JsonDeserializer<TokenValidationResponse> deserializer =
        new JsonDeserializer<>(TokenValidationResponse.class);
    deserializer.setUseTypeHeaders(false);

    return new DefaultKafkaConsumerFactory<>(
        consumerConfigs(), new StringDeserializer(), deserializer);
  }

  @Bean
  public ConcurrentKafkaListenerContainerFactory<String, TokenValidationResponse>
      kafkaListenerContainerFactory() {
    ConcurrentKafkaListenerContainerFactory<String, TokenValidationResponse> factory =
        new ConcurrentKafkaListenerContainerFactory<>();
    factory.setConsumerFactory(consumerFactory());
    factory.setConcurrency(3); // set the amount of concurrent threads
    return factory;
  }

  @Bean
  public ConsumerFactory<String, UserProfileDeleteMessage> userProductDeletionConsumerFactory() {
    Map<String, Object> configs = consumerConfigs();
    configs.put(ConsumerConfig.GROUP_ID_CONFIG, "user-product-deletion-group");
    JsonDeserializer<UserProfileDeleteMessage> deserializer =
        new JsonDeserializer<>(UserProfileDeleteMessage.class);
    deserializer.setUseTypeHeaders(false);

    return new DefaultKafkaConsumerFactory<>(configs, new StringDeserializer(), deserializer);
  }

  @Bean
  public ConcurrentKafkaListenerContainerFactory<String, UserProfileDeleteMessage>
      kafkaProductDeletionContainerFactory() {
    ConcurrentKafkaListenerContainerFactory<String, UserProfileDeleteMessage> factory =
        new ConcurrentKafkaListenerContainerFactory<>();
    factory.setConsumerFactory(userProductDeletionConsumerFactory());
    factory.setConcurrency(3);
    return factory;
  }
}
