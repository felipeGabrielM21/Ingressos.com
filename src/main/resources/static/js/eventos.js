// Variáveis globais
let currentEvent = null;
const baseUrl = 'http://localhost:8080/api/eventos';
const ticketPrice = 50;

// Mapeamento manual dos nomes das imagens
const imageMappings = {
    'Fluminense x Fortaleza': 'flu_for',
    'Ceará x Red Bull Bragantino': 'cea_red',
    'Vitória x Juventude': 'vit_juv',
    'Sport x São Paulo': 'spt_spl',
    'Corinthians x Bahia': 'cor_bah',
    'Santos x Vasco da Gama': 'sant_vas',
    'Atlético-MG x Grêmio': 'atl_gre',
    'Internacional x Flamengo': 'int_fla',
    'Botafogo x Palmeiras': 'bot_pal'
};

// Dados mockados para fallback
const mockEvents = [
    {
        id: 1,
        nome: 'Fluminense x Fortaleza',
        descricao: 'Jogo do Campeonato Brasileiro Série A',
        data: '2025-05-15T19:00:00'
    },
    {
        id: 2,
        nome: 'Corinthians x Bahia',
        descricao: 'Jogo do Campeonato Brasileiro Série A',
        data: '2025-05-16T20:00:00'
    },
    {
        id: 3,
        nome: 'Santos x Vasco da Gama',
        descricao: 'Jogo do Campeonato Brasileiro Série A',
        data: '2025-05-17T16:00:00'
    },
    {
        id: 4,
        nome: 'Atlético-MG x Grêmio',
        descricao: 'Jogo do Campeonato Brasileiro Série A',
        data: '2025-05-18T18:00:00'
    }
];

// FUNÇÕES DA PÁGINA DE EVENTOS
function updateTotalPrice() {
    const quantity = parseInt(document.getElementById('ticketQuantity').value);
    const total = quantity * ticketPrice;
    document.getElementById('totalPrice').value = `R$ ${total.toFixed(2)}`;
}

function showNotification(message, type) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';

    setTimeout(() => {
        notification.style.display = 'none';
    }, 5000);
}

function handleImageError(imgElement, eventName) {
    console.error('Erro ao carregar imagem:', imgElement.src);
    imgElement.style.display = 'none';

    const fallbackDiv = document.createElement('div');
    fallbackDiv.className = 'fallback-text';
    fallbackDiv.textContent = getInitials(eventName);

    imgElement.parentElement.appendChild(fallbackDiv);
}

function getInitials(name) {
    if (!name) return 'EV';
    return name.split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
}

