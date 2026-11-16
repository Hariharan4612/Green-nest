package com.nfarm.dto;

import com.nfarm.model.Plant;
import java.util.List;

public class PlantPageResponse {
    private List<Plant> plants;
    private Long total;
    private Integer page;
    private Integer totalPages;
    private String source = "backend";

    public PlantPageResponse() {}

    public PlantPageResponse(List<Plant> plants, Long total, Integer page, Integer totalPages, String source) {
        this.plants = plants;
        this.total = total;
        this.page = page;
        this.totalPages = totalPages;
        this.source = source != null ? source : "backend";
    }

    public List<Plant> getPlants() { return plants; }
    public void setPlants(List<Plant> plants) { this.plants = plants; }

    public Long getTotal() { return total; }
    public void setTotal(Long total) { this.total = total; }

    public Integer getPage() { return page; }
    public void setPage(Integer page) { this.page = page; }

    public Integer getTotalPages() { return totalPages; }
    public void setTotalPages(Integer totalPages) { this.totalPages = totalPages; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private List<Plant> plants;
        private Long total;
        private Integer page;
        private Integer totalPages;
        private String source = "backend";

        public Builder plants(List<Plant> plants) { this.plants = plants; return this; }
        public Builder total(Long total) { this.total = total; return this; }
        public Builder page(Integer page) { this.page = page; return this; }
        public Builder totalPages(Integer totalPages) { this.totalPages = totalPages; return this; }
        public Builder source(String source) { this.source = source; return this; }

        public PlantPageResponse build() {
            return new PlantPageResponse(plants, total, page, totalPages, source);
        }
    }
}
