function executar(evento) {
  evento.preventDefault();
  limparErros();

  const nome = document.querySelector("#nome");
  const erroNome = document.querySelector("#erro-nome");

  if(nome.value === "") {
    erroNome.textContent = "Nome não pode estar vazio!";
    erroNome.classList.add("erro");
    erroNome.classList.remove("oculto");
  }  



  const idade = document.querySelector("#idade");
  const erroIdade = document.querySelector("#erro-idade");

  if(idade.value === "") {
    erroIdade.textContent = "Idade não pode estar vazio";
    erroIdade.classList.add("erro");
    erroIdade.classList.remove("oculto");
    
  } else if (number(idade.value) < 18) {
    erroIdade.textContent = "É necessário ter 18 anos ou mais!";
    erroIdade.classList.add("erro");
    erroIdade.classList.remove("oculto");
  }

  const email = document.querySelector("#email");
  const erroEmail = document.querySelector("#erro-email");
  if (email.value === "") 

}
function limparErros() {
  document.querySelectorAll(".erro").forEach((elemento) => {
    elemento.classList.remove("erro");
    elemento.classList.add("oculto");
  })
}