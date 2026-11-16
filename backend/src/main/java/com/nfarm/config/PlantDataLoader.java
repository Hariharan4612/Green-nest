package com.nfarm.config;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nfarm.model.Plant;
import com.nfarm.repository.PlantRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.List;

@Component
public class PlantDataLoader implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(PlantDataLoader.class);

    private final PlantRepository plantRepository;
    private final ObjectMapper objectMapper;

    public PlantDataLoader(PlantRepository plantRepository, ObjectMapper objectMapper) {
        this.plantRepository = plantRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    public void run(String... args) {
        try {
            long count = plantRepository.count();
            if (count < 100) {
                log.info("Populating database with 100 plants from data/plants.json...");
                try (InputStream is = new ClassPathResource("data/plants.json").getInputStream()) {
                    List<Plant> plants = objectMapper.readValue(is, new TypeReference<List<Plant>>() {});
                    plantRepository.deleteAll();
                    plantRepository.saveAll(plants);
                    log.info("Successfully seeded {} plants into database!", plants.size());
                }
            } else {
                log.info("Database already contains {} plants.", count);
            }
        } catch (Exception e) {
            log.warn("Database initialization skipped or encountered notice: {}", e.getMessage());
        }
    }
}

