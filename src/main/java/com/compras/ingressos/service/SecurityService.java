package com.compras.ingressos.service;

import com.compras.ingressos.model.Cadastro;
import com.compras.ingressos.repository.CadastrosRepository;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class SecurityService implements ReactiveUserDetailsService {

    private final CadastrosRepository repository;
    private final PasswordEncoder passwordEncoder;

    public SecurityService(CadastrosRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Mono<UserDetails> findByUsername(String username) {
        return repository.findByEmailIgnoreCase(username)
                .map(user -> User.withUsername(user.getEmail())
                        .password(user.getSenha())
                        .roles("USER")
                        .build());
    }


    public Mono<Cadastro> salvarUsuario(Cadastro login) {
        login.setSenha(passwordEncoder.encode(login.getSenha()));
        return repository.save(login); // R2dbcRepository já retorna Mono<Cadastro>
    }
}
