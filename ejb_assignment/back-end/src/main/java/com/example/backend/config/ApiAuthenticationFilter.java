package com.example.backend.config;

import com.auth0.jwt.JWT;
import com.example.backend.dto.AccountDto;
import com.example.backend.entity.Account;
import com.example.backend.repository.AccountRepository;
import com.example.backend.service.AccountService;
import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.stereotype.Component;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Optional;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

public class ApiAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;

    @Autowired
    private AccountService accountService;

    public ApiAuthenticationFilter(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    static Logger LOGGER = Logger.getLogger(ApiAuthorizationFilter.class.getName());

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        try {
            String jsonData = request.getReader().lines().collect(Collectors.joining());
            Gson gson = new Gson();
            // xu li login
            AccountDto accountDto = gson.fromJson(jsonData, AccountDto.class);
            UsernamePasswordAuthenticationToken userToken
                    = new UsernamePasswordAuthenticationToken(accountDto.getUsername(), accountDto.getPassword());

            return authenticationManager.authenticate(userToken);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return null;
    }

    // login thành công => trả về access_token
    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authResult) throws IOException, ServletException {
        User user = (User) authResult.getPrincipal();
        Calendar currentTime = Calendar.getInstance();
        currentTime.add(Calendar.DATE, 7);
        String userRole = user.getAuthorities().iterator().next().getAuthority();
        String accessToken = JWT.create()
                .withSubject(user.getUsername())
                .withExpiresAt(currentTime.getTime())
                .withIssuer("t2004e_asm")
                .withClaim("role", userRole)
                .sign(SecurityBean.algorithm());
        LOGGER.log(Level.WARNING, user.getUsername());

        String username = user.getUsername().toString();

        Optional<Account> optionalAccount = accountService.findByUserName(username);
        if (!optionalAccount.isPresent()) {
            response.getWriter().println("DOG SHIT");
        }

        Account account = optionalAccount.get();

        HashMap<String, String> map = new HashMap<>();
        map.put("access_token", accessToken);
        map.put("username", account.getUsername());
        map.put("first_name", account.getFirstName());
        map.put("last_name", account.getLastName());
        map.put("email", account.getLastName());
        map.put("role", userRole);
        response.setContentType("application/json");
        response.getWriter().println(new Gson().toJson(map));
    }
}
