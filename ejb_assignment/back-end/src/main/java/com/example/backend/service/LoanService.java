package com.example.backend.service;

import com.example.backend.dto.LoanDto;
import com.example.backend.entity.Account;
import com.example.backend.entity.Loan;
import com.example.backend.repository.AccountRepository;
import com.example.backend.repository.LoanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.Date;

@Service
public class LoanService {

    @Autowired
    private LoanRepository loanRepository;

    @Autowired
    private AccountRepository accountRepository;

    public Loan create(LoanDto loanDto) {
        // lấy approvedDate = today + 3 days;
        Date approvedDate;
        Calendar currentTime = Calendar.getInstance();
        currentTime.add(Calendar.DATE, 3);
        approvedDate = currentTime.getTime();

        // lấy ra username từ authentication
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentPrincipalName = authentication.getName();

        Account account = accountRepository.findFirstByUsername(currentPrincipalName).orElse(null);

        Loan loan = new Loan();
        loan.setAmount(loanDto.getAmount());
        loan.setRate(loanDto.getRate());
        loan.setTenure(loanDto.getTenure());
        loan.setStatus(1);
        loan.setApprovedDate(approvedDate);
        loan.setAccount(account);

        return loanRepository.save(loan);
    }
}