function escapeString(str) {
    if (!str) return '';
    return str.replace(/'/g, "\\'")
             .replace(/"/g, '\\"')
             .replace(/\n/g, '\\n')
             .replace(/\r/g, '\\r');
}

function openBuyModal(eventId, eventName) {
    currentEvent = { id: eventId, name: eventName };
    const modal = document.getElementById('buyModal');

    document.getElementById('eventId').value = eventId;
    document.getElementById('eventName').value = eventName;
    document.getElementById('ticketQuantity').value = 1;
    updateTotalPrice();

    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('buyModal').style.display = 'none';
    currentEvent = null;
}

// FUNÇÃO DE REDIRECIONAMENTO PARA COMPRA
function redirectToCheckout() {
    const eventId = document.getElementById('eventId').value;
    const quantity = parseInt(document.getElementById('ticketQuantity').value);
    const eventName = document.getElementById('eventName').value;
    const totalPrice = quantity * ticketPrice;

    try {
        showNotification(`Processando compra de ${quantity} ingresso(s) para ${eventName}...`, 'success');

        // Redirecionar para a página de finalização com os parâmetros na URL
        window.location.href = `/api/compra?eventoId=${eventId}&quantidade=${quantity}&eventoNome=${encodeURIComponent(eventName)}&valorTotal=${totalPrice}`;

    } catch (error) {
        showNotification('Erro ao processar compra: ' + error.message, 'error');
    }
}

// FUNÇÃO PARA LISTAR MEUS INGRESSOS
async function meusIngressos() {
    try {
        showNotification('Carregando seus ingressos...', 'info');

        const response = await fetch('http://localhost:8080/api/compra/minhas-compras', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include' // Importante: envia os cookies de autenticação
        });

        console.log('Status da resposta:', response.status);

        if (!response.ok) {
            if (response.status === 401) {
                showNotification('Sessão expirada. Faça login novamente.', 'error');
                window.location.href = '/login';
                return;
            }

            const errorText = await response.text();
            console.error('Erro detalhado:', errorText);
            throw new Error(`Erro HTTP: ${response.status} - ${errorText}`);
        }

        const compras = await response.json();
        console.log('Compras recebidas:', compras);

        const eventsGrid = document.getElementById("eventsGrid");
        eventsGrid.innerHTML = "";

        if (!compras || compras.length === 0) {
            eventsGrid.innerHTML = `
                <div class="event-card">
                    <div class="event-content">
                        <h3 class="event-title">Nenhum ingresso encontrado</h3>
                        <p class="event-description">Você ainda não comprou ingressos.</p>
                        <p class="event-description">Compre seu primeiro ingresso nos eventos disponíveis!</p>
                    </div>
                </div>
            `;
            return;
        }

        compras.forEach(compra => {
            const card = document.createElement("div");
            card.className = "event-card";

            // Formata a data da compra
            let dataCompraFormatada = 'Data não disponível';
            if (compra.dataCompra) {
                try {
                    const data = new Date(compra.dataCompra);
                    dataCompraFormatada = data.toLocaleDateString('pt-BR') + ' ' + data.toLocaleTimeString('pt-BR');
                } catch (e) {
                    console.error('Erro ao formatar data:', e);
                }
            }

            card.innerHTML = `
                <div class="event-content">
                    <h3 class="event-title">${compra.eventoNome || compra.nomeEvento || 'Evento'}</h3>
                    <p class="event-description"><strong>Quantidade:</strong> ${compra.quantidade || 1} ingresso(s)</p>
                    <p class="event-description"><strong>Valor Total:</strong> R$ ${(compra.valorTotal || compra.total || 0).toFixed(2)}</p>
                    <p class="event-description"><strong>Data da Compra:</strong> ${dataCompraFormatada}</p>
                    <p class="event-description"><strong>Status:</strong> ${compra.status || 'PENDENTE'}</p>
                    ${compra.codigoIngresso ? `<p class="event-description"><strong>Código:</strong> ${compra.codigoIngresso}</p>` : ''}
                    ${compra.emailCliente ? `<p class="event-description"><strong>Email:</strong> ${compra.emailCliente}</p>` : ''}
                </div>
            `;
            eventsGrid.appendChild(card);
        });

        showNotification('Ingressos carregados com sucesso!', 'success');

    } catch (error) {
        console.error("Erro ao carregar ingressos:", error);

        // Fallback para dados mockados em caso de erro
        if (error.message.includes('404') || error.message.includes('Not Found')) {
            showNotification('Endpoint não encontrado. Mostrando dados de exemplo.', 'info');
            mostrarDadosMockados();
        } else {
            showNotification("Erro ao carregar ingressos: " + error.message, "error");
        }
    }
}

// Função fallback com dados mockados
function mostrarDadosMockados() {
    const eventsGrid = document.getElementById("eventsGrid");
    eventsGrid.innerHTML = "";

    const comprasMock = [
        {
            eventoNome: 'Fluminense x Fortaleza',
            quantidade: 2,
            valorTotal: 100,
            dataCompra: '2024-01-15T10:30:00',
            status: 'CONFIRMADO',
            codigoIngresso: 'ING123456',
            emailCliente: 'usuario@exemplo.com'
        },
        {
            eventoNome: 'Corinthians x Bahia',
            quantidade: 1,
            valorTotal: 50,
            dataCompra: '2024-01-16T14:20:00',
            status: 'PENDENTE',
            codigoIngresso: 'ING789012',
            emailCliente: 'usuario@exemplo.com'
        }
    ];

    comprasMock.forEach(compra => {
        const card = document.createElement("div");
        card.className = "event-card";

        const data = new Date(compra.dataCompra);
        const dataFormatada = data.toLocaleDateString('pt-BR') + ' ' + data.toLocaleTimeString('pt-BR');

        card.innerHTML = `
            <div class="event-content">
                <h3 class="event-title">${compra.eventoNome}</h3>
                <p class="event-description"><strong>Quantidade:</strong> ${compra.quantidade} ingresso(s)</p>
                <p class="event-description"><strong>Valor Total:</strong> R$ ${compra.valorTotal.toFixed(2)}</p>
                <p class="event-description"><strong>Data da Compra:</strong> ${dataFormatada}</p>
                <p class="event-description"><strong>Status:</strong> ${compra.status}</p>
                <p class="event-description"><strong>Código:</strong> ${compra.codigoIngresso}</p>
                <p class="event-description"><strong>Email:</strong> ${compra.emailCliente}</p>
                <p class="event-description" style="color: orange; font-style: italic;">
                    ⚠️ Dados de exemplo - API em desenvolvimento
                </p>
            </div>
        `;
        eventsGrid.appendChild(card);
    });
}

// CARREGAMENTO DE EVENTOS
async function loadEvents() {
    try {
        document.getElementById('eventsGrid').innerHTML = '<div class="loading">Carregando eventos...</div>';

        console.log('Tentando conectar com a API em:', baseUrl);

        const response = await fetch(baseUrl, {
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include' // Alterado para 'include' para enviar cookies
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status} ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const textResponse = await response.text();
            console.warn('A API retornou HTML em vez de JSON. Usando dados mockados.', textResponse.substring(0, 200));
            renderEvents(mockEvents);
            showNotification('Usando dados de exemplo. A API pode estar indisponível.', 'info');
            return;
        }

        const events = await response.json();
        console.log('Eventos recebidos da API:', events);
        renderEvents(events);

    } catch (error) {
        console.error('Erro ao carregar eventos:', error);
        console.log('Usando dados mockados devido ao erro na API');
        renderEvents(mockEvents);
        showNotification('Erro ao conectar com a API. Mostrando eventos de exemplo.', 'error');
    }
}

function renderEvents(events) {
    const eventsGrid = document.getElementById('eventsGrid');
    eventsGrid.innerHTML = '';

    if (!events || events.length === 0) {
        eventsGrid.innerHTML = `
            <div class="event-card">
                <div class="event-content">
                    <h3 class="event-title">Nenhum evento disponível</h3>
                    <p class="event-description">Volte em breve para conferir nossa programação.</p>
                </div>
            </div>
        `;
        return;
    }

    events.forEach(event => {
        const eventCard = document.createElement('div');
        eventCard.className = 'event-card';

        let eventDate;
        try {
            eventDate = event.data ? new Date(event.data) : new Date(Date.now() + 86400000);
        } catch (e) {
            console.error('Erro ao parsear data:', event.data, e);
            eventDate = new Date(Date.now() + 86400000);
        }

        const formattedDate = eventDate.toLocaleDateString('pt-BR') + ' ' +
                             eventDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        const imageName = imageMappings[event.nome] || '';
        const hasImage = imageName !== '';

        let imageHtml = '';
        if (hasImage) {
            imageHtml = `<img src="assets/${imageName}.png" alt="${event.nome}" onerror="handleImageError(this, '${escapeString(event.nome)}')">`;
        } else {
            const initials = getInitials(event.nome);
            imageHtml = `<div class="fallback-text">${initials}</div>`;
        }

        eventCard.innerHTML = `
            <div class="event-image">
                ${imageHtml}
            </div>
            <div class="event-content">
                <h3 class="event-title">${event.nome || 'Evento sem nome'}</h3>
                <p class="event-description">${event.descricao || 'Descrição não disponível'}</p>
                <div class="event-details">
                    <span class="event-date">${formattedDate}</span>
                    <span class="event-price">R$ ${ticketPrice.toFixed(2)}</span>
                </div>
                <div class="event-actions">
                    <button class="buy-btn" onclick="openBuyModal(${event.id}, '${escapeString(event.nome || 'Evento')}')">Comprar Ingresso</button>
                </div>
            </div>
        `;

        eventsGrid.appendChild(eventCard);
    });
}

// EVENT LISTENERS
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('buyForm').addEventListener('submit', function(e) {
        e.preventDefault();
        redirectToCheckout();
    });

    document.getElementById('ticketQuantity').addEventListener('change', updateTotalPrice);
    loadEvents();
});

// Fechar modal se clicar fora dele
window.onclick = function(event) {
    const modal = document.getElementById('buyModal');
    if (event.target === modal) {
        closeModal();
    }
};