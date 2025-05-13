const input = document.getElementById("taskInput");
const button = document.getElementById("btnListen");
const lista = document.getElementById("taskList");

button.addEventListener("click", function () {
    const textoDigitado = input.value;

    if (textoDigitado.trim() === "") {
        alert("Por favor, digite uma tarefa!");
        return;
    }

    let listaDeTarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

    const tarefa = {
        id: Date.now(),
        nome:textoDigitado,
        concluido:false
    };

    listaDeTarefas.push(tarefa);
    localStorage.setItem("tarefas", JSON.stringify(listaDeTarefas));
    atualizarListaDeTarefas();
}); 

function atualizarListaDeTarefas() {
    lista.innerHTML = ""; 

    let listaDeTarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
    
    listaDeTarefas.forEach(function(tarefa) {
        const li = document.createElement("li");
        li.textContent = tarefa.nome; 

        if (tarefa.concluido) {
            li.style.textDecoration = "line-through";
        }

        const concluirButton = document.createElement("button");
        concluirButton.textContent = "Concluido";
        concluirButton.addEventListener("click", function(){
            tarefa.concluido = !tarefa.concluido;
            localStorage.setItem("tarefas", JSON.stringify(listaDeTarefas));
            atualizarListaDeTarefas();
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Apagar";
        deleteButton.addEventListener("click", function() {
            excluirTarefa(tarefa.id);
        });

        const editButton = document.createElement("button");
        editButton.textContent = "Editar";
        editButton.addEventListener("click", function() {
            editarTarefa(tarefa.id);
        });

        li.appendChild(concluirButton);
        li.appendChild(editButton);
        li.appendChild(deleteButton);
        lista.appendChild(li);
    });
}

function excluirTarefa(id) {
    let listaDeTarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
    listaDeTarefas = listaDeTarefas.filter(function(tarefa){
        return tarefa.id !==id;
    });
    localStorage.setItem("tarefas", JSON.stringify(listaDeTarefas));
    atualizarListaDeTarefas();
}

function editarTarefa(id) {
    let listaDeTarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
    const tarefa = listaDeTarefas.find(function(tarefa) {
        return tarefa.id === id;
    });

    if (tarefa) {
        input.value = tarefa.nome;
        listaDeTarefas = listaDeTarefas.filter(function(t) {
            return t.id !== id;
        });
        localStorage.setItem("tarefas", JSON.stringify(listaDeTarefas));
        atualizarListaDeTarefas();
    }
}

document.addEventListener("DOMContentLoaded", function(){
    atualizarListaDeTarefas();
});
    