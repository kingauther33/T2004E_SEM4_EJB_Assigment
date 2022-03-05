package com.example.backend.repository;

import com.example.backend.entity.Account;
import com.example.backend.entity.Loan;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoanRepository extends JpaRepository<Loan, Integer> {
    Loan findFirstByAccount(Account account);
}
