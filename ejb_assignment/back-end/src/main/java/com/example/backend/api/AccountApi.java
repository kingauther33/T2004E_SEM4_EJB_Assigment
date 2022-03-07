package com.example.backend.api;

import com.example.backend.dto.AccountDto;
import com.example.backend.entity.Account;
import com.example.backend.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@CrossOrigin
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

    @RequestMapping(path = "getByToken", method = RequestMethod.GET)
    public ResponseEntity<Object> getByToken(Principal principal) {
        String username = principal.getName();
        Account account = accountService.findByUserName(username).orElse(null);

        return new ResponseEntity<>(account, HttpStatus.OK);
    }
}
