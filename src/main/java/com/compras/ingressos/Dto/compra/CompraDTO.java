package com.compras.ingressos.Dto.compra;

import com.compras.ingressos.model.Cadastro;
import com.compras.ingressos.model.Compra;
import com.compras.ingressos.model.Evento;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record CompraDTO(
        Long id,
        Integer quantidadeIngressos,
        String formaDePagamento,
        BigDecimal valorTotal,
        LocalDateTime dataCompra,
        LocalDateTime dataExpiracao,
        String nomeCliente,
        String emailCliente,
        String status,
        String codigoTransacao,
        Long eventoId,      // só o ID
        Long cadastroId) {  // só o ID

    // Converte entidade em DTO
    public static CompraDTO toDto(Compra compra) {
        return new CompraDTO(
                compra.getId(),
                compra.getQuantidadeIngressos(),
                compra.getFormaDePagamento(),
                compra.getValorTotal(),
                compra.getDataCompra(),
                compra.getDataExpiracao(),
                compra.getNomeCliente(),
                compra.getEmailCliente(),
                compra.getStatus(),
                compra.getCodigoTransacao(),
                compra.getEvento() != null ? compra.getEvento().getId() : null,
                compra.getCadastro() != null ? compra.getCadastro().getId() : null
        );
    }

    // Converte DTO em entidade, recebendo as entidades já carregadas
    public Compra toEntity() {
        Compra compra = new Compra();
        compra.setId(this.id);
        compra.setQuantidadeIngressos(this.quantidadeIngressos);
        compra.setFormaDePagamento(this.formaDePagamento);
        compra.setValorTotal(this.valorTotal);
        compra.setDataCompra(this.dataCompra);
        compra.setDataExpiracao(this.dataExpiracao);
        compra.setNomeCliente(this.nomeCliente);
        compra.setEmailCliente(this.emailCliente);
        compra.setStatus(this.status);
        compra.setCodigoTransacao(this.codigoTransacao);
        compra.setEventoId(this.eventoId);
        compra.setCadastroId(this.cadastroId);
        return compra;
    }
}
