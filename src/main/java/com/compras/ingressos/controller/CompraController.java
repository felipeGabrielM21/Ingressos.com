package com.compras.ingressos.controller;

import com.compras.ingressos.Dto.compra.CompraDTO;
import com.compras.ingressos.service.CompraService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Sinks;

import java.security.Principal;

@RestController
@RequestMapping("/api/compra")
public class CompraController {

    private final CompraService service;
    private final Sinks.Many<CompraDTO> compraSink = Sinks.many().multicast().onBackpressureBuffer();

    public CompraController(CompraService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<CompraDTO> cadastrar(@RequestBody CompraDTO dados) {
        return service.cadastrar(dados)
                .map(CompraDTO::toDto)
                .doOnSuccess(compraDto -> compraSink.tryEmitNext(compraDto));
    }

    @GetMapping("/minhas-compras")
    public Flux<CompraDTO> listarMinhasCompras(Principal principal) {
        String emailUsuario = principal.getName(); // Isso pega o email do usuário logado
        return service.listarComprasPorUsuarioEmail(emailUsuario)
                .map(CompraDTO::toDto);
    }

    @GetMapping("/{id}")
    public Mono<CompraDTO> listar(@PathVariable Long id) {
        return service.listar(id)
                .map(CompraDTO::toDto);
    }
}