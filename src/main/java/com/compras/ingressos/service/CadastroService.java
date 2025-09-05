package com.compras.ingressos.service;

import com.compras.ingressos.Dto.cadastro.DadosParaCadastro;
import com.compras.ingressos.Dto.cadastro.DadosParaListar;
import com.compras.ingressos.model.Cadastro;
import com.compras.ingressos.repository.CadastrosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;


@Service
public class CadastroService {

    @Autowired
    private final CadastrosRepository repository;
    private final PasswordEncoder passwordEncoder;

    // injeção via construtor para os dois
    public CadastroService(CadastrosRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    public Mono<DadosParaCadastro> cadastrar(DadosParaCadastro dados) {
        Cadastro entidade = dados.toEntity();
        entidade.setSenha(passwordEncoder.encode(entidade.getSenha())); // 🔐 criptografia
        return repository.save(entidade)
                .map(DadosParaCadastro::toDados);
    }


    public Mono<DadosParaListar> listar(Long id) {
        return repository.findById(id)
                .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND)))
                .map(DadosParaListar::toDados);
    }
}
