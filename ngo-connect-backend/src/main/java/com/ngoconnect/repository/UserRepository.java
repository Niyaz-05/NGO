package com.ngoconnect.repository;

import com.ngoconnect.entity.User;
import com.ngoconnect.entity.UserType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    List<User> findByUserType(UserType userType);
    
    List<User> findByEmailVerified(Boolean emailVerified);
    
    List<User> findByUserTypeAndEmailVerified(UserType userType, Boolean emailVerified);
}
