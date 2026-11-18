document.querySelectorAll(".card").forEach((card) => {
  if (localStorage.getItem(card.id)) {
    card.classList.add("marcado");
  }
  atualizarBotao(card);
});

function marcar(id, nome) {
  const card = document.querySelector(`#${id}`);
  card.classList.toggle("marcado");

  if (card.classList.contains("marcado")) {
    localStorage.setItem(id, nome);
  } else {
    localStorage.removeItem(id);
  }

  atualizarBotao(card);
}

function atualizarBotao(card) {
  const botao = card.querySelector("button");
  botao.textContent = card.classList.contains("marcado")
    ? "Desmarcar"
    : "Marcar";
}
