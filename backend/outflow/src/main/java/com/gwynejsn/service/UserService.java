package com.gwynejsn.service;

import com.gwynejsn.dao.UserDao;
import com.gwynejsn.dto.UserCreateDto;
import com.gwynejsn.exception.AlreadyExistException;
import com.gwynejsn.model.User;
import com.gwynejsn.model.UserDecorator;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService implements UserDetailsService {

    private final UserDao userDao;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserDao userDao, PasswordEncoder passwordEncoder) {
        this.userDao = userDao;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return new UserDecorator(userDao.findByUsername(username));
    }

    public User saveUser(User user) {
        if (userDao.existsByUsername(user.getUsername())) {
            throw new AlreadyExistException("Username already exists");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userDao.save(user);
    }
}
