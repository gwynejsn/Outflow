package com.gwynejsn.dao;

import com.gwynejsn.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface UserDao extends JpaRepository<User, UUID> {
    User findByEmail(String email);
    boolean existsByEmail(String email);

    void deleteByEmail(String email);
}
