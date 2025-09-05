package com.compras.ingressos.repository;

import com.compras.ingressos.model.Compra;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.data.repository.query.Param;
import reactor.core.publisher.Flux;

import java.time.LocalDateTime;

public interface CompraRepository extends R2dbcRepository<Compra, Long> {

    Flux<Compra> findByStatusAndDataExpiracaoBefore(String status, LocalDateTime dataExpiracao);

    @Query("SELECT * FROM compras WHERE status = 'PENDENTE' AND data_expiracao < :agora")
    Flux<Compra> findComprasExpiradas(@Param("agora") LocalDateTime agora);

    Flux<Compra> findByCadastroId(Long cadastroId);
    Flux<Compra> findByEmailCliente(String emailCliente);


}
