package com.example.backend.service;

import com.example.backend.dto.AccountDto;
import com.example.backend.entity.Account;
import com.example.backend.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Account create(AccountDto accountDto) {
        Account account = new Account();
        account.setUsername(accountDto.getUsername());
        account.setPasswordHash(passwordEncoder.encode(accountDto.getPassword()));
        account.setRole(1);
        account.setStatus(1);

        return accountRepository.save(account);
    }

    public Optional<Account> findByUserName(String username) {
        return accountRepository.findFirstByUsername(username);
    }
}
