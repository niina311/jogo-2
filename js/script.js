import { perguntas } from "./pergunta.js";
import { aleatorio, nome } from "./aleatorio.js";

let atual = 0;
let historiaFinal = "";

const introScreen = document.querySelector("#introScreen");
const storyScreen = document.querySelector("#storyScreen");
const startForm = document.querySelector("#startForm");
const playerNameInput = document.querySelector("#playerName");
const sceneTitle = document.querySelector("#sceneTitle");
const sceneCount = document.querySelector("#sceneCount");
const survivorNameTag = document.querySelector("#survivorNameTag");
const answerList = document.querySelector("#answerList");
const storyNote = document.querySelector("#storyNote");

function mostraPergunta() {
  const pergunta = perguntas[atual];
  const pausa = pergunta.pausa === true;

  sceneTitle.textContent = pergunta.enunciado;
  sceneCount.textContent = pausa ? "CONTINUIDADE" : "HISTÓRIA EM ANDAMENTO";
  answerList.replaceChildren();
  answerList.hidden = false;
  storyNote.hidden = !pausa;

  if (pausa) {
    storyNote.textContent = "Escolha como seguir a partir daqui.";
  }

  pergunta.alternativas.forEach((opcao, indice) => {
    const botao = document.createElement("button");
    botao.className = "answer-button";
    botao.type = "button";
    botao.innerHTML = `<span class="answer-text"></span><span class="answer-arrow" aria-hidden="true">↗</span>`;
    botao.querySelector(".answer-text").textContent = opcao.texto;
    botao.addEventListener("click", () => respostaSelecionada(opcao));

    answerList.append(botao);
  });
}

function respostaSelecionada(opcaoSelecionada) {
  if (opcaoSelecionada.tipo === "gameover") {
    mostraFimDeJogo(opcaoSelecionada);
    return;
  }

  if (opcaoSelecionada.acao === "repetir") {
    mostraPergunta();
    return;
  }

  if (opcaoSelecionada.acao === "reiniciar") {
    iniciaJogo();
    return;
  }

  if (opcaoSelecionada.acao === "introducao") {
    atual = 0;
    historiaFinal = "";
    storyScreen.hidden = true;
    introScreen.hidden = false;
    return;
  }

  if (opcaoSelecionada.proxima === undefined) {
    return;
  }

  const afirmacao = aleatorio(opcaoSelecionada.afirmacao);
  historiaFinal += afirmacao + " ";
  atual = opcaoSelecionada.proxima;
  mostraPergunta();
}

function mostraFimDeJogo(opcaoSelecionada) {
  sceneTitle.textContent = "Essa escolha colocou a equipe em risco.";
  sceneCount.textContent = "FIM DE JOGO";
  answerList.replaceChildren();
  storyNote.hidden = false;
  storyNote.textContent = `${aleatorio(opcaoSelecionada.afirmacao)} A aventura terminou. Volte ao começo para tentar novamente.`;

  [
    { texto: "Voltar ao começo", acao: "introducao" },
  ].forEach((opcao) => {
    const botao = document.createElement("button");
    botao.className = "answer-button";
    botao.type = "button";
    botao.innerHTML = `<span class="answer-text"></span><span class="answer-arrow" aria-hidden="true">↗</span>`;
    botao.querySelector(".answer-text").textContent = opcao.texto;
    botao.addEventListener("click", () => respostaSelecionada(opcao));
    answerList.append(botao);
  });
}

function iniciaJogo() {
  atual = 0;
  historiaFinal = "";
  const participante = nome(playerNameInput.value);
  playerNameInput.value = participante;
  survivorNameTag.textContent = `SOBREVIVENTE: ${participante}`;
  introScreen.hidden = true;
  storyScreen.hidden = false;
  mostraPergunta();
}

startForm.addEventListener("submit", (evento) => {
  evento.preventDefault();
  iniciaJogo();
});