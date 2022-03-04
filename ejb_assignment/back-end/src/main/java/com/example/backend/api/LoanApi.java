package com.example.backend.api;

import com.example.backend.dto.LoanDto;
import com.example.backend.entity.Loan;
import com.example.backend.service.LoanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.Date;
import java.util.HashMap;

@RestController
@RequestMapping("api/v1/loans")
public class LoanApi {

    @Autowired
    private LoanService loanService;

    @RequestMapping(path = "create", method = RequestMethod.POST)
    public ResponseEntity<Object> create(@RequestBody LoanDto loanDto) {
        Loan loan = loanService.create(loanDto);
        HashMap<String, Date> response = new HashMap<>();
        response.put("approvedDate", loan.getApprovedDate());

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @RequestMapping(path = "calculate", method = RequestMethod.POST)
    public ResponseEntity<Object> calculate(Principal principal) {
        return new ResponseEntity<>(principal, HttpStatus.OK);
    }
}
