package com.nfarm.controller;

import com.nfarm.dto.CategoryDto;
import com.nfarm.dto.PlantPageResponse;
import com.nfarm.model.Plant;
import com.nfarm.service.PlantService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.*;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PlantController.class)
public class PlantControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PlantService plantService;

    private Plant samplePlant;

    @BeforeEach
    void setUp() {
        samplePlant = new Plant();
        samplePlant.setId(1L);
        samplePlant.setSlug("monstera-deliciosa");
        samplePlant.setName("Monstera Deliciosa");
        samplePlant.setCategory("Indoor Plants");
        samplePlant.setPrice(24.99);
        samplePlant.setRating(4.8);
        samplePlant.setReviewCount(1240);
        samplePlant.setIsPopular(true);
    }

    @Test
    void testGetPlants() throws Exception {
        PlantPageResponse response = PlantPageResponse.builder()
                .plants(List.of(samplePlant))
                .total(1L)
                .page(1)
                .totalPages(1)
                .source("backend")
                .build();

        when(plantService.getPlants(any(), any(), any(), any(), any(), anyInt(), anyInt()))
                .thenReturn(response);

        mockMvc.perform(get("/api/plants")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.plants[0].name").value("Monstera Deliciosa"))
                .andExpect(jsonPath("$.total").value(1))
                .andExpect(jsonPath("$.source").value("backend"));
    }

    @Test
    void testGetFeaturedPlants() throws Exception {
        when(plantService.getFeatured(anyInt()))
                .thenReturn(List.of(samplePlant));

        mockMvc.perform(get("/api/plants/featured?limit=4"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.count").value(1))
                .andExpect(jsonPath("$.plants[0].slug").value("monstera-deliciosa"));
    }

    @Test
    void testGetCategories() throws Exception {
        CategoryDto cat = new CategoryDto("indoor-plants", "Indoor Plants", 12L);
        when(plantService.getCategories()).thenReturn(List.of(cat));
        when(plantService.getAllPlants()).thenReturn(List.of(samplePlant));

        mockMvc.perform(get("/api/plants/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.categories[0].name").value("Indoor Plants"))
                .andExpect(jsonPath("$.categories[0].count").value(12));
    }

    @Test
    void testSearchPlants() throws Exception {
        PlantPageResponse pageRes = PlantPageResponse.builder()
                .plants(List.of(samplePlant))
                .total(1L)
                .page(1)
                .totalPages(1)
                .source("backend")
                .build();

        when(plantService.getPlants(isNull(), eq("monstera"), eq("popular"), isNull(), isNull(), anyInt(), anyInt()))
                .thenReturn(pageRes);

        mockMvc.perform(get("/api/plants/search?q=monstera"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.query").value("monstera"))
                .andExpect(jsonPath("$.plants[0].name").value("Monstera Deliciosa"));
    }

    @Test
    void testGetPlantByIdOrSlug() throws Exception {
        when(plantService.findByIdOrSlug("monstera-deliciosa"))
                .thenReturn(Optional.of(samplePlant));

        mockMvc.perform(get("/api/plants/monstera-deliciosa"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Monstera Deliciosa"));
    }

    @Test
    void testGetPlantNotFound() throws Exception {
        when(plantService.findByIdOrSlug("unknown-plant"))
                .thenReturn(Optional.empty());

        mockMvc.perform(get("/api/plants/unknown-plant"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void testGetCareGuide() throws Exception {
        Map<String, Object> guide = new LinkedHashMap<>();
        guide.put("success", true);
        guide.put("plantName", "Monstera Deliciosa");

        when(plantService.getCareGuide("1")).thenReturn(guide);

        mockMvc.perform(get("/api/plants/1/care-guide"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.plantName").value("Monstera Deliciosa"));
    }
}
