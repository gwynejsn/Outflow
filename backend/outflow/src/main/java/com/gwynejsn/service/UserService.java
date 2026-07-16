package com.gwynejsn.service;

import com.gwynejsn.dao.UserDao;
import com.gwynejsn.exception.AlreadyExistException;
import com.gwynejsn.exception.NotFoundException;
import com.gwynejsn.model.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {
    private UserDao userDao;
    private PasswordEncoder passwordEncoder;

    public UserService(UserDao userDao, PasswordEncoder passwordEncoder) {
        this.userDao = userDao;
        this.passwordEncoder = passwordEncoder;
    }

    public User findByUsername(String username) {
        User u = userDao.findByUsername(username);
        if (u == null) throw new NotFoundException("User with username " + username + " does not exist");
        return u;
    }

    public List<User> getAllUsers() {
        return userDao.findAll();
    }

    @Transactional
    public User saveUser(User user) {
        if (user.getId() != null && userDao.existsById(user.getId())) {
            throw new AlreadyExistException("User with id " + user.getId() + " already exists");
        } else if (userDao.existsByUsername(user.getUsername())) {
            throw new AlreadyExistException("User with username " + user.getUsername() + " already exists");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userDao.save(user);
    }

    @Transactional
    public User updateUser(String username, User updatedFields) {
        if (!userDao.existsByUsername(username)) {
            throw new NotFoundException("Cannot update. User " + username + " does not exist");
        }
        if (updatedFields.getPassword() != null && !updatedFields.getPassword().isBlank()) {
            updatedFields.setPassword(passwordEncoder.encode(updatedFields.getPassword()));
        }
        return userDao.save(updatedFields);
    }

    @Transactional
    public void deleteUser(String username) {
        if (!userDao.existsByUsername(username)) {
            throw new NotFoundException("Cannot delete. User " + username + " does not exist");
        }
        userDao.deleteByUsername(username);
    }
}
