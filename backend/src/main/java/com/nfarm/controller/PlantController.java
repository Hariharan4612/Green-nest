package com.nfarm.controller;

import com.nfarm.dto.CategoryDto;
import com.nfarm.dto.PlantPageResponse;
import com.nfarm.model.Plant;
import com.nfarm.service.PlantService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/plants")
@CrossOrigin(origins = "*")
public class PlantController {

    private final PlantService plantService;

    public PlantController(PlantService plantService) {
        this.plantService = plantService;
    }

    @GetMapping
    public ResponseEntity<?> getPlants(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String q,
            @RequestParam(required = false, defaultValue = "popular") String sortBy,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Boolean featured,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "12") int limit,
            @RequestParam(required = false) String format
    ) {
        String effectiveSearch = (search != null && !search.isEmpty()) ? search : q;

        if ("array".equalsIgnoreCase(format)) {
            return ResponseEntity.ok(plantService.getAllPlants());
        }

        PlantPageResponse response = plantService.getPlants(
                category, effectiveSearch, sortBy, maxPrice, featured, page, limit
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/featured")
    public ResponseEntity<Map<String, Object>> getFeatured(
            @RequestParam(defaultValue = "8") int limit
    ) {
        List<Plant> featured = plantService.getFeatured(limit);
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("count", featured.size());
        response.put("plants", featured);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/categories")
    public ResponseEntity<Map<String, Object>> getCategories() {
        List<CategoryDto> categories = plantService.getCategories();
        long totalPlants = plantService.getAllPlants().size();

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("totalCategories", categories.size());
        response.put("totalPlants", totalPlants);
        response.put("categories", categories);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> search(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "12") int limit
    ) {
        String searchTerm = (q != null && !q.isEmpty()) ? q : query;
        PlantPageResponse pageRes = plantService.getPlants(null, searchTerm, "popular", null, null, page, limit);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("query", searchTerm);
        response.put("total", pageRes.getTotal());
        response.put("currentPage", pageRes.getPage());
        response.put("totalPages", pageRes.getTotalPages());
        response.put("plants", pageRes.getPlants());
        response.put("source", "backend");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{idOrSlug}")
    public ResponseEntity<?> getPlantById(@PathVariable String idOrSlug) {
        return plantService.findByIdOrSlug(idOrSlug)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> {
                    Map<String, Object> err = new LinkedHashMap<>();
                    err.put("success", false);
                    err.put("error", "Plant not found: " + idOrSlug);
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(err);
                });
    }

    @GetMapping("/{idOrSlug}/care-guide")
    public ResponseEntity<Map<String, Object>> getCareGuide(@PathVariable String idOrSlug) {
        try {
            return ResponseEntity.ok(plantService.getCareGuide(idOrSlug));
        } catch (Exception e) {
            Map<String, Object> err = new LinkedHashMap<>();
            err.put("success", false);
            err.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(err);
        }
    }
}
