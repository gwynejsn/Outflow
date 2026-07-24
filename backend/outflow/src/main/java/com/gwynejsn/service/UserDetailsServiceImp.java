package com.gwynejsn.service;

import com.gwynejsn.dao.UserDao;
import com.gwynejsn.exception.NotFoundException;
import com.gwynejsn.model.User;
import com.gwynejsn.model.UserDecorator;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImp implements UserDetailsService {
    private final UserDao userDao;

    public UserDetailsServiceImp(UserDao userDao) {
        this.userDao = userDao;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws NotFoundException {
        User user = userDao.findByEmail(email);
        if (user == null) {
            throw new NotFoundException("User with email " + email + " does not exist");
        }
        return new UserDecorator(user);
    }

}