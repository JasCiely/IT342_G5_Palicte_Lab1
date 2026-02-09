package com.backend.service;

import com.backend.dto.RegisterRequest;
import com.backend.dto.UserResponse;
import com.backend.model.User;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService extends UserDetailsService {
    User registerUser(RegisterRequest registerRequest);

    UserResponse getCurrentUser(String email);

    User getUserByEmail(String email);
}