package com.backend.controller;

import com.backend.dto.LoginRequest;
import com.backend.dto.RegisterRequest;
import com.backend.dto.UserResponse;
import com.backend.model.User;
import com.backend.repository.UserRepository;
import com.backend.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:3000" }, allowCredentials = "true")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final UserService userService;

    public AuthController(UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            UserService userService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        System.out.println("=== REGISTER ENDPOINT CALLED ===");
        System.out.println("Email: " + registerRequest.getEmail());
        System.out.println("First Name: " + registerRequest.getFirstName());
        System.out.println("Last Name: " + registerRequest.getLastName());

        try {
            // Check if email already exists
            if (userRepository.existsByEmail(registerRequest.getEmail())) {
                System.out.println("Email already exists: " + registerRequest.getEmail());
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already registered");
            }

            // Validate password match
            if (!registerRequest.getPassword().equals(registerRequest.getConfirmPassword())) {
                System.out.println("Passwords do not match");
                return ResponseEntity.badRequest().body("Passwords do not match");
            }

            // Validate password length
            if (registerRequest.getPassword().length() < 6) {
                return ResponseEntity.badRequest().body("Password must be at least 6 characters");
            }

            // Create new user
            User user = new User();
            user.setFirstName(registerRequest.getFirstName());
            user.setLastName(registerRequest.getLastName());
            user.setEmail(registerRequest.getEmail());
            user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
            user.setRole("USER");

            User savedUser = userRepository.save(user);
            System.out.println("User registered successfully with ID: " + savedUser.getId());

            return ResponseEntity.ok("Account securely created.");
        } catch (Exception e) {
            System.out.println("Registration error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Registration failed: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpServletRequest request) {
        System.out.println("=== LOGIN ENDPOINT CALLED ===");
        System.out.println("Email: " + loginRequest.getEmail());

        try {
            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()));

            // Set authentication in security context
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Create session and store security context
            HttpSession session = request.getSession(true);
            session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());

            // Get user details
            User user = userService.getUserByEmail(loginRequest.getEmail());

            // Create user response
            UserResponse userResponse = new UserResponse();
            userResponse.setId(user.getId());
            userResponse.setFirstName(user.getFirstName());
            userResponse.setLastName(user.getLastName());
            userResponse.setEmail(user.getEmail());
            userResponse.setRole(user.getRole());
            userResponse.setCreatedAt(user.getCreatedAt());
            userResponse.setUpdatedAt(user.getUpdatedAt());

            // IMPORTANT: Store user in session for /check endpoint
            session.setAttribute("user", userResponse);

            System.out.println("Login successful for: " + user.getEmail());
            System.out.println("Session ID: " + session.getId());

            return ResponseEntity.ok(userResponse);
        } catch (BadCredentialsException e) {
            System.out.println("Invalid credentials for email: " + loginRequest.getEmail());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        } catch (Exception e) {
            System.out.println("Login failed: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Login failed: " + e.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        System.out.println("=== LOGOUT ENDPOINT CALLED ===");

        try {
            // Get current session
            HttpSession session = request.getSession(false);

            if (session != null) {
                System.out.println("Invalidating session: " + session.getId());
                session.invalidate();
            }

            // Clear security context
            SecurityContextHolder.clearContext();

            System.out.println("Logout successful");
            return ResponseEntity.ok("Logged out successfully");
        } catch (Exception e) {
            System.out.println("Logout error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Logout failed: " + e.getMessage());
        }
    }

    @GetMapping("/check")
    public ResponseEntity<?> checkAuth(HttpSession session) {
        System.out.println("=== AUTH CHECK ENDPOINT CALLED ===");

        try {
            // First check session for user data (fastest method)
            Object userData = session.getAttribute("user");

            if (userData != null && userData instanceof UserResponse) {
                System.out.println("✅ User found in session: " + ((UserResponse) userData).getEmail());
                return ResponseEntity.ok(userData);
            }

            // Fallback: Check Spring Security context
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication != null &&
                    authentication.isAuthenticated() &&
                    !authentication.getPrincipal().equals("anonymousUser")) {

                String email = authentication.getName();
                System.out.println("✅ User authenticated via Security Context: " + email);

                User user = userService.getUserByEmail(email);

                UserResponse userResponse = new UserResponse();
                userResponse.setId(user.getId());
                userResponse.setFirstName(user.getFirstName());
                userResponse.setLastName(user.getLastName());
                userResponse.setEmail(user.getEmail());
                userResponse.setRole(user.getRole());
                userResponse.setCreatedAt(user.getCreatedAt());
                userResponse.setUpdatedAt(user.getUpdatedAt());

                // Store in session for next time
                session.setAttribute("user", userResponse);

                return ResponseEntity.ok(userResponse);
            }

            System.out.println("❌ Not authenticated");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");

        } catch (Exception e) {
            System.out.println("❌ Auth check error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
        }
    }

    // Test endpoint
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Backend is running!");
    }

    // Health check endpoint
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("OK");
    }
}