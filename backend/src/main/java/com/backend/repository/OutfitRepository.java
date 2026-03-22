package com.backend.repository;

import com.backend.model.Outfit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OutfitRepository extends JpaRepository<Outfit, Long> {

    List<Outfit> findByIsPopularTrue();

    List<Outfit> findByCategory(String category);

    List<Outfit> findByIsAvailableTrue();

    List<Outfit> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String name, String description);

    List<Outfit> findByCategoryAndIsAvailableTrue(String category);
}