package com.backend.controller;

import com.backend.model.Outfit;
import com.backend.service.OutfitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Public controller for browsing outfits
 * Accessible by both guest and authenticated users
 */
@RestController
@RequestMapping("/api/outfits")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" }, allowCredentials = "true")
public class OutfitController {

    @Autowired
    private OutfitService outfitService;

    /**
     * Get all available outfits (public access)
     */
    @GetMapping
    public ResponseEntity<?> getAllOutfits() {
        try {
            List<Outfit> outfits = outfitService.getAllOutfits();
            return ResponseEntity.ok(outfits);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to fetch outfits", "message", e.getMessage()));
        }
    }

    /**
     * Get popular/featured outfits (public access)
     */
    @GetMapping("/popular")
    public ResponseEntity<?> getPopularOutfits() {
        try {
            List<Outfit> outfits = outfitService.getPopularOutfits();
            return ResponseEntity.ok(outfits);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to fetch popular outfits", "message", e.getMessage()));
        }
    }

    /**
     * Get outfit by ID (public access)
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getOutfitById(@PathVariable Long id) {
        try {
            Outfit outfit = outfitService.getOutfitById(id);
            if (outfit == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(outfit);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to fetch outfit", "message", e.getMessage()));
        }
    }

    /**
     * Search outfits by category (public access)
     */
    @GetMapping("/category/{category}")
    public ResponseEntity<?> getOutfitsByCategory(@PathVariable String category) {
        try {
            List<Outfit> outfits = outfitService.getOutfitsByCategory(category);
            return ResponseEntity.ok(outfits);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to fetch outfits by category", "message", e.getMessage()));
        }
    }

    /**
     * Check availability for specific dates
     * Returns availability info and includes a note if user is a guest
     */
    @GetMapping("/{id}/availability")
    public ResponseEntity<?> checkAvailability(
            @PathVariable Long id,
            @RequestParam String startDate,
            @RequestParam String endDate) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isGuest = auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_GUEST"));

        try {
            Map<String, Object> availability = outfitService.checkAvailability(id, startDate, endDate);

            if (isGuest) {
                availability.put("guestUser", true);
                availability.put("message", "Sign in to complete your booking");
            }

            return ResponseEntity.ok(availability);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to check availability", "message", e.getMessage()));
        }
    }
}