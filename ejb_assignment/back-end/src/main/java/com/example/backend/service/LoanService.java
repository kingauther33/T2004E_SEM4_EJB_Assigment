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
import java.util.List;

@Service
public class LoanService {

    @Autowired
    private LoanRepository loanRepository;

    @Autowired
    private AccountRepository accountRepository;

    public List<Loan> findAll() {
        return loanRepository.findAll();
    }

    public Loan checkApprove(String username) {
        Account account = accountRepository.findFirstByUsername(username).orElse(null);
        Loan loan = loanRepository.findFirstByAccount(account);

        return loan;
    }

    public Loan approve(int loanId) {
        Loan loan = loanRepository.findById(loanId).orElse(null);
        if (loan == null) {
            return null;
        }

        loan.setStatus("APPROVED");
        Account account = loan.getAccount();
        account.setBalance(account.getBalance() + loan.getAmount());

        return loanRepository.save(loan);
    }

    public double calculate(String username) {
        Account account = accountRepository.findFirstByUsername(username).orElse(null);
        Loan existedLoan = loanRepository.findFirstByAccount(account);

        double amount = existedLoan.getAmount();
        double tenure = existedLoan.getTenure();
        double rate = existedLoan.getRate() / (100 * 12);
        double exponential = Math.pow((1 + rate), tenure);
        double amountPerMonth = amount * (rate * exponential / (exponential - 1));

        return amountPerMonth;
    }

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
        loan.setStatus("PROCESSING");
        loan.setApprovedDate(approvedDate);
        loan.setAccount(account);

        return loanRepository.save(loan);
    }
}
