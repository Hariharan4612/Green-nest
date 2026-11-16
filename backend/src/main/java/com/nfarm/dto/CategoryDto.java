package com.nfarm.dto;

public class CategoryDto {
    private String id;
    private String name;
    private Long count;

    public CategoryDto() {}

    public CategoryDto(String id, String name, Long count) {
        this.id = id;
        this.name = name;
        this.count = count;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Long getCount() { return count; }
    public void setCount(Long count) { this.count = count; }
}
