<script>
  const getEl = (id) => document.getElementById(id);

  async function finalizarCompra() {
    if (!carrinhoAtual || Object.keys(carrinhoAtual).length === 0) {
      alert('Seu carrinho está vazio!');
      return;
    }

    const nome = prompt("Digite seu nome completo:")?.trim();
    const endereco = prompt("Digite seu endereço completo:")?.trim();
    const telefone = prompt("Digite seu telefone com DDD:")?.trim();

    if (!nome || !endereco || !telefone) {
      alert("⚠️ Todos os campos são obrigatórios.");
      return;
    }

    // Dados do carrinho
    const itens = Object.values(carrinhoAtual).map(item =>
      `${item.quantidade}x ${item.nome} (R$${item.preco.toFixed(2)})`
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

    // Envio ao Firebase
    try {
      await db.collection("pedidos").add(pedido);
    } catch (erro) {
      console.error("Erro ao salvar pedido no Firebase:", erro);
      alert("Erro ao salvar o pedido. Tente novamente.");
      return;
    }

    // Preencher inputs ocultos (caso use no confirmacao.html)
    getEl("input-nome").value = nome;
    getEl("input-endereco").value = endereco;
    getEl("input-telefone").value = telefone;
    getEl("input-pedido").value = itens;
    getEl("input-total").value = total;

    // Envio por FormSubmit
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

    // Envio para Telegram
    const telegramMessage = `
🧾 *Novo Pedido VerdiLume*
👤 *Nome:* ${nome}
🏠 *Endereço:* ${endereco}
📞 *Telefone:* ${telefone}
📦 *Itens:* ${itens}
💰 *Total:* R$${total}
`.trim();

    // ⚠️ CUIDADO: Esse token não deveria estar exposto no frontend
    const telegramToken = "7635965015:AAGcOEt7lMgxmlG8C8FxPhCh2vDMnIk5Rpg";
    const chatId = "5688730032";
    const url = `https://api.telegram.org/bot${telegramToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(telegramMessage)}&parse_mode=Markdown`;

    fetch(url)
      .then(() => console.log("Pedido enviado pro Telegram"))
      .catch(err => console.error("Erro ao enviar Telegram:", err));

    // Limpar e redirecionar
    localStorage.removeItem("carrinho");
    setTimeout(() => {
      window.location.href = "confirmacao.html";
    }, 1000);
  }

  // Expor no global pra teste se quiser
  window.finalizarCompra = finalizarCompra;
</script>
