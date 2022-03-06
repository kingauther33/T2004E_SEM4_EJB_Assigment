package com.example.backend.entity;

import com.example.backend.entity.Account;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "logs")
public class Log {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private double amount;
    private String type; // TRANSACTION or LOAN

    @CreationTimestamp
    private Date createdAt;
    @UpdateTimestamp
    private Date updatedAt;

    @Column(name = "senderId", insertable = false, updatable = false)
    private Integer senderId;

    @ManyToOne
    @JoinColumn(name = "senderId", referencedColumnName = "id", nullable = false)
    @JsonBackReference
    private Account senderAccountLog;

    @Column(name = "receiverId", insertable = false, updatable = false)
    private Integer receiverId;

    @ManyToOne
    @JoinColumn(name = "receiverId", referencedColumnName = "id")
    @JsonBackReference
    private Account receiverAccountLog;
}
