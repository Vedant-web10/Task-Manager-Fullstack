package com.excelr.taskmanager.repository;

import com.excelr.taskmanager.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // This custom method tells Hibernate to generate a "SELECT * FROM users WHERE email = ?" query
    User findByEmail(String email);
}