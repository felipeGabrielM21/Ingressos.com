package com.compras.ingressos.Dto.cadastro;

import com.compras.ingressos.model.Cadastro;

import java.time.LocalDate;

public record DadosParaAtualizar(
         String nome,
         LocalDate dataNascimento,
         Endereco endereco,
         String email,
         String senha) {

    public Cadastro toEntity() {
        Cadastro cadastro = new Cadastro();
        cadastro.setNome(this.nome);
        cadastro.setDataNascimento(this.dataNascimento);
        cadastro.setEmail(this.email);
        cadastro.setSenha(this.senha);

        //verifica se endereco não é null
        if (this.endereco != null) {
            cadastro.setCep(this.endereco.cep());
            cadastro.setRua(this.endereco.rua());
            cadastro.setNumero(this.endereco.numero());
            cadastro.setCidade(this.endereco.cidade());
            cadastro.setEstado(this.endereco.estado());
        } else {
            cadastro.setCep("");
            cadastro.setRua("");
            cadastro.setNumero("");
            cadastro.setCidade("");
            cadastro.setEstado("");
        }

        return cadastro;
    }
}
