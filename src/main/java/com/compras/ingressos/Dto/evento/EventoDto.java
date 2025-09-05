package com.compras.ingressos.Dto.evento;


import com.compras.ingressos.model.Evento;

import java.time.LocalDate;

public record EventoDto( Long id,
                         TipoEvento tipo,
                         String nome,
                         LocalDate data,
                         String descricao,
                         String urlImagem) {

    public static EventoDto toDto(Evento evento) {
        return new EventoDto(evento.getId(), evento.getTipo(), evento.getNome(), evento.getData(), evento.getDescricao(), evento.getUrlImagem());
    }

    public Evento ToEntity() {
        Evento evento =  new Evento();
        evento.setId(this.id);
        evento.setNome(this.nome);
        evento.setTipo(this.tipo);
        evento.setData(this.data);
        evento.setDescricao(this.descricao);
        evento.setUrlImagem(this.urlImagem);
        return evento;
    }

}