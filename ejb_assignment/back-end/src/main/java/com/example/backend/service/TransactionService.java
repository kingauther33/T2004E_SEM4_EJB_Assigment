package com.example.backend.service;

import com.example.backend.dto.TransactionDto;
import com.example.backend.entity.Account;
import com.example.backend.entity.Transaction;
import com.example.backend.repository.AccountRepository;
import com.example.backend.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private AccountRepository accountRepository;

    public List<Transaction> findAll() {
        return transactionRepository.findAll();
    }

    public Transaction create(TransactionDto transactionDto) {
        // lấy ra tài khoản gửi
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentPrincipalName = authentication.getName();
        Account senderAccount = accountRepository.findFirstByUsername(currentPrincipalName).orElse(null);

        // lấy ra tài khoản nhận
        Account receiverAccount = accountRepository.findFirstByUsername(transactionDto.getBeneficiaryName()).orElse(null);

        Transaction transaction = new Transaction();
        transaction.setAmount(transactionDto.getAmount());
        transaction.setMessage(transactionDto.getMessage());
        transaction.setStatus(1);
        transaction.setAccountSender(senderAccount);
        transaction.setAccountReceiver(receiverAccount);

        return transactionRepository.save(transaction);
    }
}
