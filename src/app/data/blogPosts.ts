export interface BlogPostData {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  content: Section[];
}

export interface Section {
  type: "paragraph" | "heading" | "subheading" | "list" | "tip" | "cta";
  text?: string;
  items?: string[];
}

export const blogPosts: BlogPostData[] = [
  {
    slug: "organizar-financas-mei",
    category: "Finanças",
    title: "Como organizar as finanças do seu MEI em 5 passos",
    excerpt:
      "Organizar as finanças do seu MEI não precisa ser complicado. Neste guia prático, mostramos como separar contas, categorizar despesas e criar uma rotina financeira que funciona.",
    author: "Equipe DashComigo",
    date: "15 Jan 2026",
    readTime: "7 min",
    content: [
      {
        type: "paragraph",
        text: "Um dos maiores desafios do microempreendedor individual é separar o que é dinheiro da empresa do que é dinheiro pessoal. Sem essa separação, fica impossível saber se o negócio está crescendo ou se você está gastando mais do que ganha. A boa notícia: com cinco passos simples, qualquer MEI pode montar uma rotina financeira sólida — sem precisar de contador ou planilha mirabolante.",
      },
      {
        type: "heading",
        text: "Passo 1: Separe as contas bancárias",
      },
      {
        type: "paragraph",
        text: "O primeiro passo é abrir uma conta corrente exclusiva para o CNPJ. Hoje existem bancos digitais que oferecem conta PJ gratuita para MEI, como Nubank, Mercado Pago, Inter e C6 Bank. Com contas separadas, você nunca mais vai misturar o pagamento do seu aluguel com o pagamento de um fornecedor.",
      },
      {
        type: "list",
        items: [
          "Nubank MEI: conta PJ gratuita, Pix ilimitado",
          "Inter MEI: cartão de crédito empresarial sem anuidade",
          "Mercado Pago: ideal para quem vende pelo Mercado Livre",
          "C6 Bank: cartão com cashback em compras empresariais",
        ],
      },
      {
        type: "heading",
        text: "Passo 2: Defina o seu pró-labore",
      },
      {
        type: "paragraph",
        text: "Pró-labore é o salário que você paga a si mesmo. Muitos MEIs cometem o erro de retirar dinheiro da empresa quando precisam, sem critério. Isso distorce completamente o resultado do negócio. Defina um valor fixo mensal — que seja sustentável para a empresa — e faça uma transferência formal da conta PJ para a conta PF todo mês.",
      },
      {
        type: "tip",
        text: "Dica: comece com 60% da sua receita média dos últimos 3 meses como pró-labore. Assim você garante folga para reinvestir no negócio.",
      },
      {
        type: "heading",
        text: "Passo 3: Categorize todas as despesas",
      },
      {
        type: "paragraph",
        text: "Cada saída de dinheiro precisa ter uma categoria: fornecedores, marketing, aluguel, ferramentas, impostos, etc. Essa categorização é o que vai te mostrar onde seu dinheiro está indo. Muitos MEIs descobrem, ao categorizar pela primeira vez, que gastam 3x mais com delivery de comida do que imaginavam — e que isso está saindo da conta da empresa.",
      },
      {
        type: "list",
        items: [
          "Custos diretos: o que você gasta para entregar seu produto/serviço",
          "Custos fixos: aluguel, internet, assinaturas mensais",
          "Custos variáveis: marketing, comissões, embalagens",
          "Impostos: DAS-MEI e outros tributos",
          "Retirada do proprietário: seu pró-labore",
        ],
      },
      {
        type: "heading",
        text: "Passo 4: Registre tudo em tempo real",
      },
      {
        type: "paragraph",
        text: "De nada adianta ter categorias se você lança as despesas só no final do mês — quando metade já esqueceu. O hábito mais poderoso que um MEI pode desenvolver é registrar cada entrada e saída no momento em que acontece. Leve 30 segundos para anotar cada transação. Ao final do mês, você vai ter uma fotografia fiel do seu negócio.",
      },
      {
        type: "tip",
        text: "Use o DashComigo para registrar transações pelo celular em segundos. A IA classifica automaticamente e ainda distingue despesas pessoais das empresariais.",
      },
      {
        type: "heading",
        text: "Passo 5: Revise os números toda semana",
      },
      {
        type: "paragraph",
        text: "Reserve 15 minutos toda segunda-feira para revisar o fluxo de caixa da semana anterior. Verifique: receita total, despesas totais, saldo, e se há alguma conta a pagar na semana. Esse ritual semanal é o que transforma dados em decisões. Você vai perceber rapidamente quando uma despesa aumentou sem justificativa, ou quando determinada categoria de clientes é mais lucrativa.",
      },
      {
        type: "heading",
        text: "Conclusão",
      },
      {
        type: "paragraph",
        text: "Organizar as finanças do MEI não exige diploma em contabilidade. Exige consistência: conta separada, pró-labore definido, categorias claras, lançamentos em tempo real e revisão semanal. Quem segue esses cinco passos tem clareza para tomar decisões, confiança para crescer e tranquilidade na hora de pagar o DAS-MEI.",
      },
    ],
  },
  {
    slug: "das-mei-guia-completo",
    category: "Tributário",
    title: "DAS-MEI: Tudo que você precisa saber para não perder o prazo",
    excerpt:
      "O DAS-MEI é a guia mensal obrigatória de todo microempreendedor individual. Entenda como calcular, quando pagar e as consequências de atrasar o pagamento.",
    author: "Equipe DashComigo",
    date: "22 Jan 2026",
    readTime: "8 min",
    content: [
      {
        type: "paragraph",
        text: "O Documento de Arrecadação do Simples Nacional — conhecido como DAS-MEI — é a guia mensal que todo microempreendedor individual precisa pagar para manter o CNPJ ativo e em dia. Parece simples, mas muitos MEIs acumulam dívidas por falta de informação ou por esquecerem os prazos. Este guia vai te explicar tudo o que você precisa saber.",
      },
      {
        type: "heading",
        text: "O que é o DAS-MEI?",
      },
      {
        type: "paragraph",
        text: "O DAS-MEI é um tributo unificado que inclui três contribuições em uma única guia: INSS (para garantir aposentadoria, auxílio-doença e outros benefícios), ISS (Imposto Sobre Serviços, para quem presta serviços) e ICMS (Imposto sobre Circulação de Mercadorias, para quem vende produtos). O valor varia conforme a atividade do MEI.",
      },
      {
        type: "heading",
        text: "Quanto custa em 2026?",
      },
      {
        type: "list",
        items: [
          "Comércio e Indústria: R$ 75,90 (INSS + ICMS)",
          "Serviços: R$ 79,90 (INSS + ISS)",
          "Comércio e Serviços: R$ 80,90 (INSS + ICMS + ISS)",
          "Caminhoneiro MEI: R$ 182,16 (alíquota diferenciada)",
        ],
      },
      {
        type: "tip",
        text: "O valor do INSS é calculado sobre o salário mínimo vigente (5% para MEI). Com o aumento do salário mínimo, o DAS pode mudar no início de cada ano.",
      },
      {
        type: "heading",
        text: "Quando pagar?",
      },
      {
        type: "paragraph",
        text: "O DAS-MEI deve ser pago até o dia 20 de cada mês, referente ao mês anterior. Ou seja: o DAS de janeiro vence no dia 20 de fevereiro. Se o dia 20 cair em fim de semana ou feriado, o vencimento se antecipa para o último dia útil anterior.",
      },
      {
        type: "heading",
        text: "Como emitir a guia?",
      },
      {
        type: "paragraph",
        text: "A emissão é gratuita e feita diretamente pelo Portal do Empreendedor (gov.br/mei). Você pode pagar via Pix, boleto bancário, débito em conta ou qualquer agência do Bradesco ou Banco do Brasil. Não precisa de contador para isso.",
      },
      {
        type: "list",
        items: [
          "Acesse gov.br/mei",
          "Clique em 'Já sou MEI' → 'Pagar DAS'",
          "Informe seu CNPJ",
          "Escolha o período de referência",
          "Gere o boleto ou código Pix",
          "Pague pelo seu banco",
        ],
      },
      {
        type: "heading",
        text: "O que acontece se atrasar?",
      },
      {
        type: "paragraph",
        text: "Atrasar o DAS tem consequências sérias. A multa por atraso começa em 0,33% ao dia (limitada a 20%) mais juros Selic. Mas o problema maior é acumular meses em aberto: após 12 meses de inadimplência, a Receita Federal pode cancelar o seu CNPJ. Sem CNPJ ativo, você perde acesso ao Simples Nacional, não consegue emitir nota fiscal e não tem direito aos benefícios do INSS.",
      },
      {
        type: "tip",
        text: "Se você está com meses em atraso, use o parcelamento disponível no portal do Simples Nacional (PGDAS). É possível parcelar em até 60 vezes.",
      },
      {
        type: "heading",
        text: "DASN-SIMEI: a declaração anual",
      },
      {
        type: "paragraph",
        text: "Além do DAS mensal, todo MEI precisa entregar a Declaração Anual do Simples Nacional (DASN-SIMEI) até o dia 31 de maio de cada ano. Essa declaração informa o faturamento total do ano anterior. Não entregar gera multa mínima de R$ 50,00 e pode levar ao cancelamento do CNPJ.",
      },
      {
        type: "heading",
        text: "Dicas para nunca esquecer",
      },
      {
        type: "list",
        items: [
          "Configure um lembrete recorrente no celular para o dia 18 de cada mês",
          "Separe o valor do DAS assim que receber a primeira receita do mês",
          "Use o DashComigo: ele notifica você sobre o vencimento do DAS automaticamente",
          "Considere o débito automático no seu banco para nunca atrasar",
        ],
      },
    ],
  },
  {
    slug: "mei-ou-me-quando-migrar",
    category: "Crescimento",
    title: "MEI ou ME: Quando é a hora de migrar?",
    excerpt:
      "Chegou um momento em que seu faturamento está próximo do limite do MEI? Descubra os sinais de que é hora de migrar para Microempresa e como fazer essa transição.",
    author: "Equipe DashComigo",
    date: "5 Fev 2026",
    readTime: "9 min",
    content: [
      {
        type: "paragraph",
        text: "O MEI foi criado para simplificar a vida de pequenos empreendedores — e funciona muito bem para quem está começando. Mas existe um limite: R$ 81.000 por ano (R$ 6.750 por mês). Quando você se aproxima desse teto, a questão inevitável surge: é hora de virar Microempresa (ME)? A resposta depende de vários fatores além do faturamento.",
      },
      {
        type: "heading",
        text: "O limite do MEI em detalhes",
      },
      {
        type: "paragraph",
        text: "O MEI permite faturamento de até R$ 81.000 por ano. Se você ultrapassar esse valor, tem até o dia 31 de dezembro para se enquadrar como ME. Caso contrário, a Receita Federal fará o desenquadramento automático, e você perderá os benefícios do MEI retroativamente — podendo ter que pagar impostos adicionais.",
      },
      {
        type: "tip",
        text: "Atenção: MEI que trabalha como caminhoneiro tem limite maior — R$ 251.600 por ano.",
      },
      {
        type: "heading",
        text: "5 sinais de que é hora de migrar",
      },
      {
        type: "list",
        items: [
          "Faturamento acima de R$ 5.500/mês por mais de 3 meses consecutivos",
          "Você precisa contratar funcionários (MEI só pode ter 1 funcionário)",
          "Clientes exigem nota fiscal com CNPJ diferente de MEI",
          "Você quer entrar em licitações ou vender para grandes empresas",
          "Sua atividade não está na lista de categorias permitidas ao MEI",
        ],
      },
      {
        type: "heading",
        text: "MEI x ME: as principais diferenças",
      },
      {
        type: "paragraph",
        text: "A Microempresa (ME) no Simples Nacional tem faturamento permitido de até R$ 360.000 por ano — mais de 4x o limite do MEI. Em compensação, a carga tributária é maior e a contabilidade é obrigatória. Vale comparar os custos antes de decidir.",
      },
      {
        type: "list",
        items: [
          "MEI: DAS fixo de R$ 75 a R$ 80/mês, sem contador obrigatório",
          "ME (Simples Nacional): alíquota de 4% a 19% sobre o faturamento",
          "ME: contador obrigatório (R$ 200 a R$ 600/mês em média)",
          "ME: pode ter múltiplos sócios e mais funcionários",
          "ME: acesso a mais linhas de crédito e financiamento",
        ],
      },
      {
        type: "heading",
        text: "Quanto a mais você vai pagar em impostos?",
      },
      {
        type: "paragraph",
        text: "Para uma ME de serviços com faturamento de R$ 120.000/ano (R$ 10.000/mês), a alíquota no Simples Nacional seria de aproximadamente 6%. Isso representa R$ 600/mês em impostos — contra R$ 79,90 do MEI. Somando o contador (R$ 300/mês), o custo extra é de cerca de R$ 820/mês. Se o seu negócio cresceu o suficiente para justificar isso, a migração vale muito a pena.",
      },
      {
        type: "tip",
        text: "Use o Simulador MEI→ME do DashComigo para calcular exatamente quanto você pagará de impostos após a migração, com base no seu faturamento atual.",
      },
      {
        type: "heading",
        text: "Como fazer a migração",
      },
      {
        type: "list",
        items: [
          "Escolha o tipo de empresa: ME, EIRELI ou Ltda. (recomendamos Ltda. pela proteção patrimonial)",
          "Contrate um contador — é obrigatório para ME",
          "Registre a empresa na Junta Comercial do seu estado",
          "Inscreva-se na Receita Federal para obter novo CNPJ",
          "Solicite inscrição estadual e municipal conforme a atividade",
          "Cancele o MEI no portal gov.br após a nova empresa estar ativa",
        ],
      },
      {
        type: "heading",
        text: "Quando não migrar",
      },
      {
        type: "paragraph",
        text: "Se seu faturamento elevado foi pontual — uma venda grande, um projeto específico — avalie antes de migrar. Um faturamento alto num único mês não significa que o negócio sustenta os custos de uma ME ao longo do ano. Monitore seu faturamento por pelo menos 6 meses antes de tomar a decisão.",
      },
    ],
  },
  {
    slug: "fluxo-de-caixa-mei",
    category: "Gestão",
    title: "Fluxo de caixa: o segredo do MEI bem-sucedido",
    excerpt:
      "Controlar o fluxo de caixa é a diferença entre um MEI que cresce e um que fecha as portas. Aprenda como monitorar entradas e saídas de forma simples e eficiente.",
    author: "Equipe DashComigo",
    date: "14 Fev 2026",
    readTime: "8 min",
    content: [
      {
        type: "paragraph",
        text: "Pesquisas mostram que 48% dos pequenos negócios fecham nos primeiros dois anos — e a principal causa não é falta de clientes, mas má gestão do fluxo de caixa. Um MEI pode ter muitos clientes e ainda assim quebrar se não souber quando o dinheiro entra e quando sai. Fluxo de caixa é a respiração do negócio: sem controle, você sufoca.",
      },
      {
        type: "heading",
        text: "O que é fluxo de caixa?",
      },
      {
        type: "paragraph",
        text: "Fluxo de caixa é o registro de toda movimentação financeira do seu negócio: cada real que entra (receitas) e cada real que sai (despesas), com as respectivas datas. Diferente do lucro — que é uma abstração contábil — o fluxo de caixa mostra a realidade: você tem dinheiro em conta hoje para pagar suas contas amanhã?",
      },
      {
        type: "heading",
        text: "Fluxo positivo x fluxo negativo",
      },
      {
        type: "paragraph",
        text: "Fluxo de caixa positivo significa que suas entradas superam as saídas no período. Negativo significa o contrário. Um MEI lucrativo no papel pode ter fluxo de caixa negativo — por exemplo, quando vende a prazo (recebe em 30/60 dias) mas paga fornecedores à vista. Esse descasamento de datas é uma das principais causas de crise financeira em pequenas empresas.",
      },
      {
        type: "tip",
        text: "Regra de ouro: negocie com fornecedores para pagar em prazos iguais ou maiores do que o prazo que você dá aos seus clientes.",
      },
      {
        type: "heading",
        text: "Como montar seu fluxo de caixa",
      },
      {
        type: "list",
        items: [
          "Liste todas as receitas esperadas para o mês, com as datas de recebimento",
          "Liste todas as despesas fixas (aluguel, internet, DAS-MEI)",
          "Liste as despesas variáveis previstas (compras de estoque, marketing)",
          "Calcule o saldo diário: saldo do dia anterior + entradas - saídas",
          "Identifique os dias com saldo negativo e planeje como cobrir",
        ],
      },
      {
        type: "heading",
        text: "Métricas que todo MEI deve acompanhar",
      },
      {
        type: "paragraph",
        text: "Não basta registrar — você precisa interpretar os dados. Existem quatro indicadores essenciais para qualquer MEI:",
      },
      {
        type: "list",
        items: [
          "Receita bruta: tudo que entrou no período",
          "Despesa total: tudo que saiu (incluindo impostos e pró-labore)",
          "Lucro líquido: receita bruta menos despesa total",
          "Margem de lucro: lucro líquido dividido pela receita bruta x 100",
        ],
      },
      {
        type: "tip",
        text: "Margem saudável para MEI de serviços: acima de 30%. Para comércio: acima de 15%. Abaixo disso, revise suas despesas ou reajuste seus preços.",
      },
      {
        type: "heading",
        text: "Erros clássicos que destroem o caixa",
      },
      {
        type: "list",
        items: [
          "Misturar conta PJ e PF (impossível saber o real custo do negócio)",
          "Não separar reserva para pagar o DAS-MEI",
          "Parcelar compras pessoais no cartão da empresa",
          "Não ter reserva de emergência (mínimo de 3 meses de despesas fixas)",
          "Dar desconto sem calcular o impacto na margem de lucro",
        ],
      },
      {
        type: "heading",
        text: "A rotina que transforma o caixa",
      },
      {
        type: "paragraph",
        text: "A diferença entre um MEI que sobrevive e um que prospera é uma rotina financeira consistente. Não precisa ser elaborada: 5 minutos por dia para registrar as transações do dia, 15 minutos às segundas para revisar a semana, e uma análise mensal de 30 minutos para avaliar tendências e ajustar o rumo.",
      },
      {
        type: "paragraph",
        text: "Com o DashComigo, você registra cada transação em segundos pelo celular, a IA classifica automaticamente e os gráficos de fluxo de caixa são gerados em tempo real. Sua rotina financeira cabe no bolso.",
      },
    ],
  },
];

export function getPostBySlug(slug: string): BlogPostData | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
