package com.example.backend.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Data;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "transactions")
@Data
@ToString
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private double amount;
    private String message;
    private Integer status;

    @CreationTimestamp
    private Date createdAt;
    @UpdateTimestamp
    private Date updatedAt;

    @Column(name = "senderId", insertable = false, updatable = false)
    private Integer senderId;

    @Column(name = "receiverId", insertable = false, updatable = false)
    private Integer receiverId;

    @ManyToOne
    @JoinColumn(name="senderId", referencedColumnName = "id", nullable = false)
    @JsonBackReference
    Account accountSender;

    @ManyToOne
    @JoinColumn(name="receiverId", referencedColumnName = "id", nullable = false)
    @JsonBackReference
    Account accountReceiver;

}
