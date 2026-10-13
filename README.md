# Vellora Connect

Site estático bilíngue (EN/PT), HTML, CSS e JavaScript, para mentoria de Jesiel Machado. Paleta: #142D32, #E8D9BB, #F7F5F0, #363D40.

## Editar
- Textos: `content/en.json` e `content/pt.json`.
- Contatos e opções: `assets/config.js`.
- Aparência: `assets/style.css`.
- Foto autorizada: adicionar em `assets/` e definir `portrait` na configuração. O desenho abstrato atual não representa uma foto de Jesiel.
- Depoimentos: inserir somente reais, com autorização, e ativar `testimonialsEnabled`.
- Números: há apenas o período informado no briefing; países e pessoas não foram quantificados por falta de dados verificados.
- A biografia é uma adaptação editorial dos fatos do briefing em terceira pessoa; substituir pela história aprovada pelo Jesiel quando disponível.

## Ativar contatos
Preencher `email`, `whatsapp` (somente dígitos com código internacional) e `formspreeEndpoint`. Completar os textos de privacidade nos dois idiomas com operador legal, contato, base legal, retenção e prestadores. Só então definir `privacyReady: true`. Sem configuração, o formulário permanece desativado e nenhum envio é simulado. WhatsApp e e-mail aparecem automaticamente após serem preenchidos.

## GitHub Pages
A workflow `.github/workflows/pages.yml` publica após cada push na `main`. Em Settings → Pages, selecionar GitHub Actions se a configuração automática não tiver permissão para habilitar Pages. URL prevista: https://web-uk.github.io/vellora.com/ . O nome do repositório não configura automaticamente o domínio vellora.com. Para usar domínio próprio, configurar DNS e Pages e atualizar sitemap, robots e Open Graph.

## Netlify (alternativa)
Importar o repositório, deixar o build command vazio e usar `.` como publish directory. O formulário usa Formspree e independe da hospedagem.

## Executar localmente
`python3 -m http.server 8000`, depois abrir http://localhost:8000. Não abrir por file://, pois os textos são carregados como JSON.

## Privacidade e assets
Sem analytics ou cookies publicitários. Preferência de idioma em localStorage. Google Fonts fornece Cormorant Garamond e Inter; existem fallbacks locais. Para eliminar solicitações ao Google, hospedar as fontes localmente e substituir o @import. Não foram inventados contatos, depoimentos ou foto do mentor.

Se a primeira execução falhar com `Resource not accessible by integration`, habilitar Pages em Settings → Pages → Source → GitHub Actions. Depois, em Actions → Publish Vellora Connect, selecionar Run workflow.
