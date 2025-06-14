// Seleciona o botão de logout
const btnLogout = document.querySelector('#btn-logout');

// Pega a referência para a lista <ul> onde as tarefas serão mostradas
const listaDeTarefas = document.querySelector('#lista-de-tarefas');


// --- LÓGICA DE SEGURANÇA E INICIALIZAÇÃO ---

// Pega o token salvo no localStorage
const token = localStorage.getItem('token');

// --- Selecionando os Elementos do Formulário de Nova Tarefa ---
const formNovaTarefa = document.querySelector('#form-nova-tarefa');
const inputNovaTarefa = document.querySelector('#input-nova-tarefa');
const inputPrazo = document.querySelector('#input-prazo');

// VERIFICADOR DE SEGURANÇA: Se não houver token...
if (!token) {
    // ...expulsa o usuário, redirecionando para a página de login.
    window.location.href = 'index.html';
}


// --- EVENT LISTENERS (OUVINTES DE EVENTOS) ---

// Adiciona um evento de clique no botão de logout
btnLogout.addEventListener('click', () => {
    // Remove o token do localStorage
    localStorage.removeItem('token');
    // Redireciona para a página de login
    window.location.href = 'index.html';
});



// Adiciona um "ouvinte" para o envio do formulário de nova tarefa
formNovaTarefa.addEventListener('submit', async (event) => {
    // Impede o recarregamento da página
    event.preventDefault();

    // Pega os valores dos inputs
    const texto = inputNovaTarefa.value;
    const prazo = inputPrazo.value; // Será uma string "AAAA-MM-DD" ou ""

    // Validação simples: não permite tarefa sem texto
    if (!texto) {
        alert("A descrição da tarefa é obrigatória!");
        return;
    }

    try {
        // Monta o corpo da requisição
        const corpoRequisicao = { texto };
        if (prazo) {
            corpoRequisicao.prazo = prazo;
        }

        // Envia a requisição POST para a API
        const response = await fetch('http://localhost:3001/api/tarefas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Envia o token para autorização!
            },
            body: JSON.stringify(corpoRequisicao)
        });

        if (!response.ok) {
            const erro = await response.json();
            throw new Error(erro.error || 'Erro ao criar tarefa.');
        }

        // Se a tarefa foi criada com sucesso, o backend nos retorna a tarefa completa
        const novaTarefaCriada = await response.json();

        // Usa nossa função já existente para "desenhar" a nova tarefa na tela!
        renderizarTarefa(novaTarefaCriada);

        // Limpa os campos do formulário
        formNovaTarefa.reset();

    } catch (error) {
        console.error('Erro ao criar tarefa:', error);
        alert(error.message);
    }
});


// --- FUNÇÕES PRINCIPAIS ---

