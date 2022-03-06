package com.example.backend.repository;

import com.example.backend.entity.Account;
import com.example.backend.entity.Log;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LogRepository extends JpaRepository<Log, Integer> {
    List<Log> findAllByAccountLog(Account account);
}
