package com.example.backend.api;

import com.example.backend.entity.Log;
import com.example.backend.service.LogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("api/v1/logs")
public class LogApi {

    @Autowired
    private LogService logService;

    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<Object> findAllLogs(Principal principal) {
        List<Log> logList = logService.findByUsername(principal.getName());

        if (logList.isEmpty()) {
            return new ResponseEntity<>("Couldn't find log", HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(logList, HttpStatus.OK);
    }
}
