// =========================================================
// AULA 12: DOM APROFUNDADO, EVENTOS E DELEGAÇÃO
// =========================================================

// 1. Fonte de verdade: array de objetos com id e 4+ propriedades
const planosStreaming = [
    { id: 1, nome: 'Amazon Prime Video', precoMensal: 19.90, telas: 3, favorito: false },
    { id: 2, nome: 'Netflix Padrao com Anuncios', precoMensal: 20.90, telas: 2, favorito: false },
    { id: 3, nome: 'Netflix Premium 4K', precoMensal: 59.90, telas: 4, favorito: false },
    { id: 4, nome: 'Max Padrao', precoMensal: 39.90, telas: 2, favorito: false },
    { id: 5, nome: 'Disney+ Padrao', precoMensal: 43.90, telas: 2, favorito: false }
];

let proximoId = 6;

// ---------------------------------------------------------
// FUNÇÕES PURAS (cálculo e classificação, sem mexer no DOM)
// ---------------------------------------------------------

function calcularCustoPorTela(precoMensal, telas = 1) {
    return Number((precoMensal / telas).toFixed(2));
}

function classificarCustoBeneficio(custoPorTela) {
    if (custoPorTela <= 12) {
        return { rotulo: 'Ótimo Custo-Benefício', classe: 'faixa-otima' };
    } else if (custoPorTela <= 20) {
        return { rotulo: 'Custo-Benefício Moderado', classe: 'faixa-moderada' };
    } else {
        return { rotulo: 'Custo Elevado por Tela', classe: 'faixa-elevada' };
    }
}

function calcularResumo(listaFiltrada) {
    const total = listaFiltrada.length;
    const favoritos = listaFiltrada.filter((item) => item.favorito).length;
    const somaCusto = listaFiltrada.reduce(
        (acc, item) => acc + calcularCustoPorTela(item.precoMensal, item.telas),
        0
    );
    const media = total > 0 ? somaCusto / total : 0;

    return { total, favoritos, media };
}

// ---------------------------------------------------------
// FUNÇÕES DE DOM (criação segura com textContent e redesenho)
// ---------------------------------------------------------

function criarItemLista(plano) {
    const custoPorTela = calcularCustoPorTela(plano.precoMensal, plano.telas);
    const classificacao = classificarCustoBeneficio(custoPorTela);

    const li = document.createElement('li');
    li.classList.add('item-resultado', classificacao.classe);
    if (plano.favorito) {
        li.classList.add('item-favorito');
    }
    li.dataset.id = String(plano.id);

    const titulo = document.createElement('h3');
    titulo.textContent = plano.nome;

    const detalhes = document.createElement('p');
    detalhes.textContent = `R$ ${plano.precoMensal.toFixed(2)}/mês • ${plano.telas} telas (R$ ${custoPorTela.toFixed(2)}/tela)`;

    const selo = document.createElement('span');
    selo.classList.add('selo-faixa');
    selo.textContent = classificacao.rotulo;

    const acoes = document.createElement('div');
    acoes.classList.add('acoes-item');

    const btnFavorito = document.createElement('button');
    btnFavorito.type = 'button';
    btnFavorito.classList.add('btn-acao');
    btnFavorito.dataset.acao = 'favoritar';
    btnFavorito.setAttribute('aria-pressed', String(plano.favorito));
    btnFavorito.textContent = plano.favorito ? '★ Favorito' : '☆ Favoritar';

    const btnRemover = document.createElement('button');
    btnRemover.type = 'button';
    btnRemover.classList.add('btn-acao', 'btn-remover');
    btnRemover.dataset.acao = 'remover';
    btnRemover.textContent = 'Remover';

    acoes.append(btnFavorito, btnRemover);
    li.append(titulo, detalhes, selo, acoes);

    return li;
}

function atualizarResumoDOM(listaFiltrada) {
    const resumoEl = document.querySelector('#resumo-interativo');
    if (resumoEl === null) return;

    const { total, favoritos, media } = calcularResumo(listaFiltrada);
    resumoEl.textContent = `A mostrar ${total} plano(s) • ${favoritos} favorito(s) • Média de R$ ${media.toFixed(2)} por tela.`;
}

