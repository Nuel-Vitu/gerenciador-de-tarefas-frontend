// --- Selecionando os Elementos do DOM ---

// Formulários
const formCadastro = document.querySelector('#form-cadastro');
const formLogin = document.querySelector('#form-login');

// Adicione este bloco ao seu app.js

// --- Lógica para alternar entre os formulários ---

// 1. Selecionar os novos elementos que precisamos controlar
const sectionCadastro = document.querySelector('#section-cadastro');
const sectionLogin = document.querySelector('#section-login');
const linkParaCadastro = document.querySelector('#link-para-cadastro');
const linkParaLogin = document.querySelector('#link-para-login');

// 2. Adicionar um "ouvinte" para o clique no link 'Cadastre-se'
linkParaCadastro.addEventListener('click', (event) => {
    event.preventDefault(); // Impede o link de fazer qualquer coisa
    
    // Esconde o formulário de login adicionando a classe .hidden
    sectionLogin.classList.add('hidden');
    // Mostra o formulário de cadastro removendo a classe .hidden
    sectionCadastro.classList.remove('hidden');
});

// 3. Adicionar um "ouvinte" para o clique no link 'Faça o login'
linkParaLogin.addEventListener('click', (event) => {
    event.preventDefault();
    
    // Esconde o formulário de cadastro
    sectionCadastro.classList.add('hidden');
    // Mostra o formulário de login
    sectionLogin.classList.remove('hidden');
});

// Div de mensagens
const divMensagem = document.querySelector('#mensagem');

// --- Lógica de Cadastro ---

// Adiciona um "ouvinte" de evento para o envio (submit) do formulário de cadastro
formCadastro.addEventListener('submit', async (event) => {
    // Impede o comportamento padrão do formulário, que é recarregar a página
    event.preventDefault();

    // Pega os valores dos campos de input do formulário de cadastro
    const email = document.querySelector('#cadastro-email').value;
    const senha = document.querySelector('#cadastro-senha').value;

    // Tenta fazer a requisição para a API
    try {
        const response = await fetch('https://www.google.com/search?q=https://www.google.com/search?q=https://gerenciador-de-tarefas-backend.onrender.com////api/auth/register', {
            method: 'POST', // Método da requisição
            headers: {
                'Content-Type': 'application/json' // Avisa ao servidor que estamos enviando JSON
            },
            body: JSON.stringify({ email, senha }) // Converte o objeto JS para uma string JSON
        });

        const dados = await response.json(); // Tenta converter a resposta do servidor em JSON

        // Se a resposta da API não for um sucesso (ex: status 400), entra aqui
        if (!response.ok) {
            // Lança um erro com a mensagem que veio da nossa API
            throw new Error(dados.error || 'Erro ao cadastrar.');
        }

        // Se o cadastro deu certo
        mostrarMensagem('Cadastro realizado com sucesso! Faça o login.', 'sucesso');
        formCadastro.reset(); // Limpa o formulário

    } catch (error) {
        // Se qualquer erro acontecer (na requisição ou na resposta), entra aqui
        mostrarMensagem(error.message, 'erro');
    }
});


// --- Lógica de Login ---

// Adiciona um "ouvinte" de evento para o envio (submit) do formulário de login
formLogin.addEventListener('submit', async (event) => {
    // Impede o comportamento padrão do formulário
    event.preventDefault();

    // Pega os valores dos campos de input do formulário de login
    const email = document.querySelector('#login-email').value;
    const senha = document.querySelector('#login-senha').value;

    try {
        const response = await fetch('https://www.google.com/search?q=https://www.google.com/search?q=https://gerenciador-de-tarefas-backend.onrender.com////api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        });

        const dados = await response.json();

        if (!response.ok) {
            throw new Error(dados.error || 'Erro ao fazer login.');
        }

        // --- SUCESSO NO LOGIN ---
        // Se o login deu certo, o 'dados' terá o nosso token.
        
        // 1. Salvar o token no navegador
        // localStorage é uma espécie de "pequeno cofre" ou "gaveta" no navegador
        // onde podemos guardar informações que persistem mesmo que o usuário feche a aba.
        localStorage.setItem('token', dados.token);

        // 2. Redirecionar o usuário para a página de tarefas
        // Nós ainda não criamos essa página, mas já vamos deixar o redirecionamento pronto.
        window.location.href = 'tarefas.html'; 

    } catch (error) {
        mostrarMensagem(error.message, 'erro');
    }
});


// --- Função para Exibir Mensagens ---
function mostrarMensagem(texto, tipo) {
    divMensagem.textContent = texto;
    divMensagem.className = tipo; // Adiciona a classe 'sucesso' ou 'erro'
    divMensagem.style.display = 'block'; // Torna a div visível

    // Esconde a mensagem depois de 3 segundos
    setTimeout(() => {
        divMensagem.style.display = 'none';
    }, 3000);
}