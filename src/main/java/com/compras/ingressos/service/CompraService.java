package com.compras.ingressos.service;

import com.compras.ingressos.Dto.compra.CompraDTO;
import com.compras.ingressos.model.Compra;
import com.compras.ingressos.model.Evento;
import com.compras.ingressos.model.Cadastro;
import com.compras.ingressos.repository.CadastrosRepository;
import com.compras.ingressos.repository.CompraRepository;

import com.compras.ingressos.repository.EventosRepository;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Optional;

@Service
public class CompraService {

    private final CompraRepository compraRepository;
    private final EventosRepository eventoRepository;
    private final CadastrosRepository cadastroRepository;

    public CompraService(CompraRepository compraRepository,
                         EventosRepository eventoRepository,
                         CadastrosRepository cadastroRepository) {
        this.compraRepository = compraRepository;
        this.eventoRepository = eventoRepository;
        this.cadastroRepository = cadastroRepository;
    }

    public Mono<Compra> cadastrar(CompraDTO dto) {
        Compra compra = dto.toEntity();

        Mono<Evento> eventoMono = (compra.getEventoId() != null)
                ? eventoRepository.findById(compra.getEventoId())
                : Mono.empty();

        Mono<Cadastro> cadastroMono = (compra.getCadastroId() != null)
                ? cadastroRepository.findById(compra.getCadastroId())
                : Mono.empty();

        return Mono.zip(eventoMono.defaultIfEmpty(new Evento()),
                        cadastroMono.defaultIfEmpty(new Cadastro()))
                .flatMap(tuple -> {
                    Evento evento = tuple.getT1();
                    Cadastro cadastro = tuple.getT2();

                    compra.setEvento(evento.getId() != null ? evento : null);
                    compra.setCadastro(cadastro.getId() != null ? cadastro : null);

                    // Se veio um DTO com nome/email, mantém; senão usa do cadastro
                    if (compra.getNomeCliente() == null && cadastro.getNome() != null) {
                        compra.setNomeCliente(cadastro.getNome());
                    }
                    if (compra.getEmailCliente() == null && cadastro.getEmail() != null) {
                        compra.setEmailCliente(cadastro.getEmail());
                    }

                    // Status padrão
                    if (compra.getStatus() == null) {
                        compra.setStatus("PENDENTE");
                    }

                    // Datas
                    if (compra.getDataCompra() == null) {
                        compra.setDataCompra(java.time.LocalDateTime.now());
                    }
                    if (compra.getDataExpiracao() == null) {
                        compra.setDataExpiracao(java.time.LocalDateTime.now().plusMinutes(20));
                    }

                    return compraRepository.save(compra);
                });
    }

    public Mono<Compra> listar(Long id) {
        return compraRepository.findById(id);
    }

    // NOVO MÉTODO - BUSCAR POR EMAIL
    public Flux<Compra> listarComprasPorUsuarioEmail(String email) {
        return compraRepository.findByEmailCliente(email);
    }

}
