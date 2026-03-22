package com.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Outfit entity representing rental items
 */
@Entity
@Table(name = "outfits")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Outfit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(length = 50)
    private String category;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerDay;

    @Column(length = 500)
    private String imageUrl;

    @ElementCollection
    @CollectionTable(name = "outfit_sizes", joinColumns = @JoinColumn(name = "outfit_id"))
    @Column(name = "size")
    private List<String> availableSizes = new ArrayList<>();

    @Column(nullable = false)
    private Integer stockQuantity = 1;

    @Column(length = 100)
    private String designer;

    @Column(nullable = false)
    private Boolean isPopular = false;

    @Column(nullable = false)
    private Boolean isAvailable = true;

    private Double rating = 4.0;

    private Integer reviewCount = 0;

    // Helper method to check if outfit is in stock
    public boolean isInStock() {
        return isAvailable && stockQuantity > 0;
    }

    // Helper method to format price for display
    public String getFormattedPrice() {
        return String.format("₱%.2f", pricePerDay);
    }
}