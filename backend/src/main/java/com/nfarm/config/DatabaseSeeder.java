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
public class DatabaseSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DatabaseSeeder.class);

    private final PlantRepository plantRepository;
    private final ObjectMapper objectMapper;

    public DatabaseSeeder(PlantRepository plantRepository, ObjectMapper objectMapper) {
        this.plantRepository = plantRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    public void run(String... args) {
        long currentCount = plantRepository.count();
        if (currentCount == 0) {
            log.info("Plant database is empty. Seeding initial plant catalog from data/plants.json...");
            try {
                ClassPathResource resource = new ClassPathResource("data/plants.json");
                if (resource.exists()) {
                    try (InputStream is = resource.getInputStream()) {
                        List<Plant> plants = objectMapper.readValue(is, new TypeReference<List<Plant>>() {});
                        plantRepository.saveAll(plants);
                        log.info("Successfully seeded {} plants into database.", plants.size());
                    }
                } else {
                    log.warn("data/plants.json not found in classpath. Skipping seed.");
                }
            } catch (Exception e) {
                log.error("Failed to seed plants database: {}", e.getMessage(), e);
            }
        } else {
            log.info("Database already contains {} plants. Skipping seeder.", currentCount);
        }
    }
}
