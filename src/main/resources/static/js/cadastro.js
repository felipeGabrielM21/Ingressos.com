document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("cadastroForm");
    const senhaInput = document.getElementById("senha");
    const confirmarSenhaInput = document.getElementById("confirmarSenha");
    const cepInput = document.getElementById("cep");
    const notification = document.getElementById("notification");

    // Função para mostrar notificação
    function showNotification(message, type) {
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.style.display = 'block';

        setTimeout(() => {
            notification.style.display = 'none';
        }, 5000);
    }

    // Validação de CEP (opcional - pode integrar com ViaCEP)
    cepInput.addEventListener('blur', function() {
        const cep = this.value.replace(/\D/g, '');
        if (cep.length === 8) {
            console.log('CEP válido:', cep);
            // Aqui você pode buscar o endereço automaticamente
            // fetch(`https://viacep.com.br/ws/${cep}/json/`)
        }
    });

    // Envio do formulário
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Validar senhas
        if (senhaInput.value !== confirmarSenhaInput.value) {
            showNotification('As senhas não coincidem!', 'error');
            return;
        }

        if (senhaInput.value.length < 6) {
            showNotification('A senha deve ter pelo menos 6 caracteres', 'error');
            return;
        }

        // Coletar dados do formulário COM ESTRUTURA CORRETA
        const formData = {
            nome: document.getElementById('nome').value,
            dataNascimento: document.getElementById('dataNascimento').value,
            email: document.getElementById('email').value,
            senha: senhaInput.value,
            endereco: {
                cep: cepInput.value,
                rua: document.getElementById('rua').value,
                numero: document.getElementById('numero').value,
                cidade: document.getElementById('cidade').value,
                estado: document.getElementById('estado').value
            }
        };

        console.log('Dados enviados:', JSON.stringify(formData, null, 2));

        try {
            showNotification('Criando conta...', 'info');

            const response = await fetch('/cadastro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const dadosCadastro = await response.json();
                showNotification('Conta criada com sucesso! Redirecionando para login...', 'success');

                // Redirecionar para login após 2 segundos
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);

            } else {
                const errorText = await response.text();
                console.error('Erro do servidor:', errorText);

                try {
                    // Tenta parsear como JSON para ver se é um erro estruturado
                    const errorJson = JSON.parse(errorText);
                    showNotification(`Erro ao criar conta: ${errorJson.message || errorText}`, 'error');
                } catch {
                    // Se não for JSON, mostra o texto puro
                    showNotification(`Erro ao criar conta: ${errorText}`, 'error');
                }
            }

        } catch (error) {
            console.error('Erro de rede:', error);
            showNotification('Erro de conexão. Tente novamente.', 'error');
        }
    });

    // Validação em tempo real das senhas
    confirmarSenhaInput.addEventListener('input', function() {
        if (this.value !== senhaInput.value && this.value !== '') {
            this.style.borderColor = '#e74c3c';
        } else {
            this.style.borderColor = '#ddd';
        }
    });
});