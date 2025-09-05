package com.compras.ingressos.Dto.cadastro;

public record Endereco(
        String cep,
        String rua,
        String numero,
        String cidade,
        String estado) {
}
