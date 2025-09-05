package com.compras.ingressos.controller;


import com.compras.ingressos.Dto.cadastro.DadosParaCadastro;
import com.compras.ingressos.Dto.cadastro.DadosParaListar;
import com.compras.ingressos.service.CadastroService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Sinks;

@RestController
@RequestMapping("/cadastro")
public class CadastroController {

    private final CadastroService service;
    private final Sinks.Many<DadosParaCadastro> cadastroSink = Sinks.many().multicast().onBackpressureBuffer();

    public CadastroController(CadastroService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<DadosParaCadastro> cadastrar(@RequestBody DadosParaCadastro dados) {
        return service.cadastrar(dados)
                .doOnSuccess(e -> cadastroSink.tryEmitNext(e));
    }

    @GetMapping("/{id}")
    public Mono<DadosParaListar> listar(@PathVariable Long id) {
        return service.listar(id);
    }
}