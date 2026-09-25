🧩 Desafio Técnico – React Native (Expo)
Contexto
A prefeitura de uma cidade no interior do país enfrenta dificuldades no controle das escolas públicas. Atualmente, o controle é feito manualmente em planilhas Excel, que ficam rapidamente desatualizadas.
Foi solicitado o desenvolvimento de um aplicativo móvel multiplataforma (Android/iOS) que centralize o cadastro das escolas públicas e de suas turmas.
O sistema deve permitir:
- Cadastro e listagem de escolas públicas.
- Cadastro e listagem de turmas vinculadas a cada escola.

🧱 Estrutura do Projeto
O candidato deverá desenvolver o projeto utilizando React Native com Expo, seguindo boas práticas de arquitetura, design e usabilidade.
Requisitos técnicos mínimos:
- Expo SDK 54 ou superior
- React 19 / React Native 0.81+
- TypeScript obrigatório
- Navegação com Expo Router
- UI com Gluestack UI.
- Estado com Zustand, Jotai, Recoil ou Context API
- Simulação de back-end com MirageJS ou Mock Service Worker (MSW)
- Deve haver endpoints simulados para /schools e /classes
- Cada "escola" pode ter um array de "turmas" associadas

⚙️ Funcionalidades esperadas
📍 Módulo de Escolas
- Listar escolas (nome, endereço, número de turmas)
- Adicionar nova escola (nome, endereço obrigatório)
- Editar e excluir escola

📚 Módulo de Turmas
- Listar turmas associadas à escola selecionada
- Cadastrar nova turma (nome da turma, turno, ano letivo)
- Editar e excluir turma

🔍 Extras (diferenciais)
- Busca e filtro de escolas/turmas
- Layout responsivo (mobile/tablet)
- Componentização e uso de hooks personalizados
- Armazenamento offline com AsyncStorage (opcional)
- Testes unitários com Jest / Testing Library React Native

💡 Avaliação
Critério	Descrição
Organização	Estrutura do projeto, clareza do código e documentação
---	---
Qualidade de código	Aderência a S.O.L.I.D., Clean Code e boas práticas
---	---
Usabilidade	Design agradável e fluido
---	---
Funcionalidade	Implementação completa e sem erros críticos
---	---
Versionamento	Uso correto do Git (commits claros e estruturados)
---	---
Instruções	README funcional explicando instalação e execução
---	---
🧪 Entrega
O projeto deve estar disponível em um repositório público no GitHub.
O README deve conter:
- Versões utilizadas (Node, Expo, libs)
- Passos de instalação e execução (npm install, npx expo start, etc.)
- Instruções para rodar o mock de back-end
- (Opcional) prints demonstrando o app

🚀 Dicas e diferenciais
- Uso de TypeScript avançado (tipagem de entidades e hooks)
- Implementação de Design Patterns simples (Factory, Repository, Adapter)
- Organização modular (por features ou domains)
- Utilização de lint/formatter (ESLint, Prettier)
- Deploy com Expo Dev Builds ou Expo Go QR