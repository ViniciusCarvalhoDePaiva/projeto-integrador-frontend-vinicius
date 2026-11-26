/*
 * TEMA: Mini-analisador de Planos de Streaming (Comparador de Planos de Streaming)
 * ENTRADA: Orçamento mensal máximo informado pelo usuário via prompt() e comandos no laço de consulta.
 * PROCESSAMENTO: Validar a entrada numérica, classificar cada plano por faixa de preço (if/else if/else),
 *                gerar mensagem por categoria (switch), calcular total, média, quantidade dentro do orçamento
 *                e o plano mais caro (for...of), além de permitir consultas repetidas até digitar "sair".
 * SAÍDA ESPERADA: Relatório no console com template literals e tabela formatada via console.table().
 *
 * PSEUDOCÓDIGO:
 * 1. Declarar lista com 5 planos de streaming (nome, preco, telas, categoria).
 * 2. Ler orçamento máximo com prompt(), converter com Number() e validar (null, vazio, NaN, faixa).
 * 3. Percorrer os planos com for...of: classificar faixa de preço, avaliar categoria no switch e acumular totais.
 * 4. Calcular a média de preços e identificar o plano mais caro.
 * 5. Exibir resumo com template literals e tabela com console.table().
 * 6. Abrir laço do...while para consultar planos por nome até o usuário digitar "sair".
 */

// 1. Dados: array com 5 objetos e 4 propriedades cada (camelCase e sem acentos)
const catalogoPlanos = [
    { nome: 'Amazon Prime Video', preco: 19.90, telas: 3, categoria: 'economico' },
    { nome: 'Netflix Padrao com Anuncios', preco: 20.90, telas: 2, categoria: 'economico' },
    { nome: 'Max Padrao', preco: 39.90, telas: 2, categoria: 'intermediario' },
    { nome: 'Disney+ Padrao', preco: 43.90, telas: 2, categoria: 'intermediario' },
    { nome: 'Netflix Premium 4K', preco: 59.90, telas: 4, categoria: 'premium' }
];

// 2. Entrada com prompt(), conversão com Number() e validação completa
const entradaOrcamento = prompt('Informe seu orçamento mensal máximo para streaming (entre R$ 15 e R$ 200):');

let orcamentoMaximo = 40; // valor padrão caso a entrada seja inválida

if (entradaOrcamento === null || entradaOrcamento.trim() === '') {
    console.warn('Entrada cancelada ou vazia. Usando orçamento padrão de R$ 40,00.');
} else {
    const valorConvertido = Number(entradaOrcamento);
    if (Number.isNaN(valorConvertido) || valorConvertido < 15 || valorConvertido > 200) {
        console.warn('Valor inválido ou fora da faixa (15 a 200). Usando orçamento padrão de R$ 40,00.');
    } else {
        orcamentoMaximo = valorConvertido;
    }
}

// 3. Processamento com for...of (classificação, switch, contador, acumulador e máximo)
let totalPrecos = 0;
let planosDentroOrcamento = 0;
let planoMaisCaro = catalogoPlanos[0];
const relatorioAnalise = [];

for (const item of catalogoPlanos) {
    // Classificação em 3 faixas com if / else if / else (ordem crescente)
    let faixaPreco = '';
    if (item.preco <= 25) {
        faixaPreco = 'Acessível';
    } else if (item.preco <= 45) {
        faixaPreco = 'Intermediário';
    } else {
        faixaPreco = 'Alto Custo';
    }

    // Comparação estrita com === para verificar se cabe no orçamento
    const cabeNoOrcamento = item.preco <= orcamentoMaximo;
    if (cabeNoOrcamento === true) {
        planosDentroOrcamento++;
    }

    // switch sobre propriedade de texto com break em todos os cases e default
    let perfilIndicado = '';
    switch (item.categoria) {
        case 'economico':
            perfilIndicado = 'Ideal para quem quer economizar no dia a dia.';
            break;
        case 'intermediario':
            perfilIndicado = 'Equilíbrio entre catálogo variado e preço.';
            break;
        case 'premium':
            perfilIndicado = 'Indicado para famílias e qualidade 4K.';
            break;
        default:
            perfilIndicado = 'Categoria não identificada.';
    }

    // Acumulador e busca pelo maior preço
    totalPrecos += item.preco;
    if (item.preco > planoMaisCaro.preco) {
        planoMaisCaro = item;
    }

    relatorioAnalise.push({
        Plano: item.nome,
        Preco: `R$ ${item.preco.toFixed(2)}`,
        Telas: item.telas,
        Faixa: faixaPreco,
        DentroDoOrcamento: cabeNoOrcamento ? 'Sim' : 'Não',
        Perfil: perfilIndicado
    });
}

const mediaPrecos = totalPrecos / catalogoPlanos.length;

// 4. Exibição dos resultados com template literals e console.table()
console.log(`=== Análise de Planos (Orçamento: R$ ${orcamentoMaximo.toFixed(2)}) ===`);
console.log(`Total de planos analisados: ${catalogoPlanos.length}`);
console.log(`Planos dentro do seu orçamento: ${planosDentroOrcamento}`);
console.log(`Média de preço mensal: R$ ${mediaPrecos.toFixed(2)}`);
console.log(`Plano mais caro: ${planoMaisCaro.nome} (R$ ${planoMaisCaro.preco.toFixed(2)})`);
console.table(relatorioAnalise);

// 5. Laço do...while com condição de saída atualizada internamente
let comando = '';
do {
    const resposta = prompt('Digite o nome de um serviço para consultar (ex: Netflix) ou digite "sair" para encerrar:');
    comando = (resposta ?? 'sair').trim().toLowerCase();

    if (comando !== 'sair' && comando !== '') {
        let encontrado = false;
        for (const item of catalogoPlanos) {
            if (item.nome.toLowerCase().includes(comando)) {
                console.log(`Consulta: ${item.nome} custa R$ ${item.preco.toFixed(2)} (${item.telas} telas).`);
                encontrado = true;
            }
        }
        if (encontrado === false) {
            console.log(`Nenhum plano encontrado com o termo "${comando}".`);
        }
    }
} while (comando !== 'sair');

/*
 * TESTE DE MESA (3 primeiras voltas do laço principal for...of com orcamentoMaximo = 40):
 * ---------------------------------------------------------------------------------------------------------
 * | Volta | item.nome                   | item.preco | faixaPreco    | planosDentroOrcamento | totalPrecos |
 * ---------------------------------------------------------------------------------------------------------
 * |   1   | Amazon Prime Video          | 19.90      | Acessível     | 1                     | 19.90       |
 * |   2   | Netflix Padrao com Anuncios | 20.90      | Acessível     | 2                     | 40.80       |
 * |   3   | Max Padrao                  | 39.90      | Intermediário | 3                     | 80.70       |
 * ---------------------------------------------------------------------------------------------------------
 */