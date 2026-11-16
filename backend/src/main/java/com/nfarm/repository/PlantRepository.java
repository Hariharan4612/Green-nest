package com.nfarm.repository;

import com.nfarm.model.Plant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlantRepository extends JpaRepository<Plant, Long>, JpaSpecificationExecutor<Plant> {

    Optional<Plant> findBySlug(String slug);

    List<Plant> findByIsPopularTrue();

    @Query("SELECT p FROM Plant p WHERE " +
           "(:category IS NULL OR LOWER(p.category) LIKE LOWER(CONCAT('%', :category, '%'))) AND " +
           "(:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(p.scientificName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
           "(:featured IS NULL OR p.isPopular = :featured)")
    Page<Plant> findWithFilters(
            @Param("category") String category,
            @Param("search") String search,
            @Param("maxPrice") Double maxPrice,
            @Param("featured") Boolean featured,
            Pageable pageable
    );

    @Query("SELECT p.category, COUNT(p) FROM Plant p GROUP BY p.category")
    List<Object[]> countPlantsByCategory();
}

