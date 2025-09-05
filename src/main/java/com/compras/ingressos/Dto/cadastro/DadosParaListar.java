package com.compras.ingressos.Dto.cadastro;

import com.compras.ingressos.model.Cadastro;

import java.time.LocalDate;

public record DadosParaListar(
         Long id,
         String nome,
         LocalDate dataNascimento,
         Endereco endereco,
         String email,
         String senha) {

    public static DadosParaListar toDados(Cadastro dados) {
        Endereco endereco = new Endereco(
                dados.getCep(),
                dados.getRua(),
                dados.getNumero(),
                dados.getCidade(),
                dados.getEstado()
        );
        return new DadosParaListar(
                dados.getId(),
                dados.getNome(),
                dados.getDataNascimento(),
                endereco,
                dados.getEmail(),
                dados.getSenha()
        );
    }

    // Converte DadosParaCadastro (DTO) para Cadastro (entidade)
    public Cadastro toEntity() {
        Cadastro cadastro = new Cadastro();
        cadastro.setNome(this.nome);
        cadastro.setDataNascimento(this.dataNascimento);
        cadastro.setCep(this.endereco().cep());
        cadastro.setRua(this.endereco().rua());
        cadastro.setNumero(this.endereco().numero());
        cadastro.setCidade(this.endereco().cidade());
        cadastro.setEstado(this.endereco().estado());
        cadastro.setEmail(this.email);
        cadastro.setSenha(this.senha);
        return cadastro;
    }
}
