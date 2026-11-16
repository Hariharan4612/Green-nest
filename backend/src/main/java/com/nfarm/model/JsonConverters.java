package com.nfarm.model;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class JsonConverters {

    private static final ObjectMapper mapper = new ObjectMapper();

    @Converter
    public static class StringListConverter implements AttributeConverter<List<String>, String> {
        @Override
        public String convertToDatabaseColumn(List<String> attribute) {
            if (attribute == null) return null;
            try {
                return mapper.writeValueAsString(attribute);
            } catch (JsonProcessingException e) {
                return "[]";
            }
        }

        @Override
        public List<String> convertToEntityAttribute(String dbData) {
            if (dbData == null || dbData.trim().isEmpty()) return new ArrayList<>();
            try {
                return mapper.readValue(dbData, new TypeReference<List<String>>() {});
            } catch (IOException e) {
                return new ArrayList<>();
            }
        }
    }

    @Converter
    public static class PlantCareConverter implements AttributeConverter<PlantCare, String> {
        @Override
        public String convertToDatabaseColumn(PlantCare attribute) {
            if (attribute == null) return null;
            try {
                return mapper.writeValueAsString(attribute);
            } catch (JsonProcessingException e) {
                return null;
            }
        }

        @Override
        public PlantCare convertToEntityAttribute(String dbData) {
            if (dbData == null || dbData.trim().isEmpty()) return null;
            try {
                return mapper.readValue(dbData, PlantCare.class);
            } catch (IOException e) {
                return null;
            }
        }
    }

    @Converter
    public static class CareGuideListConverter implements AttributeConverter<List<PlantCareGuide>, String> {
        @Override
        public String convertToDatabaseColumn(List<PlantCareGuide> attribute) {
            if (attribute == null) return null;
            try {
                return mapper.writeValueAsString(attribute);
            } catch (JsonProcessingException e) {
                return "[]";
            }
        }

        @Override
        public List<PlantCareGuide> convertToEntityAttribute(String dbData) {
            if (dbData == null || dbData.trim().isEmpty()) return new ArrayList<>();
            try {
                return mapper.readValue(dbData, new TypeReference<List<PlantCareGuide>>() {});
            } catch (IOException e) {
                return new ArrayList<>();
            }
        }
    }
}