function desenhar() {
    const listaEl = document.querySelector('#lista-planos');
    const campoBusca = document.querySelector('#busca-planos');
    if (listaEl === null) return;

    const termo = campoBusca ? campoBusca.value.trim().toLowerCase() : '';
    const filtrados = planosStreaming.filter((plano) =>
        plano.nome.toLowerCase().includes(termo)
    );

    const elementos = filtrados.map((plano) => criarItemLista(plano));
    listaEl.replaceChildren(...elementos);

    atualizarResumoDOM(filtrados);
}

// ---------------------------------------------------------
// OUVINTES NOMEADOS E INICIALIZAÇÃO POR RECURSO
// ---------------------------------------------------------

function tratarCliqueLista(evento) {
    const botao = evento.target.closest('button[data-acao]');
    if (botao === null) return;

    const itemLi = botao.closest('li[data-id]');
    if (itemLi === null) return;

    const idAlvo = Number(itemLi.dataset.id);
    const acao = botao.dataset.acao;

    if (acao === 'favoritar') {
        const plano = planosStreaming.find((p) => p.id === idAlvo);
        if (plano) {
            plano.favorito = !plano.favorito;
            desenhar();
        }
    } else if (acao === 'remover') {
        const indice = planosStreaming.findIndex((p) => p.id === idAlvo);
        if (indice !== -1) {
            planosStreaming.splice(indice, 1);
            desenhar();
        }
    }
}

function iniciarDelegacaoLista() {
    const listaEl = document.querySelector('#lista-planos');
    if (listaEl !== null) {
        listaEl.addEventListener('click', tratarCliqueLista);
    }
}

function iniciarBusca() {
    const campoBusca = document.querySelector('#busca-planos');
    if (campoBusca !== null) {
        campoBusca.addEventListener('input', desenhar);
    }
}

function alternarPainelNovoPlano() {
    const btnToggle = document.querySelector('#btn-toggle-novo-plano');
    const painel = document.querySelector('#painel-novo-plano');
    if (btnToggle === null || painel === null) return;

    const estavaAberto = btnToggle.getAttribute('aria-expanded') === 'true';
    const novoEstado = !estavaAberto;

    btnToggle.setAttribute('aria-expanded', String(novoEstado));
    painel.hidden = !novoEstado;
}

function tratarTeclaEscape(evento) {
    if (evento.key !== 'Escape') return;

    const btnToggle = document.querySelector('#btn-toggle-novo-plano');
    const painel = document.querySelector('#painel-novo-plano');
    if (btnToggle === null || painel === null) return;

    if (btnToggle.getAttribute('aria-expanded') === 'true') {
        btnToggle.setAttribute('aria-expanded', 'false');
        painel.hidden = true;
        btnToggle.focus();
    }
}

function tratarEnvioNovoPlano(evento) {
    evento.preventDefault();

    const inputNome = document.querySelector('#novo-plano-nome');
    const inputPreco = document.querySelector('#novo-plano-preco');
    const inputTelas = document.querySelector('#novo-plano-telas');

    const nome = inputNome.value.trim();
    const precoMensal = Number(inputPreco.value);
    const telas = Number(inputTelas.value);

    if (nome === '' || Number.isNaN(precoMensal) || precoMensal <= 0 || Number.isNaN(telas) || telas < 1) {
        return;
    }

    planosStreaming.push({
        id: proximoId++,
        nome,
        precoMensal,
        telas,
        favorito: false
    });

    evento.target.reset();
    desenhar();
}

function iniciarPainelNovoPlano() {
    const btnToggle = document.querySelector('#btn-toggle-novo-plano');
    const formNovo = document.querySelector('#form-novo-plano');

    if (btnToggle !== null) {
        btnToggle.addEventListener('click', alternarPainelNovoPlano);
    }

    document.addEventListener('keydown', tratarTeclaEscape);

    if (formNovo !== null) {
        formNovo.addEventListener('submit', tratarEnvioNovoPlano);
    }
}

// Inicialização da página
iniciarDelegacaoLista();
iniciarBusca();
iniciarPainelNovoPlano();
desenhar();