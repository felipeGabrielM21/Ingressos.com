package com.compras.ingressos.repository;


import com.compras.ingressos.Dto.evento.TipoEvento;
import com.compras.ingressos.model.Evento;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;

public interface EventosRepository extends ReactiveCrudRepository<Evento, Long> {
    Flux<Evento> findByTipo(TipoEvento tipoEvento);
}