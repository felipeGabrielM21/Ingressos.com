// Variáveis globais
let expirationTimer;
let tempoRestante = 20 * 60; // 20 minutos em segundos

// Quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    carregarDadosCompra();
    iniciarTimer();
    configurarEventos();
});

// Carregar dados da compra
function carregarDadosCompra() {
    const urlParams = new URLSearchParams(window.location.search);
    const eventoId = urlParams.get('eventoId');
    const quantidade = urlParams.get('quantidade');

    if (!eventoId || !quantidade) {
        showNotification('Dados da compra incompletos.', 'error');
        return;
    }

    // Simular dados do evento (substitua pela chamada real à API)
    const evento = {
        id: eventoId,
        nome: "Fluminense x Fortaleza",
        data: "2024-08-22T21:00:00",
        local: "Maracanã - Rio de Janeiro",
        url_imagem: "flu_for",
        preco: 50.00
    };

    document.getElementById('eventoId').value = eventoId;
    document.getElementById('quantidadeIngressos').value = quantidade;
    document.getElementById('valorUnitario').value = evento.preco;

    // Atualizar interface
    document.getElementById('eventoNome').textContent = evento.nome;
    document.getElementById('eventoData').textContent = `Data: ${new Date(evento.data).toLocaleString('pt-BR')}`;
    document.getElementById('eventoLocal').textContent = `Local: ${evento.local}`;
    document.getElementById('ingressosSelecionados').textContent = `Ingressos: ${quantidade}`;

    const valorTotal = quantidade * evento.preco;
    document.getElementById('valorTotal').textContent = `Total: R$ ${valorTotal.toFixed(2)}`;

    // Carregar imagem do evento
    carregarImagemEvento(evento.url_imagem, evento.nome);

    // Preencher dados do usuário se estiver logado
    const usuarioLogado = JSON.parse(localStorage.getItem('usuario') || 'null');
    if (usuarioLogado) {
        document.getElementById('nome').value = usuarioLogado.nome || '';
        document.getElementById('email').value = usuarioLogado.email || '';
        document.getElementById('cpf').value = usuarioLogado.cpf || '';
    }
}

// Carregar imagem do evento
function carregarImagemEvento(urlImagem, nomeEvento) {
    const imageContainer = document.getElementById('eventoImage');
    const fallbackText = document.getElementById('eventoIniciais');

    if (urlImagem) {
        const img = document.createElement('img');
        img.src = `/assets/${urlImagem}.png`;
        img.alt = nomeEvento;
        img.onerror = function() {
            this.style.display = 'none';
            fallbackText.textContent = getIniciais(nomeEvento);
            fallbackText.style.display = 'flex';
        };
        imageContainer.appendChild(img);
    } else {
        fallbackText.textContent = getIniciais(nomeEvento);
        fallbackText.style.display = 'flex';
    }
}

// Obter iniciais do nome do evento
function getIniciais(nome) {
    return nome.split(' ').map(word => word[0]).join('').toUpperCase().substring(0, 2);
}

// Iniciar timer de expiração
function iniciarTimer() {
    expirationTimer = setInterval(function() {
        tempoRestante--;

        if (tempoRestante <= 0) {
            clearInterval(expirationTimer);
            expirarCompra();
        } else {
            const minutos = Math.floor(tempoRestante / 60);
            const segundos = tempoRestante % 60;
            document.getElementById('expirationTimer').innerHTML =
                `<span>⏰ Tempo restante: ${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}</span>`;
        }
    }, 1000);
}

