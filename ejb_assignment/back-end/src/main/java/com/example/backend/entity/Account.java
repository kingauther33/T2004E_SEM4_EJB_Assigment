package com.example.backend.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@Data
@Table(name = "accounts")
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String username;
    private String passwordHash;

    // Co the co hoac khong, tam thoi khong dung den
    // 1. User; 2. Admin
    private Integer role;
    private String firstName;
    private String lastName;
    private String email;
    private double balance = 100000;
    private Integer status;

    @CreationTimestamp
    private Date createdAt;
    @UpdateTimestamp
    private Date updatedAt;

    @OneToMany(mappedBy = "accountSender")
    private Set<Transaction> transactionSenderSet = new HashSet<>();

    @OneToMany(mappedBy = "accountReceiver")
    private Set<Transaction> transactionReceiverSet = new HashSet<>();

    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private Set<Loan> loanSet = new HashSet<>();
}
