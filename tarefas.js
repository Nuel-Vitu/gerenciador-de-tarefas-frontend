// tarefas.js - VERSÃO FINAL CORRIGIDA

// --- SELEÇÃO DOS ELEMENTOS GLOBAIS ---
const btnLogout = document.querySelector('#btn-logout');
const listaDeTarefas = document.querySelector('#lista-de-tarefas');
const formNovaTarefa = document.querySelector('#form-nova-tarefa');
const inputNovaTarefa = document.querySelector('#input-nova-tarefa');
const inputPrioridade = document.querySelector('#input-prioridade');
const inputPrazo = document.querySelector('#input-prazo');

// --- LÓGICA DE SEGURANÇA E INICIALIZAÇÃO ---
const token = localStorage.getItem('token');

if (!token) {
    alert("Acesso negado. Faça o login para continuar.");
    window.location.href = 'index.html';
}

// --- EVENT LISTENERS (OUVINTES DE EVENTOS) ---

btnLogout.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
});

formNovaTarefa.addEventListener('submit', async (event) => {
    event.preventDefault();
    const texto = inputNovaTarefa.value;
    const prazo = inputPrazo.value;
    const prioridade = inputPrioridade.value;

    if (!texto) {
        alert("A descrição da tarefa é obrigatória!");
        return;
    }

    try {
        const corpoRequisicao = { texto, prioridade };
        if (prazo) {
            corpoRequisicao.prazo = prazo;
        }

        const response = await fetch('https://gerenciador-de-tarefas-backend.onrender.com/api/tarefas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(corpoRequisicao)
        });

        if (!response.ok) {
            const erro = await response.json();
            throw new Error(erro.error || 'Erro ao criar tarefa.');
        }

        const novaTarefaCriada = await response.json();
        renderizarTarefa(novaTarefaCriada);
        formNovaTarefa.reset();
    } catch (error) {
        console.error('Erro ao criar tarefa:', error);
        alert(error.message);
    }
});

listaDeTarefas.addEventListener('click', async (event) => {
    const elementoClicado = event.target;
    const tarefaLi = elementoClicado.closest('.tarefa-item');
    if (!tarefaLi) return;
    const idDaTarefa = tarefaLi.dataset.id;

    if (elementoClicado.classList.contains('btn-toggle')) {
        try {
            const estadoAtual = tarefaLi.classList.contains('completa');
            const novoEstado = !estadoAtual;
            const response = await fetch(`https://gerenciador-de-tarefas-backend.onrender.com/api/tarefas/${idDaTarefa}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ completa: novoEstado })
            });
            if (!response.ok) throw new Error('Falha ao atualizar o status da tarefa.');
            tarefaLi.classList.toggle('completa');
        } catch (error) {
            console.error("Erro ao alternar status:", error);
            alert(error.message);
        }
    }

    if (elementoClicado.classList.contains('btn-deletar')) {
        const confirmar = confirm("Você tem certeza que deseja deletar esta tarefa?");
        if (confirmar) {
            try {
                const response = await fetch(`https://gerenciador-de-tarefas-backend.onrender.com/api/tarefas/${idDaTarefa}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('Falha ao deletar a tarefa.');
                tarefaLi.remove();
            } catch (error) {
                console.error("Erro ao deletar:", error);
                alert(error.message);
            }
        }
    }

    if (elementoClicado.classList.contains('btn-editar')) {
        const divInfo = tarefaLi.querySelector('.tarefa-info');
        const spanTexto = divInfo.querySelector('.tarefa-texto');
        const spanPrioridade = divInfo.querySelector('.prioridade-badge');
        const prioridadeAtual = spanPrioridade.className.split(' ')[1].split('-')[1];
        const inputEdicaoTexto = document.createElement('input');
        inputEdicaoTexto.type = 'text';
        inputEdicaoTexto.value = spanTexto.textContent;
        inputEdicaoTexto.className = 'input-edicao-texto';
        const selectEdicaoPrioridade = document.createElement('select');
        selectEdicaoPrioridade.className = 'select-edicao-prioridade';
        selectEdicaoPrioridade.innerHTML = `<option value="baixa">Baixa</option><option value="media">Média</option><option value="alta">Alta</option>`;
        selectEdicaoPrioridade.value = prioridadeAtual;
        divInfo.innerHTML = '';
        divInfo.appendChild(inputEdicaoTexto);
        divInfo.appendChild(selectEdicaoPrioridade);
        inputEdicaoTexto.focus();
        elementoClicado.textContent = 'Salvar';
        elementoClicado.classList.remove('btn-editar');
        elementoClicado.classList.add('btn-salvar');
    } 
    else if (elementoClicado.classList.contains('btn-salvar')) {
        const divInfo = tarefaLi.querySelector('.tarefa-info');
        const inputEdicaoTexto = divInfo.querySelector('.input-edicao-texto');
        const selectEdicaoPrioridade = divInfo.querySelector('.select-edicao-prioridade');
        if (!inputEdicaoTexto || !selectEdicaoPrioridade) return;
        const novoTexto = inputEdicaoTexto.value;
        const novaPrioridade = selectEdicaoPrioridade.value;
        try {
            const response = await fetch(`https://gerenciador-de-tarefas-backend.onrender.com/api/tarefas/${idDaTarefa}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ texto: novoTexto, prioridade: novaPrioridade })
            });
            if (!response.ok) throw new Error('Falha ao salvar a tarefa.');
            carregarTarefas();
        } catch (error) {
            console.error('Erro ao salvar tarefa:', error);
            alert(error.message);
        }
    }
});


// --- FUNÇÕES PRINCIPAIS ---

async function carregarDadosDoUsuario() {
    if (!token) return;
    try {
        const response = await fetch('https://gerenciador-de-tarefas-backend.onrender.com/api/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
            throw new Error('Não foi possível carregar os dados do usuário.');
        }
        const usuario = await response.json();
        const spanUsuario = document.querySelector('#usuario-logado');
        if (spanUsuario) {
            spanUsuario.textContent = usuario.nome || usuario.email;
        }
    } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
    }
}

async function carregarTarefas() {
    try {
        const response = await fetch('https://gerenciador-de-tarefas-backend.onrender.com/api/tarefas', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.status === 401 || response.status === 403) {
            alert('Sua sessão expirou! Faça o login novamente.');
            localStorage.removeItem('token');
            window.location.href = 'index.html';
            return;
        }
        const tarefas = await response.json();
        listaDeTarefas.innerHTML = '';
        tarefas.forEach(tarefa => renderizarTarefa(tarefa));
    } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
        alert('Não foi possível carregar as tarefas.');
    }
}

function renderizarTarefa(tarefa) {
    const li = document.createElement('li');
    li.className = 'tarefa-item';
    li.dataset.id = tarefa.id;

    if (tarefa.completa) {
        li.classList.add('completa');
    }
    const classePrioridade = `prioridade-${tarefa.prioridade || 'baixa'}`;

    li.innerHTML = `
    <div class="tarefa-info">
        <span class="prioridade-badge ${classePrioridade}">${tarefa.prioridade || 'N/D'}</span>
        <span class="tarefa-texto">${tarefa.texto}</span>
    </div>
    <div class="tarefa-botoes">
        <button class="btn-toggle">✓</button>
        <button class="btn-editar">Editar</button>
        <button class="btn-deletar">Deletar</button>
    </div>
    `;

    listaDeTarefas.appendChild(li);
}

// --- INICIALIZAÇÃO ---
// Chama as funções para carregar os dados assim que a página é carregada
carregarTarefas();
carregarDadosDoUsuario(); // Adicionada a chamada da função