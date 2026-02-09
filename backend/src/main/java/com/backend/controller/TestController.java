package com.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/")
    public String home() {
        return "Backend API is running!";
    }

    @GetMapping("/api/status")
    public String status() {
        return "API Status: OK";
    }
}