// Configurar eventos do formulário
function configurarEventos() {
    // Mostrar/ocultar campos de pagamento
    document.getElementById('formaPagamento').addEventListener('change', function() {
        const formaPagamento = this.value;
        document.querySelectorAll('.payment-fields').forEach(el => el.style.display = 'none');

        if (formaPagamento === 'CARTAO_CREDITO' || formaPagamento === 'CARTAO_DEBITO') {
            document.getElementById('cartaoFields').style.display = 'block';
        } else if (formaPagamento === 'PIX') {
            document.getElementById('pixFields').style.display = 'block';
        } else if (formaPagamento === 'BOLETO') {
            document.getElementById('boletoFields').style.display = 'block';
        }
    });

    // Formatação do CPF
    document.getElementById('cpf').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);

        if (value.length > 9) {
            value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        } else if (value.length > 6) {
            value = value.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3');
        } else if (value.length > 3) {
            value = value.replace(/(\d{3})(\d{3})/, '$1.$2');
        }
        e.target.value = value;
    });

    // Formatação do telefone
    document.getElementById('telefone').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);

        if (value.length > 10) {
            value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (value.length > 6) {
            value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        } else if (value.length > 2) {
            value = value.replace(/(\d{2})(\d{4})/, '($1) $2');
        } else if (value.length > 0) {
            value = value.replace(/(\d{2})/, '($1)');
        }
        e.target.value = value;
    });

    // Formulário de finalização
    document.getElementById('finalizarCompraForm').addEventListener('submit', function(e) {
        e.preventDefault();
        finalizarCompra();
    });
}

// Finalizar compra
async function finalizarCompra() {
    const formData = new FormData(document.getElementById('finalizarCompraForm'));
    const dadosCompra = Object.fromEntries(formData.entries());

    // Montar objeto da compra para enviar ao backend
    const compra = {
        quantidadeIngressos: parseInt(document.getElementById('quantidadeIngressos').value),
        formaDePagamento: dadosCompra.formaPagamento,
        valorTotal: parseFloat(document.getElementById('quantidadeIngressos').value) *
                    parseFloat(document.getElementById('valorUnitario').value),
        nomeCliente: dadosCompra.nome,
        emailCliente: dadosCompra.email,
        eventoId: document.getElementById('eventoId').value,
        cadastroId: localStorage.getItem('usuario')
            ? JSON.parse(localStorage.getItem('usuario')).id
            : null
    };

    try {
        showNotification('Processando pagamento...', 'success');

        const response = await fetch("http://localhost:8080/api/compra", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(compra)
        });

        if (!response.ok) {
            throw new Error("Erro ao salvar compra no servidor");
        }

        const resultado = await response.json();

        clearInterval(expirationTimer);
        mostrarConfirmacao(compra);

    } catch (error) {
        showNotification('Erro ao processar pagamento: ' + error.message, 'error');
    }
}


// Mostrar confirmação de compra
function mostrarConfirmacao(dadosCompra) {
    const quantidade = document.getElementById('quantidadeIngressos').value;
    const valorTotal = quantidade * document.getElementById('valorUnitario').value;

    document.getElementById('modalDetalhes').innerHTML = `
        <strong>${document.getElementById('eventoNome').textContent}</strong><br>
        ${quantidade} ingresso(s) - R$ ${valorTotal.toFixed(2)}<br>
        Forma de pagamento: ${dadosCompra.formaPagamento}
    `;

    document.getElementById('confirmacaoModal').style.display = 'block';
}

// Expirar compra
function expirarCompra() {
    showNotification('Tempo esgotado! Sua reserva foi cancelada.', 'error');
    setTimeout(() => {
        window.location.href = '/eventos';
    }, 3000);
}

// Cancelar compra
function cancelarCompra() {
    if (confirm('Deseja realmente cancelar a compra?')) {
        clearInterval(expirationTimer);
        window.location.href = '/eventos';
    }
}

// Fechar modal
function fecharModal() {
    document.getElementById('confirmacaoModal').style.display = 'none';
}

// Imprimir ingressos
function imprimirIngressos() {
    window.print();
}

// Voltar para eventos
function voltarParaEventos() {
    window.location.href = '/eventos';
}

// Mostrar notificação
function showNotification(message, type) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';

    setTimeout(() => {
        notification.style.display = 'none';
    }, 5000);
}