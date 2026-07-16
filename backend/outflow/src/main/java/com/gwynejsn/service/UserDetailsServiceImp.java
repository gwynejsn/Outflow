package com.gwynejsn.service;

import com.gwynejsn.dao.UserDao;
import com.gwynejsn.exception.AlreadyExistException;
import com.gwynejsn.exception.NotFoundException;
import com.gwynejsn.model.User;
import com.gwynejsn.model.UserDecorator;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserDetailsServiceImp implements UserDetailsService {
    private final UserDao userDao;

    public UserDetailsServiceImp(UserDao userDao) {
        this.userDao = userDao;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws NotFoundException {
        User user = userDao.findByUsername(username);
        if (user == null) {
            throw new NotFoundException("User with username " + username + " does not exist");
        }
        return new UserDecorator(user);
    }

}