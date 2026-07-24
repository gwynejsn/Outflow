package com.gwynejsn.service;

import com.gwynejsn.dao.UserDao;
import com.gwynejsn.exception.AlreadyExistException;
import com.gwynejsn.exception.NotFoundException;
import com.gwynejsn.model.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class UserService {
    private UserDao userDao;
    private PasswordEncoder passwordEncoder;

    public UserService(UserDao userDao, PasswordEncoder passwordEncoder) {
        this.userDao = userDao;
        this.passwordEncoder = passwordEncoder;
    }

    public User findByEmail(String email) {
        User u = userDao.findByEmail(email);
        if (u == null) throw new NotFoundException("User with email " + email + " does not exist");
        return u;
    }

    public User findById(UUID id) {
        return userDao.findById(id)
                .orElseThrow(() -> new NotFoundException("User with id " + id + " does not exist"));
    }

    public List<User> getAllUsers() {
        return userDao.findAll();
    }

    @Transactional
    public User saveUser(User user) {
        if (user.getId() != null && userDao.existsById(user.getId())) {
            throw new AlreadyExistException("User with id " + user.getId() + " already exists");
        } else if (userDao.existsByEmail(user.getEmail())) {
            throw new AlreadyExistException("User with email " + user.getEmail() + " already exists");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userDao.save(user);
    }

    @Transactional
    public User updateUser(UUID id, User updatedFields, String newPlaintextPassword) {
        if (!userDao.existsById(id)) {
            throw new NotFoundException("Cannot update. User with id " + id + " does not exist");
        }
        if (newPlaintextPassword != null && !newPlaintextPassword.isBlank()) {
            updatedFields.setPassword(passwordEncoder.encode(newPlaintextPassword));
        }
        return userDao.save(updatedFields);
    }

    @Transactional
    public void deleteUser(UUID id) {
        if (!userDao.existsById(id)) {
            throw new NotFoundException("Cannot delete. User with id " + id + " does not exist");
        }
        userDao.deleteById(id);
    }
}
