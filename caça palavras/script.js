const gridElement = document.getElementById("grid");
const gridSize = 15;
let grid = [];

// Lista de palavras possíveis
const todasPalavras = [
  "PYTHON", "JAVASCRIPT", "CODIGO", "FUNCAO", "ALGORITMO", "VARIAVEL", "HTML",
  "CSS", "LOOP", "ARRAY", "OBJETO", "JAVA", "REACT", "SOFTWARE", "HARDWARE",
  "COMPUTADOR", "LINUX", "LOGICA", "STRING", "NUMERO", "NAVEGADOR", "DESENVOLVER"
];

// Pega palavras aleatórias da lista
function gerarPalavrasAleatorias(quantidade) {
  const palavras = [];
  const usadas = new Set();

  while (palavras.length < quantidade && usadas.size < todasPalavras.length) {
    const indice = Math.floor(Math.random() * todasPalavras.length);
    const palavra = todasPalavras[indice];
    if (!usadas.has(palavra) && palavra.length <= gridSize) {
      palavras.push(palavra);
      usadas.add(palavra);
    }
  }

  return palavras;
}

// Palavras escolhidas para esta partida
const words = gerarPalavrasAleatorias(10);

// Cria checkboxes no HTML automaticamente
function criarCheckboxes() {
  const listaPalavrasDiv = document.getElementById('lista-palavras');
  listaPalavrasDiv.innerHTML = ''; // Limpa antes de preencher

  words.forEach(word => {
    const label = document.createElement("label");
    label.style.display = "block";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = word;

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(" " + word));
    listaPalavrasDiv.appendChild(label);
  });
}

// Cria um grid vazio
function createEmptyGrid() {
  for (let i = 0; i < gridSize; i++) {
    grid[i] = [];
    for (let j = 0; j < gridSize; j++) {
      grid[i][j] = "";
    }
  }
}

// Posiciona palavras no grid (horizontal ou vertical)
function placeWord(word) {
  let attempts = 0;
  let placed = false;

  while (!placed && attempts < 100) {
    const direction = Math.random() < 0.5 ? "horizontal" : "vertical";
    let row, colStart;

    if (direction === "horizontal") {
      row = Math.floor(Math.random() * gridSize);
      colStart = Math.floor(Math.random() * (gridSize - word.length));

      let fits = true;
      for (let i = 0; i < word.length; i++) {
        const current = grid[row][colStart + i];
        if (current !== "" && current !== word[i]) {
          fits = false;
          break;
        }
      }

      if (fits) {
        for (let i = 0; i < word.length; i++) {
          grid[row][colStart + i] = word[i];
        }
        placed = true;
      }

    } else {
      colStart = Math.floor(Math.random() * gridSize);
      row = Math.floor(Math.random() * (gridSize - word.length));

      let fits = true;
      for (let i = 0; i < word.length; i++) {
        const current = grid[row + i][colStart];
        if (current !== "" && current !== word[i]) {
          fits = false;
          break;
        }
      }

      if (fits) {
        for (let i = 0; i < word.length; i++) {
          grid[row + i][colStart] = word[i];
        }
        placed = true;
      }
    }

    attempts++;
  }

  if (!placed) {
    console.warn(`Não foi possível posicionar a palavra: ${word}`);
  }
}

// Preenche espaços vazios com letras aleatórias
function fillGridRandomLetters() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (grid[i][j] === "") {
        grid[i][j] = letters[Math.floor(Math.random() * letters.length)];
      }
    }
  }
}

// Renderiza o grid na tela
function renderGrid() {
  gridElement.innerHTML = "";
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = i;
      cell.dataset.col = j;
      cell.textContent = grid[i][j];

      cell.addEventListener("click", () => {
        cell.classList.toggle("selected");
        verificarSelecao();
      });

      gridElement.appendChild(cell);
    }
  }
}

// Verifica se as letras selecionadas formam uma palavra válida
function verificarSelecao() {
  const selecionadas = document.querySelectorAll('.cell.selected');
  if(selecionadas.length === 0) return;

  let palavraSelecionada = '';
  selecionadas.forEach(cell => {
    palavraSelecionada += cell.textContent;
  });

  if (words.includes(palavraSelecionada.toUpperCase())) {
    marcarPalavraEncontrada(palavraSelecionada);
    selecionadas.forEach(cell => {
      cell.classList.remove('selected');
      cell.classList.add('found');
    });
  }
}

// Marca o checkbox da palavra encontrada
function marcarPalavraEncontrada(palavra){
  const checkboxes = document.querySelectorAll('.word-list input[type="checkbox"]');

  checkboxes.forEach((checkbox) => {
    if(checkbox.value.toLowerCase() === palavra.toLowerCase()) {
      checkbox.checked = true;
    }
  });
}

// Início do jogo
createEmptyGrid();
words.forEach(placeWord);
fillGridRandomLetters();
criarCheckboxes();
renderGrid();
