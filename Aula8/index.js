const form = document.querySelector("#cadastro");

form.addEventListener("submit", executar);
document.querySelector("#cpf").addEventListener("input", mascararCpf);
document.querySelector("#celular").addEventListener("input", mascararCelular);
document.querySelector("#cep").addEventListener("input", mascararCep);

function executar(evento) {
  evento.preventDefault();
  limparForm();
  if (!validarForm()) {
    return;
  }
  chamarApi();
}

// ---------- ENVIO PARA A API ----------
async function chamarApi() {
  // A senha não é enviada: a API de teste é pública e ecoa tudo que recebe.
  const dados = {
    nome: valor("#nome"),
    nascimento: valor("#nascimento"),
    cpf: somenteNumeros(valor("#cpf")),
    celular: somenteNumeros(valor("#celular")),
    email: valor("#email"),
    cep: somenteNumeros(valor("#cep")),
    cidade: valor("#cidade"),
    estado: valor("#estado"),
  };

  try {
    const resposta = await fetch("https://postman-echo.com/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    if (!resposta.ok) {
      throw new Error(`Erro ${resposta.status}: ${resposta.statusText}`);
    }

    const resultado = await resposta.json();
    alert(
      "Retorno da API:\n\n" + JSON.stringify(resultado.json, null, 2)
    );
  } catch (erro) {
    alert("Não foi possível enviar o cadastro: " + erro.message);
  }
}

// ---------- VALIDAÇÃO ----------
function validarForm() {
  const nome = valor("#nome");
  if (nome === "") {
    mostrarErro("nome", "Nome não pode estar vazio!");
  } else if (nome.split(/\s+/).length < 2) {
    mostrarErro("nome", "Informe nome e sobrenome!");
  }

  const nascimento = valor("#nascimento");
  if (nascimento === "") {
    mostrarErro("nascimento", "Data de nascimento não pode estar vazia!");
  } else if (calcularIdade(nascimento) < 18) {
    mostrarErro("nascimento", "É necessário ter 18 anos!");
  }

  const cpf = valor("#cpf");
  if (cpf === "") {
    mostrarErro("cpf", "CPF não pode estar vazio!");
  } else if (!cpfValido(cpf)) {
    mostrarErro("cpf", "CPF inválido!");
  }

  const celular = somenteNumeros(valor("#celular"));
  if (celular === "") {
    mostrarErro("celular", "Celular não pode estar vazio!");
  } else if (!/^\d{2}9\d{8}$/.test(celular)) {
    mostrarErro("celular", "Celular inválido! Use (DD) 9XXXX-XXXX.");
  }

  const email = valor("#email");
  if (email === "") {
    mostrarErro("email", "Email não pode estar vazio!");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    mostrarErro("email", "Email inválido!");
  }

  const cep = somenteNumeros(valor("#cep"));
  if (cep === "") {
    mostrarErro("cep", "CEP não pode estar vazio!");
  } else if (cep.length !== 8) {
    mostrarErro("cep", "CEP deve ter 8 dígitos!");
  }

  if (valor("#cidade") === "") {
    mostrarErro("cidade", "Cidade não pode estar vazia!");
  }

  if (valor("#estado") === "") {
    mostrarErro("estado", "Selecione um estado!");
  }

  const senha = document.querySelector("#senha").value;
  if (senha === "") {
    mostrarErro("senha", "Senha não pode estar vazia!");
  } else if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(senha)) {
    mostrarErro("senha", "Mínimo de 8 caracteres, com letras e números!");
  }

  const confirmar = document.querySelector("#confirmar-senha").value;
  if (confirmar === "") {
    mostrarErro("confirmar-senha", "Confirme sua senha!");
  } else if (confirmar !== senha) {
    mostrarErro("confirmar-senha", "As senhas não coincidem!");
  }

  if (!document.querySelector("#termos").checked) {
    mostrarErro("termos", "É preciso aceitar os termos!");
  }

  const valido = document.querySelectorAll("p.erro").length === 0;

  if (!valido) {
    const concluido = document.querySelector("#concluido");
    concluido.textContent = "Corrija os erros antes de prosseguir!";
    concluido.classList.add("erro");
    concluido.classList.remove("oculto");
  }

  return valido;
}

function mostrarErro(campo, mensagem) {
  const erro = document.querySelector(`#erro-${campo}`);
  erro.textContent = mensagem;
  erro.classList.add("erro");
  erro.classList.remove("oculto");
  const input = document.querySelector(`#${campo}`);
  if (input) input.classList.add("campo-invalido");
}

function limparForm() {
  document.querySelectorAll("p.erro").forEach((item) => {
    item.classList.remove("erro");
    item.classList.add("oculto");
  });
  document
    .querySelectorAll(".campo-invalido")
    .forEach((item) => item.classList.remove("campo-invalido"));
  document.querySelector("#concluido").classList.add("oculto");
}

// ---------- FUNÇÕES AUXILIARES ----------
function valor(seletor) {
  return document.querySelector(seletor).value.trim();
}

function somenteNumeros(texto) {
  return texto.replace(/\D/g, "");
}

function calcularIdade(dataISO) {
  const nasc = new Date(dataISO + "T00:00:00");
  const hoje = new Date();
  let idade = hoje.getFullYear() - nasc.getFullYear();
  const jaFezAniversario =
    hoje.getMonth() > nasc.getMonth() ||
    (hoje.getMonth() === nasc.getMonth() && hoje.getDate() >= nasc.getDate());
  if (!jaFezAniversario) idade--;
  return idade;
}

function cpfValido(cpf) {
  const n = somenteNumeros(cpf);
  if (n.length !== 11 || /^(\d)\1{10}$/.test(n)) return false;

  for (let tamanho = 9; tamanho <= 10; tamanho++) {
    let soma = 0;
    for (let i = 0; i < tamanho; i++) {
      soma += Number(n[i]) * (tamanho + 1 - i);
    }
    const digito = ((soma * 10) % 11) % 10;
    if (digito !== Number(n[tamanho])) return false;
  }
  return true;
}

// ---------- MÁSCARAS ----------
function mascararCpf(evento) {
  const n = somenteNumeros(evento.target.value).slice(0, 11);
  let r = n;
  if (n.length > 9) r = `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6, 9)}-${n.slice(9)}`;
  else if (n.length > 6) r = `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6)}`;
  else if (n.length > 3) r = `${n.slice(0, 3)}.${n.slice(3)}`;
  evento.target.value = r;
}

function mascararCelular(evento) {
  const n = somenteNumeros(evento.target.value).slice(0, 11);
  const ddd = n.slice(0, 2);
  const inicio = n.slice(2, 7);
  const fim = n.slice(7);

  if (n.length > 7) evento.target.value = `(${ddd}) ${inicio}-${fim}`;
  else if (n.length > 2) evento.target.value = `(${ddd}) ${inicio}`;
  else if (n.length > 0) evento.target.value = `(${ddd}`;
  else evento.target.value = "";
}

function mascararCep(evento) {
  const n = somenteNumeros(evento.target.value).slice(0, 8);
  evento.target.value = n.length > 5 ? `${n.slice(0, 5)}-${n.slice(5)}` : n;
}