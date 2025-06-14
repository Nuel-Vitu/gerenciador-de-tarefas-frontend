# Gerenciador de Tarefas - Interface Frontend

Este é o repositório do frontend para a aplicação Full-Stack "Gerenciador de Tarefas". Esta interface foi construída utilizando HTML, CSS e JavaScript puros, consumindo a API RESTful do [repositório backend](https://github.com/Nuel-Vitu/gerenciador-de-tarefas-backend).

A aplicação permite que os usuários se cadastrem, façam login e gerenciem suas listas de tarefas de forma interativa e dinâmica, sem a necessidade de recarregar a página.

## 🚀 Recursos Implementados

* **Interface de Login/Cadastro:** Formulários para autenticação de usuários com feedback visual.
* **Painel de Tarefas:** Exibição da lista de tarefas do usuário logado.
* **CRUD no Frontend:**
    * **Criar:** Formulário para adicionar novas tarefas.
    * **Ler:** Visualização da lista de tarefas.
    * **Atualizar:** Marcar tarefas como concluídas e editar o texto.
    * **Deletar:** Remover tarefas da lista.
* **Gerenciamento de Sessão:** Utilização de Token JWT salvo no `localStorage` para manter o usuário logado e autorizar requisições à API.
* **Design Responsivo (Básico):** A interface se adapta a diferentes tamanhos de tela.

## 🛠️ Tecnologias Utilizadas

* **HTML5** (Estrutura semântica)
* **CSS3** (Estilização com Flexbox e Grid)
* **JavaScript (ES6+)**
    * Manipulação do DOM para criar uma interface dinâmica.
    * **Fetch API** para comunicação assíncrona com o backend.
    * Gerenciamento de estado simples via `localStorage`.

## ⚙️ Como Executar o Projeto

1.  Garanta que a [API Backend](https://github.com/Nuel-Vitu/gerenciador-de-tarefas-backend) esteja rodando localmente.
2.  Clone este repositório.
3.  Abra o arquivo `index.html` em qualquer navegador web.

## Autor

**Emanuel Vitor Batista de Oliveira**
* **Email:** vitorbatista2070@gmail.com
* **LinkedIn:** [Perfil no LinkedIn](https://www.linkedin.com/in/emanuel-vitor-batista-de-oliveira-9119b51bb?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3Bv5qYskZ9Q3qosfxMpX%2FIYg%3D%3D)