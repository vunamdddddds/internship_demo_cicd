package com.example.InternShip.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.InternShip.entity.User;
import com.example.InternShip.exception.ErrorCode;
import com.example.InternShip.repository.UserRepository;
import com.example.InternShip.service.AdminService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void unBanUser(int id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(ErrorCode.USER_NOT_EXISTED.getMessage()));
        user.setActive(true);
        userRepository.save(user);
    }

    @Override
    public void banUser(int id) {
       User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(ErrorCode.USER_NOT_EXISTED.getMessage()));
        user.setActive(false);
        userRepository.save(user);
    }

}
