// =========================================================
// AULA 11: FUNÇÕES, MÉTODOS DE ARRAY (map/filter/reduce) E DOM
// =========================================================

// 1. Dados: array com 5 objetos (camelCase e sem acentos, sem repetir nomes de logica.js)
const planosStreaming = [
    { nome: 'Amazon Prime Video', precoMensal: 19.90, telas: 3, categoria: 'economico' },
    { nome: 'Netflix Padrao com Anuncios', precoMensal: 20.90, telas: 2, categoria: 'economico' },
    { nome: 'Netflix Premium 4K', precoMensal: 59.90, telas: 4, categoria: 'premium' },
    { nome: 'Max Padrao', precoMensal: 39.90, telas: 2, categoria: 'intermediario' },
    { nome: 'Disney+ Padrao', precoMensal: 43.90, telas: 2, categoria: 'intermediario' }
];

// ---------------------------------------------------------
// FUNÇÕES DE CÁLCULO E CLASSIFICAÇÃO (puras, sem mexer no DOM)
// ---------------------------------------------------------

// Função 1: processa/calcula o custo por tela (com parâmetro padrão e return)
function calcularCustoPorTela(precoMensal, telas = 1) {
    return Number((precoMensal / telas).toFixed(2));
}

// Função 2: classifica o custo por tela em 3 faixas (ordem crescente)
function classificarCustoBeneficio(custoPorTela) {
    if (custoPorTela <= 12) {
        return { rotulo: 'Ótimo Custo-Benefício', classe: 'faixa-otima' };
    } else if (custoPorTela <= 20) {
        return { rotulo: 'Custo-Benefício Moderado', classe: 'faixa-moderada' };
    } else {
        return { rotulo: 'Custo Elevado por Tela', classe: 'faixa-elevada' };
    }
}

// ---------------------------------------------------------
// MÉTODOS DE ARRAY: map, filter e reduce
// ---------------------------------------------------------

// map: gera uma nova lista enriquecida sem alterar planosStreaming
const planosAnalisados = planosStreaming.map((plano) => {
    const custoPorTela = calcularCustoPorTela(plano.precoMensal, plano.telas);
    const classificacao = classificarCustoBeneficio(custoPorTela);

    return {
        nome: plano.nome,
        precoMensal: plano.precoMensal,
        telas: plano.telas,
        custoPorTela,
        rotulo: classificacao.rotulo,
        classe: classificacao.classe
    };
});

// filter: separa apenas os planos com ótimo custo-benefício
const planosOtimos = planosAnalisados.filter((item) => item.classe === 'faixa-otima');

// reduce: soma o custo por tela para calcular a média geral
const somaCustoPorTela = planosAnalisados.reduce((acumulador, item) => acumulador + item.custoPorTela, 0);
const mediaCustoPorTela = somaCustoPorTela / planosAnalisados.length;

// ---------------------------------------------------------
// FUNÇÃO DE DOM (montagem e inserção na página)
// ---------------------------------------------------------

// Função 3: cria o card de um item usando createElement, textContent e classList
function criarCardResultado(item) {
    const artigo = document.createElement('article');
    artigo.classList.add('item-resultado', item.classe);

    const titulo = document.createElement('h3');
    titulo.textContent = item.nome;

    const detalhes = document.createElement('p');
    detalhes.textContent = `R$ ${item.precoMensal.toFixed(2)}/mês • ${item.telas} telas (R$ ${item.custoPorTela.toFixed(2)} por tela)`;

    const selo = document.createElement('span');
    selo.classList.add('selo-faixa');
    selo.textContent = item.rotulo;

    artigo.append(titulo, detalhes, selo);
    return artigo;
}

// Seleciona a área de resultado e verifica se existe antes de manipular
const areaResultado = document.querySelector('#resultado');

if (areaResultado !== null) {
    const listaCards = document.createElement('div');
    listaCards.classList.add('grade-resultados');

    // Insere um elemento por item com append
    for (const item of planosAnalisados) {
        const card = criarCardResultado(item);
        listaCards.append(card);
    }

    // Linha de resumo gerada a partir do reduce e do filter
    const resumo = document.createElement('p');
    resumo.classList.add('resumo-analise');
    resumo.textContent = `Resumo: Média de R$ ${mediaCustoPorTela.toFixed(2)} por tela entre ${planosAnalisados.length} planos analisados (${planosOtimos.length} classificados como Ótimo Custo-Benefício).`;

    areaResultado.append(listaCards, resumo);
} else {
    console.warn('Elemento #resultado não encontrado no HTML.');
}