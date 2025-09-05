document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");

    if (form) {
        form.addEventListener("submit", async (event) => {
            event.preventDefault(); // impede o reload da página

            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();

            if (!username || !password) {
                alert("Por favor, preencha todos os campos!");
                return;
            }

            try {
                // Monta o corpo no formato x-www-form-urlencoded (compatível com Spring Security)
                const formData = new URLSearchParams();
                formData.append("username", username);
                formData.append("password", password);

                const response = await fetch("/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: formData,
                    credentials: "include" // envia cookies de sessão
                });

                if (response.ok) {
                    // Login aceito → redireciona para /eventos
                    window.location.href = "/eventos";
                } else {
                    alert("E-mail ou senha inválidos!");
                }
            } catch (error) {
                console.error("Erro ao conectar com o servidor:", error);
                alert("Erro no servidor, tente novamente mais tarde.");
            }
        });
    }
});
