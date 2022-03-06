package com.example.backend.repository;

import com.example.backend.entity.Account;
import com.example.backend.entity.Log;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface LogRepository extends JpaRepository<Log, Integer> {
    @Query("select l from Log l where l.receiverAccountLog = ?1 or  l.senderAccountLog = ?1")
    List<Log> findAllBySenderAccountLogOrReceiverAccountLog(Account account);
}
