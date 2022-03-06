package com.example.backend.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "accounts")
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
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

    @OneToMany(mappedBy = "accountSender", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JsonManagedReference
    private Set<Transaction> transactionSenderSet = new HashSet<>();

    @OneToMany(mappedBy = "accountReceiver", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JsonManagedReference
    private Set<Transaction> transactionReceiverSet = new HashSet<>();

    @OneToMany(mappedBy = "accountLog", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JsonManagedReference
    private Set<Log> logSet = new HashSet<>();

//    @OneToMany(mappedBy = "account")
//    @JsonManagedReference
//    private Set<Loan> loanSet = new HashSet<>();

    @OneToOne(mappedBy = "account")
    private Loan loan;
}
