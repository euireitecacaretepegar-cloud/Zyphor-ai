const startBtn = document.getElementById("startBtn");
const intro = document.getElementById("intro");
const chat = document.getElementById("chat");
const input = document.getElementById("input");
const face = document.getElementById("face");
const mouth = document.getElementById("mouth");
const respostaDiv = document.getElementById("resposta");

/* ================= SEGURANÇA DE DOM ================= */

if (!startBtn || !intro || !chat || !input || !face || !mouth || !respostaDiv) {
  console.error("Erro: algum elemento do DOM não foi encontrado");
}

/* ================= INICIAR ================= */

startBtn.addEventListener("click", () => {
  intro.style.display = "none";
  chat.style.display = "flex";
});

/* ================= PISCAR ================= */

setInterval(() => {
  if (!face) return;

  face.src = "images/face_blink.png";
  setTimeout(() => {
    face.src = "images/face_neutral.png";
  }, 400);
}, 4000);

/* ================= RESPOSTAS FIXAS ================= */

function respostaFixa(pergunta) {
  pergunta = pergunta.toLowerCase();

  if (pergunta.includes("at3na"))
    return ["explodida em pedaços, porém, o que sobrou foi recuperado.", "psycho"];

  if (pergunta.includes("asmodeus"))
    return ["Shub-niggurath irá matar TODOS, mas tem alguém que não apoia essa escolha.", "angry"];

  if (pergunta.includes("sv"))
    return ["o inferno... MERECEM MUITO PIOR QUE ISSO.", "angry"];

  if (pergunta.includes("nulø"))
    return ["_Principe do Ódio_", "psycho"];

  if (pergunta.includes("poder do nulø"))
    return ["_Quais?_", "smile"];

  if (pergunta.includes("nulø quer"))
    return ["_Dor_", "angry"];

  if (pergunta.includes("lorde do limbo") || pergunta.includes("deus"))
    return ["DEUS destronou o anjo da luz Samuel...", "psycho"];

  return null;
}

/* ================= INPUT ================= */

input.addEventListener("keydown", async (e) => {
  if (e.key !== "Enter") return;

  const pergunta = input.value.trim();
  if (!pergunta) return;

  let resposta = "";
  let emocao = "neutral";

  try {
    const fixa = respostaFixa(pergunta);

    if (fixa) {
      resposta = fixa[0];
      emocao = fixa[1];
    } else {
      const r = await fetch("/.netlify/functions/zyphor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pergunta })
      });

      if (!r.ok) {
        throw new Error("API não respondeu");
      }

      const data = await r.json();
      console.log("Resposta da API:", data);

      resposta = data?.resposta ?? "Zyphor não respondeu.";
      emocao = data?.emocao ?? "neutral";
    }
  } catch (err) {
    console.error(err);
    resposta = "Erro de conexão com Zyphor...";
    emocao = "angry";
  }

  respostaDiv.innerText = resposta;
  respostaDiv.style.color = "white";

  animarBoca();
  mudarExpressao(emocao);

  input.value = "";
});

/* ================= ANIMAÇÕES ================= */

function animarBoca() {
  if (!mouth) return;

  let i = 0;
  const anim = setInterval(() => {
    mouth.src = i % 2 === 0
      ? "images/mouth_open.png"
      : "images/mouth_closed.png";
    i++;
  }, 200);

  setTimeout(() => clearInterval(anim), 2000);
}

function mudarExpressao(tipo) {
  if (!face) return;

  const img = "images/face_" + tipo + ".png";

  face.onerror = () => {
    face.src = "images/face_neutral.png";
  };

  face.src = img;
}
