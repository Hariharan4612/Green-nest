package com.nfarm.service;

import com.nfarm.dto.CategoryDto;
import com.nfarm.dto.PlantPageResponse;
import com.nfarm.model.Plant;
import com.nfarm.repository.PlantRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class PlantService {

    private final PlantRepository plantRepository;

    public PlantService(PlantRepository plantRepository) {
        this.plantRepository = plantRepository;
    }

    public List<Plant> getAllPlants() {
        return plantRepository.findAll();
    }

    public PlantPageResponse getPlants(String category, String search, String sortBy,
                                      Double maxPrice, Boolean featured, int page, int limit) {
        int pageNumber = Math.max(0, page - 1);
        int pageSize = limit > 0 ? limit : 12;

        Sort sort = Sort.by("id").ascending();
        if ("price-low".equalsIgnoreCase(sortBy)) {
            sort = Sort.by("price").ascending();
        } else if ("price-high".equalsIgnoreCase(sortBy)) {
            sort = Sort.by("price").descending();
        } else if ("rating".equalsIgnoreCase(sortBy)) {
            sort = Sort.by("rating").descending();
        } else if ("name".equalsIgnoreCase(sortBy)) {
            sort = Sort.by("name").ascending();
        } else if ("popular".equalsIgnoreCase(sortBy)) {
            sort = Sort.by("isPopular").descending().and(Sort.by("rating").descending());
        }

        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);

        String catFilter = (category != null && !category.trim().isEmpty() && !"all".equalsIgnoreCase(category)) ? category.trim() : null;
        String searchFilter = (search != null && !search.trim().isEmpty()) ? search.trim() : null;

        Page<Plant> resultPage = plantRepository.findWithFilters(catFilter, searchFilter, maxPrice, featured, pageable);

        return PlantPageResponse.builder()
                .plants(resultPage.getContent())
                .total(resultPage.getTotalElements())
                .page(resultPage.getNumber() + 1)
                .totalPages(resultPage.getTotalPages())
                .source("backend")
                .build();
    }

    public List<Plant> getFeatured(int limit) {
        int max = limit > 0 ? limit : 8;
        List<Plant> popular = plantRepository.findByIsPopularTrue();
        if (popular.isEmpty()) {
            Pageable pageable = PageRequest.of(0, max, Sort.by("rating").descending());
            return plantRepository.findAll(pageable).getContent();
        }
        return popular.size() > max ? popular.subList(0, max) : popular;
    }

    public List<CategoryDto> getCategories() {
        List<Object[]> rows = plantRepository.countPlantsByCategory();
        List<CategoryDto> categories = new ArrayList<>();

        for (Object[] row : rows) {
            String name = (String) row[0];
            Long count = ((Number) row[1]).longValue();
            String id = name.toLowerCase().replaceAll("[^a-z0-9]+", "-");
            categories.add(new CategoryDto(id, name, count));
        }

        return categories;
    }

    public Optional<Plant> findByIdOrSlug(String idOrSlug) {
        if (idOrSlug == null || idOrSlug.trim().isEmpty()) {
            return Optional.empty();
        }

        try {
            Long id = Long.parseLong(idOrSlug.trim());
            Optional<Plant> plant = plantRepository.findById(id);
            if (plant.isPresent()) return plant;
        } catch (NumberFormatException ignored) {}

        return plantRepository.findBySlug(idOrSlug.trim().toLowerCase());
    }

    public Map<String, Object> getCareGuide(String idOrSlug) {
        Plant plant = findByIdOrSlug(idOrSlug)
                .orElseThrow(() -> new RuntimeException("Plant not found: " + idOrSlug));

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("plantId", plant.getId());
        response.put("plantName", plant.getName());
        response.put("care", plant.getCare());
        response.put("careGuides", plant.getCareGuides());
        return response;
    }

    public Plant save(Plant plant) {
        return plantRepository.save(plant);
    }
}
