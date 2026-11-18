function executar(evento) {
  evento.preventDefault();
  limparErros();

  let formularioValido = true;

  const nome = document.querySelector("#nome");
  if (nome.value.trim() === "") {
    mostrarErro("#erro-nome", "Nome não pode estar vazio!");
    formularioValido = false;
  }

  const idade = document.querySelector("#idade");
  if (idade.value === "") {
    mostrarErro("#erro-idade", "Idade não pode estar vazia!");
    formularioValido = false;
  } else if (Number(idade.value) < 18) {
    mostrarErro("#erro-idade", "É necessário ter 18 anos ou mais!");
    formularioValido = false;
  }

  const email = document.querySelector("#email");
  if (email.value.trim() === "") {
    mostrarErro("#erro-email", "Email não pode estar vazio!");
    formularioValido = false;
  } else if (!email.validity.valid) {
    mostrarErro("#erro-email", "Digite um email válido!");
    formularioValido = false;
  }

  const termos = document.querySelector("#termos");
  if (!termos.checked) {
    mostrarErro("#erro-termos", "Você precisa aceitar os termos!");
    formularioValido = false;
  }

  const concluido = document.querySelector("#concluido");
  if (formularioValido) {
    concluido.textContent = "Cadastro realizado com sucesso!";
    concluido.classList.add("sucesso");
    concluido.classList.remove("oculto");
  }
}

function mostrarErro(seletor, mensagem) {
  const elemento = document.querySelector(seletor);
  elemento.textContent = mensagem;
  elemento.classList.add("erro");
  elemento.classList.remove("oculto");
}

function limparErros() {
  document.querySelectorAll(".erro").forEach((elemento) => {
    elemento.classList.remove("erro");
    elemento.classList.add("oculto");
  });

  const concluido = document.querySelector("#concluido");
  concluido.textContent = "";
  concluido.classList.remove("sucesso");
  concluido.classList.add("oculto");
}