
export interface NewsItem {
    id: string;
    title: string;
    excerpt?: string;
    content?: string;
    image: string | null;
    gallery?: string[];
    category: string;
    author?: string;
    publishedAt?: string;
    date?: string; // Para compatibilidade com app/page.tsx
}

export const allNews: NewsItem[] = [
    {
        id: 'vitoria-regata-historica',
        title: 'Equipe do SCN conquista ouro na Regata Histórica do Nordeste',
        excerpt: 'Nossos atletas brilharam no pódio, trazendo o ouro para casa após uma disputa emocionante no Rio Potengi.',
        content: `Foi um dia de glória para o Sport Club de Natal! Nossa equipe principal conquistou o primeiro lugar na tradicional Regata Histórica do Nordeste, disputada neste fim de semana.

Com um desempenho impecável, o barco "Oito Com" cruzou a linha de chegada com uma vantagem confortável sobre os adversários, reafirmando a força do remo potiguar.

"Essa vitória é fruto de meses de dedicação intensa. O grupo estava focado e a sintonia no barco foi perfeita", declarou o capitão da equipe. A celebração no pódio foi marcada pela emoção, com nossos atletas exibindo orgulhosamente as medalhas de ouro e as cores vermelho e preto do nosso clube.`,
        image: '/news/news_regata_vitoria.png',
        gallery: [],
        category: 'Competição',
        author: 'Assessoria SCN',
        publishedAt: '2026-01-02',
    },
    {
        id: 'novo-tecnico-2026',
        title: 'Sport Club de Natal anuncia novo coordenador técnico para a base',
        excerpt: 'Com foco na formação de novos talentos, o clube reforça sua equipe técnica visando os Jogos de 2028.',
        content: `O Sport Club de Natal tem o prazer de anunciar a contratação do novo coordenador técnico para nossas categorias de base. Com vasta experiência na formação de atletas olímpicos, ele chega com a missão de identificar e lapidar as joias do remo potiguar.

"O potencial humano aqui é incrível. O biotipo dos jovens e a condição natural do Rio Potengi formam o cenário ideal para formarmos campeões", afirmou o novo técnico em sua apresentação.

Os treinos sob o novo comando já começam na próxima semana, com foco total na preparação técnica e física dos jovens atletas.`,
        image: '/news/news_novo_tecnico.png',
        gallery: [],
        category: 'Clube',
        author: 'Diretoria SCN',
        publishedAt: '2026-01-01',
    },
    {
        id: 'restauracao-classico',
        title: 'O Renascimento de um Clássico: Barco de 1923 totalmente restaurado',
        excerpt: 'Após meses de trabalho artesanal, uma das embarcações mais antigas do clube volta a brilhar na garagem.',
        content: `A oficina do Sport Club de Natal entregou hoje uma verdadeira obra de arte: a restauração completa de um Single Skiff de madeira datado de 1923.

O trabalho minucioso de lixamento, envernizamento e pintura recuperou o brilho original da madeira e os detalhes em vermelho e preto que marcam a identidade do clube.

"Não é apenas um barco, é um pedaço da nossa história que preservamos para as futuras gerações", disse o diretor de patrimônio. O barco ficará em exposição no hall de entrada do clube antes de voltar para a água em ocasiões especiais.`,
        image: '/news/news_reforma_barco.png',
        gallery: [],
        category: 'Patrimônio',
        author: 'Memória SCN',
        publishedAt: '2025-12-30',
    },
    {
        id: 'parceria-escolas-publicas',
        title: 'Projeto "Remando para o Futuro" fecha parceria com escolas estaduais',
        excerpt: 'Mais de 200 alunos da rede pública terão acesso a aulas gratuitas de remo e cidadania no Sport Club de Natal.',
        content: `O esporte como ferramenta de transformação social. É com esse espírito que o Sport Club de Natal oficializou hoje a expansão do projeto "Remando para o Futuro" em parceria com três escolas estaduais da região.

O convênio permitirá que alunos contraturno escolar participem de aulas de iniciação ao remo, além de receberem acompanhamento pedagógico e nutricional.

"Queremos democratizar o acesso ao nosso esporte e, quem sabe, descobrir novos campeões olímpicos entre esses jovens", celebrou a presidente do clube. As inscrições começam no próximo mês na secretaria do clube.`,
        image: '/news/news_parceria_escola.png',
        gallery: [],
        category: 'Social',
        author: 'Responsabilidade Social',
        publishedAt: '2025-12-28',
    },
    {
        id: 'calendario-competicoes-2026',
        title: 'Divulgado o Calendário Oficial de Competições para 2026',
        excerpt: 'Preparem-se! A temporada 2026 promete ser a mais disputada dos últimos anos com novas regatas estaduais.',
        content: `A Federação Norte-rio-grandense de Remo, em conjunto com os clubes filiados, divulgou o calendário oficial para a temporada 2026. O Sport Club de Natal sediará três das principais etapas do campeonato estadual.

A grande novidade deste ano é a inclusão da "Regata Noturna do Potengi", um evento inédito que promete iluminar as águas do nosso rio.

Os atletas já intensificaram os treinos visando a estreia da temporada, marcada para fevereiro. Confira o calendário completo no nosso site e venha torcer pelo Vermelho e Preto!`,
        image: '/news/news_calendario_2026.png',
        gallery: [],
        category: 'Competição',
        author: 'Departamento de Esportes',
        publishedAt: '2025-12-26',
    },
    {
        id: '110-anos',
        title: 'O Sport Club de Natal dá início às comemorações pelos 110 anos de história',
        excerpt: 'O Sport Club de Natal iniciou hoje as atividades em celebração aos seus 110 anos de existência. A joia rara do nosso clube, o barco “Oito Com”, desfilou pelo Rio Potengi.',
        content: `O Sport Club de Natal iniciou hoje as atividades em celebração aos seus 110 anos de existência.

A joia rara do nosso clube — o barco “Oito Com”, de fabricação italiana — desfilou de forma imponente pelas águas do Rio Potengi, encantando a todos que acompanharam esse momento histórico.

O “Oito Com” chegou ao Sport Club graças ao empenho de Geraldo Belo Moreno, considerado um dos maiores nomes da história do remo potiguar, em parceria com Rodney Bernardes, então presidente da Confederação Brasileira de Remo (CBR).

O barco foi batizado com o nome de Marcos Vinicio da Costa Moreno, filho de Geraldo e ex-remador do clube. Após um cuidadoso processo de revitalização, o barco voltou a navegar no último dia 4 de outubro, em um lançamento experimental que marcou seu retorno triunfante às águas do Potengi.

Acompanhe nossas redes sociais para saber mais sobre as próximas datas de comemoração dos 110 anos do Gigante do Potengi!`,
        image: '/rowers_sunset.jpg',
        gallery: [],
        category: 'História',
        author: 'Assessoria SCN',
        publishedAt: '2025-12-23',
    },
    {
        id: 'rio-de-esperanca',
        title: 'Sport Club de Natal convida para o lançamento do Projeto Rio de Esperança',
        excerpt: 'Projeto social desenvolvido no Rio Potengi atenderá 56 crianças e adolescentes com aulas de Remo Olímpico no contraturno escolar.',
        content: `É com imensa satisfação que o Sport Club de Natal convida toda a comunidade para o evento de lançamento do Projeto Rio de Esperança.

Este é um projeto que tem como CONCEDENTE o Governo do RN (@governodorn) através da Secretaria de Esporte e Lazer (@esportelazerrn) e como empresa PATROCINADORA a Potigás (@potigasrn).

Desenvolvido às margens do Rio Potengi, o Projeto Rio de Esperança atenderá 56 crianças e adolescentes, de ambos os sexos, prioritariamente em situação de vulnerabilidade social.

O projeto oferecerá o desenvolvimento do Remo Olímpico nos turnos matutinos e vespertinos, funcionando no contraturno escolar dos(as) beneficiários(as), promovendo inclusão social através do esporte.`,
        image: '/news_rio_esperanca.png',
        category: 'Social',
        author: 'Assessoria SCN',
        publishedAt: '2025-12-23',
    },
    {
        id: 'cbi-remo-2025',
        title: 'Sport Club de Natal encerra participação histórica no CBI de Remo',
        excerpt: 'Nossos atletas deram o seu melhor no Rio de Janeiro, mostrando garra, disciplina e verdadeiro espírito de equipe.',
        content: `Encerramos mais uma jornada incrível! 🔴⚫️

O Sport Club de Natal finaliza sua participação no CBI de Remo – Barcos Longos, no Rio de Janeiro, com o coração cheio de orgulho! ⚫️🔴

Nossos atletas deram o seu melhor, mostraram garra, disciplina e o verdadeiro espírito de equipe. Voltamos com a certeza de que estamos no caminho certo — formando não apenas campeões no esporte, mas também grandes pessoas para a vida.

O Sport Club de Natal está mais vivo do que nunca!

⚫️🔴 O GIGANTE DO POTENGI! 🔴⚫️`,
        image: '/news_cbi_remo.png',
        category: 'Competição',
        author: 'Diretoria de Remo',
        publishedAt: '2025-12-22',
        date: '22 Dez',
    },
    {
        id: 'confraternizacao-2024',
        title: 'Família Sport Club de Natal unida em frente à sede histórica',
        excerpt: 'Atletas, sócios e diretoria reunidos para celebrar mais um ano de conquistas e superação do Gigante do Potengi.',
        content: `O Sport Club de Natal é muito mais que um clube, é uma família!

Reunimos nossa comunidade em frente à nossa sede histórica na Rua Chile para celebrar as conquistas e reafirmar nosso compromisso com o futuro do remo potiguar.

Com a presença de atletas de todas as gerações, desde a escolinha até a equipe master, celebramos a união que faz deste clube uma referência no esporte.`,
        image: '/images/news/confraternizacao-2024.png',
        category: 'Eventos',
        author: 'Diretoria Social',
        publishedAt: '2025-12-21',
        date: '21 Dez',
    },
    {
        id: '1',
        title: 'Equipe de Remo conquista 5 medalhas no Campeonato Nordestino',
        excerpt: 'Atletas do Sport Club de Natal brilham na competição realizada em Recife, trazendo para casa 3 ouros e 2 pratas.',
        content: `Nossa equipe de remo demonstrou excelência absoluta no último Campeonato Nordestino realizado nas águas do Pina, em Recife. Com uma delegação composta por 12 atletas em diversas categorias, o SCN reafirmou sua posição como potência regional.

Destaque para a guarnição do Double-Skiff Júnior, que superou os adversários com uma vantagem de mais de 3 barcos de distância. Os treinos intensificados nas madrugadas do Rio Potengi deram o resultado esperado: resistência muscular e sincronia perfeita.

"Estamos colhendo os frutos de um planejamento técnico rigoroso. Nossos atletas não apenas remaram, eles representaram a alma de Natal", afirmou o Diretor Técnico.

Próximos passos incluem a preparação para o Campeonato Brasileiro, onde buscaremos pódios nacionais. O clube parabeniza todos os envolvidos.`,
        image: '/images/news/medalhas-nordestino.png',
        category: 'Competição',
        author: 'Diretoria Técnica',
        publishedAt: '2025-01-15',
        date: '15 Jan',
    },
    {
        id: '2',
        title: 'Técnicas de Remada: Como melhorar sua performance no single skiff',
        excerpt: 'Dicas essenciais para aprimorar sua técnica de remada, desde a pegada até a recuperação.',
        content: 'A técnica correta de remada é fundamental para evitar lesões e maximizar a eficiência de cada movimento...',
        image: '/news_technique.png',
        gallery: [],
        category: 'Técnica',
        author: 'Coach Fernanda Costa',
        publishedAt: '2025-01-12',
    },
    {
        id: '3',
        title: 'Nutrição para Remadores: O que comer antes e depois dos treinos',
        excerpt: 'Guia completo de alimentação para atletas de remo, com foco em performance e recuperação muscular.',
        content: 'A nutrição adequada é fundamental para suportar a alta demanda energética do remo...',
        image: '/news_nutricao.png',
        category: 'Nutrição',
        author: 'Dra. Ana Nutricionista',
        publishedAt: '2025-01-10',
    },
    {
        id: '4',
        title: 'Depoimento: "O remo mudou minha vida" - João Silva, atleta master',
        excerpt: 'Conheça a história de superação de João, que aos 45 anos descobriu no remo uma nova paixão.',
        content: 'Quando comecei a remar aos 45 anos, não imaginava o impacto que isso teria na minha saúde e bem-estar...',
        image: '/news_depoimento.png',
        category: 'Depoimento',
        author: 'Equipe SCN',
        publishedAt: '2025-01-08',
    },
    {
        id: '5',
        title: 'Nova frota de barcos double chegou ao clube',
        excerpt: 'Investimento em equipamentos de última geração para treinos e competições.',
        content: 'É com grande satisfação que anunciamos a chegada dos novos barcos Double Skiff de fibra de carbono...',
        image: '/news_nova_frota.png',
        category: 'Infraestrutura',
        author: 'Diretoria',
        publishedAt: '2025-01-05',
    },
    {
        id: '6',
        title: 'Calendário de Competições 2025: Prepare-se para os desafios',
        excerpt: 'Confira as principais competições de remo previstas para este ano e comece a se preparar.',
        content: 'O ano de 2025 promete ser intenso para o remo nacional. Confira as datas das principais regatas...',
        image: '/news_calendario.png',
        category: 'Competição',
        author: 'Diretoria Técnica',
        publishedAt: '2025-01-03',
    },
    {
        id: '7',
        title: 'Treinamento de Força para Remadores: Exercícios essenciais',
        excerpt: 'Um programa de fortalecimento complementar para melhorar sua potência nas remadas.',
        content: 'O treinamento de força é crucial para desenvolver a potência necessária nas competições de curta distância...',
        image: '/news_treino_forca.png',
        category: 'Treinamento',
        author: 'Coach Marcos Oliveira',
        publishedAt: '2024-12-28',
    },
    {
        id: '8',
        title: 'A história do remo olímpico no Brasil',
        excerpt: 'Da primeira medalha às conquistas recentes, conheça a trajetória do remo brasileiro.',
        content: 'O remo brasileiro tem uma história rica e cheia de glórias, desde os primeiros clubes no Rio de Janeiro...',
        image: '/images/news/historia-remo-olimpico.png',
        category: 'História',
        author: 'Equipe SCN',
        publishedAt: '2024-12-25',
    },
    {
        id: '9',
        title: 'Alongamento e prevenção de lesões para remadores',
        excerpt: 'Rotina de alongamentos essenciais para evitar lesões comuns na prática do remo.',
        content: 'A prevenção é o melhor remédio. Incorpore estes alongamentos na sua rotina diária...',
        image: '/news_alongamento.png',
        category: 'Saúde',
        author: 'Fisioterapeuta Roberto',
        publishedAt: '2024-12-20',
    },
    {
        id: '10',
        title: 'Confraternização de final de ano reúne família do remo',
        excerpt: 'Mais de 150 pessoas participaram do evento que celebrou as conquistas de 2024.',
        content: 'A tradicional confraternização do SCN foi um sucesso absoluto, reunindo atletas, familiares e ex-sócios...',
        image: '/images/news/confraternizacao-2024.png',
        category: 'Eventos',
        author: 'Diretoria Social',
        publishedAt: '2024-12-18',
    },
];
