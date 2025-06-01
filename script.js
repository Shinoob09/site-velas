
  const getEl = (id) => document.getElementById(id) || null;
  const listaProdutos = getEl("lista-produtos");
  const modal = getEl("modal");
  const modalTitulo = getEl("modal-titulo");
  const modalDesc = getEl("modal-desc");
  const modalPreco = getEl("modal-preco");
  const modalImg = getEl("modal-img");
  const itensCarrinho = getEl("itens-carrinho");
  const contador = getEl("contador-carrinho");
  const totalCarrinho = getEl("total-carrinho");
  const carrinho = getEl("carrinho");

  let carrinhoAtual = {};
  let produtoSelecionado = null;

  const produtos = [
    {
      id: 1,
      nome: 'Vela Lavanda',
      desc: 'Relaxante, feita com óleos essenciais de lavanda para promover calma e bem-estar. Duração aproximada de 40 horas.',
      preco: 52.50,
      imagem: 'https://ideogram.ai/assets/image/lossless/response/AbW1Vk1pRneuPOwcBCXWzg'
    },
    {
      id: 2,
      nome: 'Perfume Floral',
      desc: 'Fragrância delicada com notas de jasmim e lírio do campo. Perfeito para o dia a dia. Fixação de 6-8 horas.',
      preco: 45.90,
      imagem: 'https://ideogram.ai/assets/image/lossless/response/V8euh8QjT5WiJxiWpboXOA'
    },
    {
      id: 3,
      nome: 'Vela de Baunilha',
      desc: 'Aroma doce e acolhedor que traz sensação de conforto e aconchego. Duração aproximada de 35 horas.',
      preco: 22.00,
      imagem: 'https://ideogram.ai/assets/progressive-image/balanced/response/8qm8Urb-SbiCwZNvmJLxmw'
    },
    {
      id: 4,
      nome: 'Perfume Amadeirado',
      desc: 'Fragrância elegante com base de sândalo e cedro, ideal para ocasiões especiais. Fixação de 8-10 horas.',
      preco: 58.00,
      imagem: 'https://ideogram.ai/assets/image/lossless/response/cihjylx_RAOuvcvayyZ_tw'
    }
  ];

  document.addEventListener('DOMContentLoaded', () => {
    try {
      const carrinhoSalvo = localStorage.getItem("carrinho");
      if (carrinhoSalvo) carrinhoAtual = JSON.parse(carrinhoSalvo);
    } catch {
      carrinhoAtual = {};
    }

    renderizarProdutos();
    atualizarCarrinho();

    modal?.addEventListener('click', (e) => {
      if (e.target === modal) fecharModal();
    });

    document.addEventListener('click', (e) => {
      if (
        carrinho?.style.display === "block" &&
        !e.target.closest(".carrinho") &&
        !e.target.closest(".carrinho-icon")
      ) {
        carrinho.style.display = "none";
      }
    });
  });

  function renderizarProdutos() {
    if (!listaProdutos) return;
    listaProdutos.innerHTML = produtos.map((produto, index) => `
      <div class="produto" onclick="mostrarDetalhes(${index})">
        <img src="${produto.imagem}" alt="${produto.nome}" loading="lazy">
        <h3>${produto.nome}</h3>
        <p>R$ ${produto.preco.toFixed(2)}</p>
        <button class="botao-comprar" onclick="event.stopPropagation();mostrarDetalhes(${index})">Ver Detalhes</button>
      </div>
    `).join('');
  }

  function mostrarDetalhes(index) {
    const p = produtos[index];
    if (!p) return;

    produtoSelecionado = p;
    modalTitulo.textContent = p.nome;
    modalDesc.textContent = p.desc;
    modalPreco.textContent = `R$ ${p.preco.toFixed(2)}`;
    modalImg.src = p.imagem;
    modalImg.alt = p.nome;
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
  }

  function fecharModal() {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }

  function adicionarAoCarrinho() {
    if (!produtoSelecionado) return;
    const { id } = produtoSelecionado;

    if (carrinhoAtual[id]) {
      carrinhoAtual[id].quantidade++;
    } else {
      carrinhoAtual[id] = { ...produtoSelecionado, quantidade: 1 };
    }

    document.querySelector('.carrinho-icon')?.classList.add("pulse");
    setTimeout(() => {
      document.querySelector('.carrinho-icon')?.classList.remove("pulse");
    }, 300);

    localStorage.setItem("carrinho", JSON.stringify(carrinhoAtual));
    atualizarCarrinho();
    fecharModal();
  }

  function atualizarCarrinho() {
    if (!itensCarrinho || !contador || !totalCarrinho) return;

    itensCarrinho.innerHTML = "";
    let total = 0;
    let count = 0;

    for (const id in carrinhoAtual) {
      const item = carrinhoAtual[id];
      const li = document.createElement("li");
      li.innerHTML = `
        <div>
          <strong>${item.nome}</strong>
          <small>R$ ${item.preco.toFixed(2)} × ${item.quantidade}</small>
        </div>
        <div>
          <button onclick="alterarQuantidade(${id}, -1, event)">−</button>
          <button onclick="alterarQuantidade(${id}, 1, event)">+</button>
          <button onclick="removerItem(${id}, event)">×</button>
        </div>
      `;
      itensCarrinho.appendChild(li);
      total += item.preco * item.quantidade;
      count += item.quantidade;
    }

    totalCarrinho.textContent = total.toFixed(2);
    contador.textContent = count;

    if (count === 0 && carrinho.style.display === "block") {
      carrinho.style.display = "none";
    }
  }

  function alterarQuantidade(id, delta, event) {
    event?.stopPropagation();
    const item = carrinhoAtual[id];
    if (!item) return;

    item.quantidade += delta;

    if (item.quantidade <= 0) {
      delete carrinhoAtual[id];
    }

    localStorage.setItem("carrinho", JSON.stringify(carrinhoAtual));
    atualizarCarrinho();
  }

  function removerItem(id, event) {
    event?.stopPropagation();
    delete carrinhoAtual[id];
    localStorage.setItem("carrinho", JSON.stringify(carrinhoAtual));
    atualizarCarrinho();
  }

  function toggleCarrinho() {
    if (Object.keys(carrinhoAtual).length === 0) {
      carrinho.style.display = "none";
      alert("Seu carrinho está vazio!");
      return;
    }
    carrinho.style.display =
      carrinho.style.display === "block" ? "none" : "block";
  }

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

    try {
      await db.collection("pedidos").add(pedido);
    } catch (erro) {
      console.error("Erro ao salvar pedido no Firebase:", erro);
      alert("Erro ao salvar o pedido. Tente novamente.");
      return;
    }

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

    const telegramMessage = `
🧾 *Novo Pedido VerdiLume*
👤 *Nome:* ${nome}
🏠 *Endereço:* ${endereco}
📞 *Telefone:* ${telefone}
📦 *Itens:* ${itens}
💰 *Total:* R$${total}
`.trim();

    const telegramToken = "7635965015:AAGcOEt7lMgxmlG8C8FxPhCh2vDMnIk5Rpg";
    const chatId = "5688730032";
    const url = `https://api.telegram.org/bot${telegramToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(telegramMessage)}&parse_mode=Markdown`;

    fetch(url)
      .then(() => console.log("Pedido enviado pro Telegram"))
      .catch(err => console.error("Erro ao enviar Telegram:", err));

    localStorage.setItem("ultimoPedido", JSON.stringify(pedido));
    localStorage.removeItem("carrinho");

    setTimeout(() => {
      window.location.href = "confirmacao.html";
    }, 1000);
  }

  window.finalizarCompra = finalizarCompra;

