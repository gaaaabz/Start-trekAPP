## Integrantes
Julia Damasceno Busso - RM560293 - 2TDSPB
Jhonatan Quispe Torrez - Rm560601 - 2TDSPB
Gabriel Gomes Cardoso - Rm559597 - 2TDSPB
---
## video
https://youtube.com/shorts/Eh5JACFt-38?feature=share
---
# Start-Trek — Wiki de Profissões (Mobile)

Start-Trek é um aplicativo mobile em React Native que funciona como uma enciclopédia colaborativa de profissões: registra trabalhos que existiram, existem e que podem existir no futuro. Usuários podem explorar fichas de profissões, comentar, deixar opiniões e compartilhar experiências para enriquecer o acervo coletivo.

> Aplicação estilo wiki voltada para descoberta, registro e discussão sobre profissões reais, extintas e especulativas.

---

## Funcionalidades principais

- Lista e pesquisa de profissões (filtros por área, período, popularidade)
- Páginas detalhadas para cada profissão (descrição, responsabilidades, histórico, habilidades)
- Criação e edição colaborativa de entradas (controle de versão/ratificação por comunidade — se habilitado)
- Sistema de comentários e avaliações por usuários
- Compartilhamento de entradas via link e redes sociais
- Perfis de usuário com histórico de contribuições
- Moderação básica (reportar entradas/comentários)
- Suporte a imagens e anexos nas entradas

---

## Tecnologias

- React Native
- Gerenciamento de estado: React Context / Redux / Recoil (conforme implementação)
- Backend/API: REST ou GraphQL (separado do repositório mobile)
- Autenticação: e-mail/senha, OAuth (dependendo da configuração do backend)
- Banco local (opcional): Realm / SQLite / AsyncStorage para cache/offline

---

## Telas (exemplos)

- Tela inicial / feed das profissões
- Tela de detalhes da profissão
- Tela de criação / edição de profissão
- Tela de comentários e discussões
- Tela de perfil do usuário
- Tela de busca e filtros

(Sugira capturas de tela em /assets/screenshots e atualize este README com imagens.)

---

## Como rodar (Desenvolvimento)

> Ajuste os comandos abaixo conforme usa Expo ou React Native CLI no seu projeto.

1. Clone o repositório
```bash
git clone https://github.com/gaaaabz/Start-trekAPP.git
cd Start-trekAPP
```

2. Instale dependências
```bash
# npm
npm install

# ou yarn
yarn install
```

