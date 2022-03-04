package com.example.backend.api;

import com.example.backend.dto.AccountDto;
import com.example.backend.entity.Account;
import com.example.backend.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/accounts")
public class AccountApi {

    @Autowired
    private AccountService accountService;

    @RequestMapping(path = "register", method = RequestMethod.POST)
    public Account register(@RequestBody AccountDto accountDto) {
        return accountService.create(accountDto);
    }

    @RequestMapping(path = "get", method = RequestMethod.GET)
    public List<Account> findAll() {
        return accountService.findAll();
    }
}
