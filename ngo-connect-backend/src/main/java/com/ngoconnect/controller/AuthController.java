package com.ngoconnect.controller;

import com.ngoconnect.dto.JwtResponse;
import com.ngoconnect.dto.LoginRequest;
import com.ngoconnect.dto.RegisterRequest;
import com.ngoconnect.dto.NGODTO;
import com.ngoconnect.entity.User;
import com.ngoconnect.service.UserService;
import com.ngoconnect.util.JwtUtil;
import com.ngoconnect.repository.NGORepository;
import com.ngoconnect.entity.NGO;
import com.ngoconnect.entity.UserType;
import java.util.Optional;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            User user = userService.registerUser(registerRequest);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "User registered successfully! Please check your email for verification.");
            response.put("userId", user.getId());
            response.put("email", user.getEmail());

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @Autowired
    private NGORepository ngoRepository;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserDetails principal = (UserDetails) authentication.getPrincipal();
            String jwt = jwtUtil.generateToken(principal);

            User user = (User) principal;

            // Create response with user data
            Map<String, Object> response = new HashMap<>();
            response.put("token", jwt);
            response.put("id", user.getId());
            response.put("email", user.getEmail());
            response.put("fullName", user.getFullName());
            response.put("userType", user.getUserType().name());
            response.put("role", user.getUserType().name()); // Add explicit role field

            // Add organization name if available
            if (user.getOrganizationName() != null) {
                response.put("organizationName", user.getOrganizationName());
            }

            // If user is an NGO, include NGO profile data
            if (user.getUserType() == UserType.NGO) {
                Optional<NGO> ngo = ngoRepository.findByEmail(user.getEmail());
                ngo.ifPresent(ngoProfile -> response.put("ngoProfile", NGODTO.fromEntity(ngoProfile)));
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid email or password");
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Email verification disabled

    @GetMapping("/user-profile")
    public ResponseEntity<?> getUserProfile(Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();

            Map<String, Object> profile = new HashMap<>();
            profile.put("id", user.getId());
            profile.put("fullName", user.getFullName());
            profile.put("email", user.getEmail());
            profile.put("phone", user.getPhone());
            profile.put("address", user.getAddress());
            profile.put("userType", user.getUserType());
            profile.put("emailVerified", user.getEmailVerified());
            profile.put("createdAt", user.getCreatedAt());

            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Unable to fetch user profile");
            return ResponseEntity.badRequest().body(error);
        }
    }
}
