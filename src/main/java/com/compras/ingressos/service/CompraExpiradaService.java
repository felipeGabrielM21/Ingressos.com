package com.compras.ingressos.service;

import com.compras.ingressos.model.Compra;
import com.compras.ingressos.repository.CompraRepository;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

import java.time.LocalDateTime;

@Service
public class CompraExpiradaService {

    private final CompraRepository compraRepo;

    public CompraExpiradaService(CompraRepository compraRepo) {
        this.compraRepo = compraRepo;
    }

    // Retorna todas as compras pendentes que já expiraram
    public Flux<Compra> buscarComprasExpiradas() {
        LocalDateTime agora = LocalDateTime.now();
        return compraRepo.findComprasExpiradas(agora)
                .filter(compra -> "PENDENTE".equals(compra.getStatus())); // reforçando que só pega pendentes
    }

    // Atualiza status das compras expiradas para "EXPIRADA"
    public Flux<Compra> atualizarComprasExpiradas() {
        return buscarComprasExpiradas()
                .map(compra -> {
                    compra.setStatus("EXPIRADA");
                    return compra;
                })
                .flatMap(compraRepo::save); // salva cada compra de forma reativa
    }
}
