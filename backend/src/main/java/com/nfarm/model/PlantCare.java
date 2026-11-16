package com.nfarm.model;

import java.io.Serializable;

public class PlantCare implements Serializable {
    private String sunlight;
    private String water;
    private String humidity;
    private String temperature;
    private String soil;
    private String fertilizer;

    public PlantCare() {}

    public PlantCare(String sunlight, String water, String humidity, String temperature, String soil, String fertilizer) {
        this.sunlight = sunlight;
        this.water = water;
        this.humidity = humidity;
        this.temperature = temperature;
        this.soil = soil;
        this.fertilizer = fertilizer;
    }

    public String getSunlight() { return sunlight; }
    public void setSunlight(String sunlight) { this.sunlight = sunlight; }

    public String getWater() { return water; }
    public void setWater(String water) { this.water = water; }

    public String getHumidity() { return humidity; }
    public void setHumidity(String humidity) { this.humidity = humidity; }

    public String getTemperature() { return temperature; }
    public void setTemperature(String temperature) { this.temperature = temperature; }

    public String getSoil() { return soil; }
    public void setSoil(String soil) { this.soil = soil; }

    public String getFertilizer() { return fertilizer; }
    public void setFertilizer(String fertilizer) { this.fertilizer = fertilizer; }
}
