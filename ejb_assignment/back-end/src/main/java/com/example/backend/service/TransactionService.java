package com.example.backend.service;

import com.example.backend.dto.TransactionDto;
import com.example.backend.entity.Account;
import com.example.backend.entity.Log;
import com.example.backend.entity.Transaction;
import com.example.backend.repository.AccountRepository;
import com.example.backend.repository.LogRepository;
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

    @Autowired
    private LogRepository logRepository;

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
        assert receiverAccount != null;

        double transactionAmount = transactionDto.getAmount();
        assert senderAccount != null;
        if (senderAccount.getBalance() < transactionAmount) {
            return null;
        }
        senderAccount.setBalance(senderAccount.getBalance() - transactionAmount);
        receiverAccount.setBalance(receiverAccount.getBalance() + transactionAmount);

        Transaction transaction = new Transaction();
        transaction.setAmount(transactionAmount);
        transaction.setMessage(transactionDto.getMessage());
        transaction.setStatus(1);
        transaction.setAccountSender(senderAccount);
        transaction.setAccountReceiver(receiverAccount);

        // add vao bảng Log để in ra bank statement
        Log log = new Log();
        log.setAmount(transactionAmount);
        log.setType("TRANSACTION");
        log.setSenderAccountLog(senderAccount);
        log.setReceiverAccountLog(receiverAccount);

        logRepository.save(log);
        return transactionRepository.save(transaction);
    }
}
