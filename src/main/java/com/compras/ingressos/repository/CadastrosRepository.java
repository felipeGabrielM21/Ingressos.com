package com.compras.ingressos.repository;

import com.compras.ingressos.model.Cadastro;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

import java.util.Optional;

@Repository
public interface CadastrosRepository extends R2dbcRepository<Cadastro, Long> {
    Mono<Cadastro> findByEmailIgnoreCase(String email);
}
