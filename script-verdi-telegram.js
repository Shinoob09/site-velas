<script>
// ... (o restante do script JS do site viria antes aqui)
async function finalizarCompra() {
  if (!carrinhoAtual || Object.keys(carrinhoAtual).length === 0) {
    alert('Seu carrinho está vazio!');
    return;
  }

  const nome = prompt("Digite seu nome completo:");
  const endereco = prompt("Digite seu endereço completo:");
  const telefone = prompt("Digite seu telefone com DDD:");

  if (!nome || !endereco || !telefone) {
    alert("⚠️ Todos os campos são obrigatórios.");
    return;
  }

  const itens = Object.values(carrinhoAtual).map(item =>
    `\${item.quantidade}x \${item.nome} (R$\${item.preco.toFixed(2)})`
  ).join(", ");

  const total = Object.values(carrinhoAtual).reduce(
    (acc, item) => acc + (item.preco * item.quantidade),
    0
  ).toFixed(2);

  const pedido = {
    nome,
    endereco,
    telefone,
    itens,
    total,
    data: new Date().toLocaleString("pt-BR")
  };

  try {
    await db.collection("pedidos").add(pedido);
  } catch (erro) {
    console.error("Erro ao salvar pedido no Firebase:", erro);
    alert("Erro ao salvar o pedido. Tente novamente.");
    return;
  }

  getEl("input-nome").value = nome;
  getEl("input-endereco").value = endereco;
  getEl("input-telefone").value = telefone;
  getEl("input-pedido").value = itens;
  getEl("input-total").value = total;

  fetch("https://formsubmit.co/ajax/moretogustavo868@gmail.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      _subject: "Novo Pedido VerdiLume",
      nome,
      endereco,
      telefone,
      pedido: itens,
      total
    })
  }).catch((err) => {
    console.warn("Falha no envio via FormSubmit:", err);
  });

  // ✅ Envio pro Telegram
  const telegramMessage = `
🧾 *Novo Pedido VerdiLume*
👤 *Nome:* \${nome}
🏠 *Endereço:* \${endereco}
📞 *Telefone:* \${telefone}
📦 *Itens:* \${itens}
💰 *Total:* R$\${total}
`.trim();

  fetch(`https://api.telegram.org/bot7635965015:AAGcOEt7lMgxmlG8C8FxPhCh2vDMnIk5Rpg/sendMessage?chat_id=17417849&text=${encodeURIComponent(telegramMessage)}&parse_mode=Markdown`)
    .then(() => console.log("Pedido enviado pro Telegram"))
    .catch(err => console.error("Erro ao enviar Telegram:", err));

  localStorage.removeItem("carrinho");
  setTimeout(() => {
    window.location.href = "confirmacao.html";
  }, 1000);
}
</script>
