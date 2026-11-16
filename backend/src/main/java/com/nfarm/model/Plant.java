package com.nfarm.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "plants")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Plant implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 150)
    private String slug;

    @Column(nullable = false)
    private String name;

    @Column(name = "scientific_name")
    private String scientificName;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private Double price;

    @Column(name = "original_price")
    private Double originalPrice;

    private String discount;

    private Double rating = 4.8;

    @Column(name = "review_count")
    private Integer reviewCount = 120;

    @Column(columnDefinition = "TEXT")
    private String image;

    @Convert(converter = JsonConverters.StringListConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<String> gallery = new ArrayList<>();

    private String tag;
    private String badge;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Convert(converter = JsonConverters.StringListConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<String> features = new ArrayList<>();

    @Convert(converter = JsonConverters.StringListConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<String> highlights = new ArrayList<>();

    @Convert(converter = JsonConverters.PlantCareConverter.class)
    @Column(columnDefinition = "TEXT")
    private PlantCare care;

    @Convert(converter = JsonConverters.CareGuideListConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<PlantCareGuide> careGuides = new ArrayList<>();

    private String watering;
    private String sunlight;
    private String cycle;

    @Column(name = "care_level")
    private String careLevel;

    private String size;

    @Column(name = "pot_size")
    private String potSize;

    private String toxicity;

    @Column(name = "in_stock")
    private Boolean inStock = true;

    @Column(name = "is_popular")
    private Boolean isPopular = false;

    public Plant() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getScientificName() { return scientificName; }
    public void setScientificName(String scientificName) { this.scientificName = scientificName; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Double getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(Double originalPrice) { this.originalPrice = originalPrice; }

    public String getDiscount() { return discount; }
    public void setDiscount(String discount) { this.discount = discount; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Integer getReviewCount() { return reviewCount; }
    public void setReviewCount(Integer reviewCount) { this.reviewCount = reviewCount; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public List<String> getGallery() { return gallery; }
    public void setGallery(List<String> gallery) { this.gallery = gallery != null ? gallery : new ArrayList<>(); }

    public String getTag() { return tag; }
    public void setTag(String tag) { this.tag = tag; }

    public String getBadge() { return badge; }
    public void setBadge(String badge) { this.badge = badge; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<String> getFeatures() { return features; }
    public void setFeatures(List<String> features) { this.features = features != null ? features : new ArrayList<>(); }

    public List<String> getHighlights() { return highlights; }
    public void setHighlights(List<String> highlights) { this.highlights = highlights != null ? highlights : new ArrayList<>(); }

    public PlantCare getCare() { return care; }
    public void setCare(PlantCare care) { this.care = care; }

    public List<PlantCareGuide> getCareGuides() { return careGuides; }
    public void setCareGuides(List<PlantCareGuide> careGuides) { this.careGuides = careGuides != null ? careGuides : new ArrayList<>(); }

    public String getWatering() { return watering; }
    public void setWatering(String watering) { this.watering = watering; }

    public String getSunlight() { return sunlight; }
    public void setSunlight(String sunlight) { this.sunlight = sunlight; }

    public String getCycle() { return cycle; }
    public void setCycle(String cycle) { this.cycle = cycle; }

    public String getCareLevel() { return careLevel; }
    public void setCareLevel(String careLevel) { this.careLevel = careLevel; }

    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }

    public String getPotSize() { return potSize; }
    public void setPotSize(String potSize) { this.potSize = potSize; }

    public String getToxicity() { return toxicity; }
    public void setToxicity(String toxicity) { this.toxicity = toxicity; }

    public Boolean getInStock() { return inStock; }
    public void setInStock(Boolean inStock) { this.inStock = inStock; }

    public Boolean getIsPopular() { return isPopular; }
    public void setIsPopular(Boolean isPopular) { this.isPopular = isPopular; }
}
