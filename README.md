# 📊 CRJ Systems - Dashboard de Atendimento & Chamados

O **CRJ Systems** é uma solução de gestão de atendimento focada em agilidade, organização e clareza. Desenvolvido para centralizar o fluxo de chamados, o projeto permite o monitoramento em tempo real de demandas, garantindo eficiência na resolução de problemas e otimização do suporte.

<img width="1920" height="1080" alt="Captura de tela 2026-06-09 212228" src="https://github.com/user-attachments/assets/7cbee245-ab63-46c2-b17d-559255b3846a" />
<img width="1920" height="1080" alt="Captura de tela 2026-06-09 212241" src="https://github.com/user-attachments/assets/11aeb192-1e40-46fb-9f70-4ad1f568ca96" />
<img width="1920" height="1080" alt="Captura de tela 2026-06-09 212649" src="https://github.com/user-attachments/assets/6e6da41c-b9d4-4109-ba86-a56850fb0c70" />
<img width="1920" height="1080" alt="Captura de tela 2026-06-09 212300" src="https://github.com/user-attachments/assets/990d1bfd-e5da-4305-a5d5-bd91990ce6fa" />
<img width="1920" height="1080" alt="Captura de tela 2026-06-09 212255" src="https://github.com/user-attachments/assets/7babdb09-a6aa-4ec6-93e2-678650592b65" />
<img width="1920" height="1080" alt="Captura de tela 2026-06-09 212250" src="https://github.com/user-attachments/assets/60fa74e6-53eb-4bf8-a1c5-44905401e4ba" />




Este projeto é um marco na minha trajetória como estudante de Ciência da Computação, unindo lógica de programação complexa com interfaces pensadas na experiência do usuário.

## 🚀 Funcionalidades Principais
- **Dashboard em Tempo Real:** Visualização clara do status de cada chamado (aberto, em progresso, concluído).
- **Gestão Eficiente:** Interface intuitiva para abertura e acompanhamento de tickets.
- **Performance Otimizada:** Navegação fluida, garantindo que o usuário não perca tempo com carregamentos desnecessários.
- **Design Responsivo:** Acesso total via Desktop ou Mobile.

## 🛠 Tech Stack (O que está por trás)
Para entregar este sistema, utilizei tecnologias de mercado que garantem escalabilidade e organização:
- **Frontend:** React 19, Tailwind CSS (Design System).
- **Estado & Dados:** Tanstack React Query (Gerenciamento de cache e requisições).
- **Validação:** Zod & React Hook Form (Segurança e integridade dos inputs).
- **Performance:** Framer Motion (Interações suaves).
- **CI/CD:** Vercel (Automação de deploy e ambiente de produção).

## 💡 Desafios Técnicos & Aprendizado (Troubleshooting)
Como desenvolvedora, acredito que a resolução de problemas é a parte mais valiosa do processo. Durante o desenvolvimento do CRJ Systems, superei desafios críticos que moldaram minha visão de engenharia:

1. **Configuração de Ambiente (CI/CD):** Ao configurar o pipeline de deploy na Vercel, enfrentei problemas com o tratamento de avisos como erros fatais.
   * *Solução:* Ajustei a configuração de build (`CI=false`), otimizando o processo de integração contínua sem comprometer a estabilidade.
2. **Dependências em Produção:** Erros de `MODULE_NOT_FOUND` (especificamente `ajv-keywords`) apareceram devido a inconsistências de versão no ambiente de servidor.
   * *Solução:* Realizei o versionamento explícito no `package.json`, garantindo que o ambiente de produção fosse uma réplica fiel do desenvolvimento.

*Lição:* O deploy é onde o código encontra o mundo real, e entender logs é uma habilidade fundamental que desenvolvi neste projeto.

## 📦 Como rodar localmente
1. Clone este repositório:
```bash
   git clone [https://github.com/Carolina-Reis-Jesus/CRJ_SYSTEMS.git](https://github.com/Carolina-Reis-Jesus/CRJ_SYSTEMS.git)
Acesse a pasta:

Bash
   cd frontend
Instale as dependências:

Bash
   npm install --legacy-peer-deps
Inicie o sistema:

Bash
   npm start
Projeto desenvolvido por Carolina Reis | Estudante de Ciência da Computação.
