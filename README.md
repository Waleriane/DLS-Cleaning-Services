# DLS Services — Site

Site da DLS Services (House Cleaning + Handyman & Remodeling).
Site em HTML/CSS/JS puro, pronto para a Vercel (não precisa de build).

## Estrutura
- `index.html` — página inicial (Home)
- `services.html` — página de serviços (Cleaning + Handyman & Remodeling)
- `about.html` — página About Us
- `contact.html` — página Contact (formulário curto, assistente e área atendida)
- `handyman.html` — página Handyman & Remodeling
- `js/respostas.js` — respostas do assistente virtual (chat da página e pop-up)
- `js/chat-popup.js` — botão flutuante do assistente em todas as páginas
- `js/formularios.js` — envio dos formulários para o e-mail da DLS (FormSubmit)
- `js/site.js` — contatos (telefone, e-mail, Instagram) e funcionamento do menu, usado nas duas páginas
- `js/servicos.js` — textos da janela "Learn More" de cada serviço
- `imagens/` — logo, fotos da galeria, antes/depois, robô
- `videos/` — vídeos do banner e imagens de capa
- `secoes/` — cada seção separada (reserva/consulta)

## Onde editar
- **Contatos (telefone, e-mail, Instagram):** no topo do `js/site.js` (vale para as duas páginas).
- **Textos da janela de detalhes dos serviços:** `js/servicos.js`.
- **Tamanho/cor dos textos:** bloco `AJUSTE GERAL DE LEITURA`, no fim do `index.html`.
- **Avaliações reais:** seção Reviews — apague `hidden` do card depois de colocar o texto.

## Pendências
- Ativar o FormSubmit: no 1º envio, a DLS recebe um e-mail "Confirm your email" e clica em ativar (uma vez só).
- Preencher telefone e Instagram em `js/site.js`.
- Fotos dos cards de serviço ainda vêm por link do Magnific.
