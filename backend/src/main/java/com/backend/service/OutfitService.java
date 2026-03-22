package com.backend.service;

import com.backend.model.Outfit;
import com.backend.repository.OutfitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@SuppressWarnings("unused")
@Service
public class OutfitService {

    @Autowired
    private OutfitRepository outfitRepository;

    public List<Outfit> getAllOutfits() {
        return outfitRepository.findAll();
    }

    public List<Outfit> getPopularOutfits() {
        return outfitRepository.findByIsPopularTrue();
    }

    public Outfit getOutfitById(Long id) {
        return outfitRepository.findById(id).orElse(null);
    }

    public List<Outfit> getOutfitsByCategory(String category) {
        return outfitRepository.findByCategory(category);
    }

    public Outfit saveOutfit(Outfit outfit) {
        return outfitRepository.save(outfit);
    }

    public void deleteOutfit(Long id) {
        outfitRepository.deleteById(id);
    }

    /**
     * Check availability for a specific outfit and date range
     */
    public Map<String, Object> checkAvailability(Long outfitId, String startDate, String endDate) {
        Map<String, Object> result = new HashMap<>();

        Outfit outfit = getOutfitById(outfitId);
        if (outfit == null) {
            result.put("available", false);
            result.put("message", "Outfit not found");
            return result;
        }

        // Simple availability check
        // In a real system, you'd check against bookings table
        boolean isAvailable = outfit.isInStock();

        result.put("available", isAvailable);
        result.put("outfitId", outfitId);
        result.put("outfitName", outfit.getName());
        result.put("startDate", startDate);
        result.put("endDate", endDate);
        result.put("pricePerDay", outfit.getPricePerDay());

        if (isAvailable) {
            result.put("message", "This outfit is available for your selected dates");
        } else {
            result.put("message", "Sorry, this outfit is not available for the selected dates");
        }

        return result;
    }

    /**
     * Search outfits by name or description
     */
    public List<Outfit> searchOutfits(String query) {
        return outfitRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query);
    }
}