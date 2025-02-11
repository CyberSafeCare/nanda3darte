# Política de Segurança

Este documento descreve as políticas de segurança para o repositório.

## 1. Reportando Vulnerabilidades

### Caso encontre qualquer vulnerabilidade de segurança:
- Não reporte vulnerabilidades através de issues públicas ou comentários

### Informações necessárias:
- Descrição detalhada da vulnerabilidade
- Passos para reprodução
- Impacto potencial
- Sugestões de mitigação (se aplicável)

## 2. Boas Práticas Adotadas

### Para proteção do projeto:
- 🔒 Site estático sem back-end ou banco de dados
- 🔐 Dependências monitoradas via CDNs confiáveis:
  - Google Fonts
  - Font Awesome
  - Cloudflare (para recursos externos)
- 🛡️ Headers de segurança implementados via configuração de hospedagem
- 🔄 Atualizações periódicas de links externos

## 3. Áreas de Atenção

### Dependências externas:
| Recurso          | Finalidade               | Fonte Confiável        |
|-------------------|--------------------------|------------------------|
| Google Fonts      | Tipografia               | fonts.google.com       |
| Font Awesome      | Ícones                   | cdnjs.cloudflare.com   |
| Google APIs       | Fontes CSS               | fonts.googleapis.com   |

## 4. Responsabilidades

### Mantenedores do projeto:
- Manter links externos atualizados
- Verificar periodicamente as CDNs utilizadas
- Implementar recomendações de segurança do GitHub
- Revisar configurações de hospedagem estática

### Usuários:
- Verificar sempre a URL oficial da lojinha
- Reportar links quebrados ou redirecionamentos suspeitos
- Não compartilhar dados sensíveis através deste site

## 5. Histórico de Atualizações

- **2025-02-08**: Política de segurança inicial estabelecida

---

**Nota:** Por se tratar de um site estático sem componentes server-side, os principais riscos estão relacionados a:
- Links externos maliciosos
- Vulnerabilidades em CDNs de terceiros
- Configuração inadequada de hospedagem