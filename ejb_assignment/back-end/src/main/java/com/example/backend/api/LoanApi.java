package com.example.backend.api;

import com.example.backend.dto.LoanDto;
import com.example.backend.entity.Account;
import com.example.backend.entity.Loan;
import com.example.backend.service.AccountService;
import com.example.backend.service.LoanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("api/v1/loans")
public class LoanApi {

    @Autowired
    private LoanService loanService;

    // đầu API cho admin
    @RequestMapping(path = "find_all", method = RequestMethod.GET)
    public ResponseEntity<Object> findAll() {
        List<Loan> loanList = loanService.findAll();

        return new ResponseEntity<>(loanList, HttpStatus.OK);
    }

    @RequestMapping(path = "approve/{id}", method = RequestMethod.POST)
    public ResponseEntity<Object> approve(@PathVariable int id) {
        Loan loan = loanService.approve(id);

        if (loan == null) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(loan, HttpStatus.OK);
    }

    // API cho user
    @RequestMapping(path = "check_approve", method = RequestMethod.POST)
    public ResponseEntity<Object> checkApprove(Principal principal) {
        Loan loan = loanService.checkApprove(principal.getName());

        if (loan == null) {
            return new ResponseEntity<>("Cannot find any loan", HttpStatus.NOT_FOUND);
        }

        if (loan.getStatus().equals("PROCESSING")) {
            return new ResponseEntity<>(loan.getApprovedDate(), HttpStatus.PROCESSING);
        }

        return new ResponseEntity<>(loan, HttpStatus.OK);
    }

    @RequestMapping(path = "", method = RequestMethod.POST)
    public ResponseEntity<Object> create(@RequestBody LoanDto loanDto) {
        Loan loan = loanService.create(loanDto);

        return new ResponseEntity<>(loan.getApprovedDate(), HttpStatus.OK);
    }

    @RequestMapping(path = "calculate", method = RequestMethod.POST)
    public ResponseEntity<Object> calculate(Principal principal) {
        double amountPerMonth = loanService.calculate(principal.getName());

        return new ResponseEntity<>(amountPerMonth, HttpStatus.OK);
    }
}
