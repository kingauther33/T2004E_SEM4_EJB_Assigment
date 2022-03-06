package com.example.backend.service;

import com.example.backend.entity.Account;
import com.example.backend.entity.Log;
import com.example.backend.repository.AccountRepository;
import com.example.backend.repository.LogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LogService {

    @Autowired
    private LogRepository logRepository;

    @Autowired
    private AccountRepository accountRepository;

    public List<Log> findByUsername(String username) {
        Optional<Account> optionalAccount = accountRepository.findFirstByUsername(username);

        if (!optionalAccount.isPresent()) {
            return null;
        }
        Account account = optionalAccount.get();

        return logRepository.findAllBySenderAccountLogOrReceiverAccountLog(account);
    }
}
