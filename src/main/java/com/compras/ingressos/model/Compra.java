package com.compras.ingressos.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;
import org.springframework.data.annotation.Transient;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Table("compras")
public class Compra {

    @Id
    private Long id;

    @Column("quantidade_ingressos")
    private Integer quantidadeIngressos;

    @Column("forma_de_pagamento")
    private String formaDePagamento;

    @Column("valor_total")
    private BigDecimal valorTotal;

    @Column("data_compra")
    private LocalDateTime dataCompra;

    @Column("data_expiracao")
    private LocalDateTime dataExpiracao;

    @Column("nome_cliente")
    private String nomeCliente;

    @Column("email_cliente")
    private String emailCliente;

    @Column("status")
    private String status = "PENDENTE";

    @Column("codigo_transacao")
    private String codigoTransacao;

    @Column("evento_id")
    private Long eventoId;

    @Column("user_id")
    private Long cadastroId;

    // Campos não persistidos, só para exibição
    @Transient
    private Evento evento;

    @Transient
    private Cadastro cadastro;

    // Construtores
    public Compra() {
        this.dataCompra = LocalDateTime.now();
        this.dataExpiracao = LocalDateTime.now().plusMinutes(20); // expira em 20 minutos
    }

    // Compra com usuário cadastrado
    public Compra(Integer quantidadeIngressos, String formaDePagamento,
                  BigDecimal valorTotal, Evento evento, Cadastro cadastro) {
        this();
        this.quantidadeIngressos = quantidadeIngressos;
        this.formaDePagamento = formaDePagamento;
        this.valorTotal = valorTotal;
        this.evento = evento;
        this.cadastro = cadastro;
        this.nomeCliente = cadastro.getNome();
        this.emailCliente = cadastro.getEmail();
        this.eventoId = evento.getId();
        this.cadastroId = cadastro.getId();
    }

    // Compra como convidado
    public Compra(Integer quantidadeIngressos, String formaDePagamento,
                  BigDecimal valorTotal, Evento evento, String nomeCliente, String emailCliente) {
        this();
        this.quantidadeIngressos = quantidadeIngressos;
        this.formaDePagamento = formaDePagamento;
        this.valorTotal = valorTotal;
        this.evento = evento;
        this.nomeCliente = nomeCliente;
        this.emailCliente = emailCliente;
        this.eventoId = evento.getId();
    }

    // Verifica se a compra está expirada
    @Transient
    public boolean isExpirada() {
        return LocalDateTime.now().isAfter(dataExpiracao) && "PENDENTE".equals(status);
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getQuantidadeIngressos() { return quantidadeIngressos; }
    public void setQuantidadeIngressos(Integer quantidadeIngressos) { this.quantidadeIngressos = quantidadeIngressos; }

    public String getFormaDePagamento() { return formaDePagamento; }
    public void setFormaDePagamento(String formaDePagamento) { this.formaDePagamento = formaDePagamento; }

    public BigDecimal getValorTotal() { return valorTotal; }
    public void setValorTotal(BigDecimal valorTotal) { this.valorTotal = valorTotal; }

    public LocalDateTime getDataCompra() { return dataCompra; }
    public void setDataCompra(LocalDateTime dataCompra) { this.dataCompra = dataCompra; }

    public LocalDateTime getDataExpiracao() { return dataExpiracao; }
    public void setDataExpiracao(LocalDateTime dataExpiracao) { this.dataExpiracao = dataExpiracao; }

    public String getNomeCliente() { return nomeCliente; }
    public void setNomeCliente(String nomeCliente) { this.nomeCliente = nomeCliente; }

    public String getEmailCliente() { return emailCliente; }
    public void setEmailCliente(String emailCliente) { this.emailCliente = emailCliente; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCodigoTransacao() { return codigoTransacao; }
    public void setCodigoTransacao(String codigoTransacao) { this.codigoTransacao = codigoTransacao; }

    public Evento getEvento() { return evento; }
    public void setEvento(Evento evento) { this.evento = evento; }

    public Cadastro getCadastro() { return cadastro; }
    public void setCadastro(Cadastro cadastro) { this.cadastro = cadastro; }

    public Long getEventoId() { return eventoId; }
    public void setEventoId(Long eventoId) { this.eventoId = eventoId; }

    public Long getCadastroId() { return cadastroId; }
    public void setCadastroId(Long cadastroId) { this.cadastroId = cadastroId; }
}