// Função assíncrona para buscar as tarefas da API
async function carregarTarefas() {
    try {
        // Faz a requisição GET para a API, enviando o token de autorização
        const response = await fetch('http://localhost:3001/api/tarefas', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}` // Envia o token no cabeçalho
            }
        });

        // Se a resposta indicar um erro de autorização (ex: token expirado)...
        if (response.status === 401 || response.status === 403) {
            // ...expulsa o usuário.
            alert('Sua sessão expirou! Faça o login novamente.');
            window.location.href = 'index.html';
            return;
        }

        const tarefas = await response.json(); // Converte a resposta em JSON

        // Limpa a lista de tarefas atual antes de adicionar as novas
        listaDeTarefas.innerHTML = '';
        
        // Para cada tarefa recebida, chama a função para exibi-la na tela
        tarefas.forEach(tarefa => renderizarTarefa(tarefa));

    } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
        alert('Não foi possível carregar as tarefas.');
    }
}

// Função para renderizar (desenhar) uma única tarefa na tela
function renderizarTarefa(tarefa) {
    // Cria o elemento <li>
    const li = document.createElement('li');
    li.className = 'tarefa-item';
    li.dataset.id = tarefa.id; // Guarda o id da tarefa no próprio elemento

    // Adiciona a classe 'completa' se a tarefa estiver concluída
    if (tarefa.completa) {
        li.classList.add('completa');
    }

    // Define o conteúdo HTML do <li>
    li.innerHTML = `
        <span class="tarefa-texto">${tarefa.texto}</span>
        <div class="tarefa-botoes">
            <button class="btn-toggle">✓</button>
            <button class="btn-editar">Editar</button>
            <button class="btn-deletar">Deletar</button>
        </div>
    `;

    // Adiciona o <li> recém-criado à lista <ul> na página
    listaDeTarefas.appendChild(li);
}

// --- EVENT LISTENER PRINCIPAL PARA AÇÕES NAS TAREFAS ---
// Usando Delegação de Eventos na lista <ul>
// tarefas.js
// Isso permite que possamos lidar com cliques em qualquer tarefa, mesmo que ela seja adicionada depois
// (devido à natureza dinâmica do JavaScript, onde as tarefas podem ser adicionadas ou removidas).
listaDeTarefas.addEventListener('click', async (event) => {
    const elementoClicado = event.target;
    const tarefaLi = elementoClicado.closest('.tarefa-item');
    if (!tarefaLi) return;
    const idDaTarefa = tarefaLi.dataset.id;

    // --- LÓGICA PARA O BOTÃO TOGGLE (Marcar/Desmarcar) ---
    if (elementoClicado.classList.contains('btn-toggle')) {
        // ... (código que já temos, sem alterações)
        try {
            const estadoAtual = tarefaLi.classList.contains('completa');
            const novoEstado = !estadoAtual;
            const response = await fetch(`http://localhost:3001/api/tarefas/${idDaTarefa}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ completa: novoEstado })
            });
            if (!response.ok) throw new Error('Falha ao atualizar o status da tarefa.');
            tarefaLi.classList.toggle('completa');
        } catch (error) {
            alert(error.message);
        }
    }

    // --- LÓGICA PARA O BOTÃO DELETAR ---
    if (elementoClicado.classList.contains('btn-deletar')) {
        // ... (código que já temos, sem alterações)
        const confirmar = confirm("Você tem certeza que deseja deletar esta tarefa?");
        if (confirmar) {
            try {
                const response = await fetch(`http://localhost:3001/api/tarefas/${idDaTarefa}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('Falha ao deletar a tarefa.');
                tarefaLi.remove();
            } catch (error) {
                alert(error.message);
            }
        }
    }

    // SE O BOTÃO CLICADO FOR O DE "EDITAR"
    if (elementoClicado.classList.contains('btn-editar')) {
        // Pega o elemento <span> que contém o texto atual da tarefa
        const spanTexto = tarefaLi.querySelector('.tarefa-texto');
        
        // Cria um elemento <input> para a edição
        const inputEdicao = document.createElement('input');
        inputEdicao.type = 'text';
        inputEdicao.value = spanTexto.textContent; // Preenche o input com o texto atual
        inputEdicao.className = 'input-edicao'; // Aplica a classe CSS que criamos

        // Substitui o <span> pelo <input> na tela
        tarefaLi.replaceChild(inputEdicao, spanTexto);
        inputEdicao.focus(); // Coloca o cursor piscando dentro do input

        // Transforma o botão "Editar" em "Salvar"
        elementoClicado.textContent = 'Salvar';
        elementoClicado.classList.remove('btn-editar');
        elementoClicado.classList.add('btn-salvar');
    } 
    // SE O BOTÃO CLICADO FOR O DE "SALVAR"
    else if (elementoClicado.classList.contains('btn-salvar')) {
        // Pega o elemento <input> que está na tela
        const inputEdicao = tarefaLi.querySelector('.input-edicao');
        const novoTexto = inputEdicao.value;

        try {
            // 1. Envia a requisição PUT para o backend com o novo texto
            const response = await fetch(`http://localhost:3001/api/tarefas/${idDaTarefa}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ texto: novoTexto })
            });

            if (!response.ok) throw new Error('Falha ao salvar a tarefa.');
            
            const tarefaAtualizada = await response.json();

            // 2. Cria um novo elemento <span> com o texto atualizado
            const novoSpanTexto = document.createElement('span');
            novoSpanTexto.className = 'tarefa-texto';
            novoSpanTexto.textContent = tarefaAtualizada.texto;

            // 3. Substitui o <input> pelo novo <span>
            tarefaLi.replaceChild(novoSpanTexto, inputEdicao);

            // 4. Transforma o botão "Salvar" de volta em "Editar"
            elementoClicado.textContent = 'Editar';
            elementoClicado.classList.remove('btn-salvar');
            elementoClicado.classList.add('btn-editar');

        } catch (error) {
            alert(error.message);
        }
    }
});

// --- INICIALIZAÇÃO ---
// Chama a função para carregar as tarefas assim que o script é executado
carregarTarefas();