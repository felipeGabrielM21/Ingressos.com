package com.compras.ingressos.Dto.cadastro;

import java.time.LocalDate;

public record DadosParaAtualizar(
         String nome,
         LocalDate dataNascimento,
         Endereco endereco,
         String email,
         String senha) {
}
