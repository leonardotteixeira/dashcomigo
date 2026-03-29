# Setup: Update Collection "proposals" no PocketBase

## Instruções para adicionar campos à collection existente

### 1. Acesse o Admin do PocketBase
- URL: `https://pocketbase-production-d5ae.up.railway.app/_/`
- Email: `admin@bubuya.com.br`
- Senha: `Admin123456!`

### 2. Edite a Collection "proposals"

Vá para **Collections > proposals** e clique em **Edit**.

### 3. Adicione/Modifique os campos:

#### Campo novo: `data_pagamento`
| Nome Campo | Tipo | Obrigatório | Propriedades |
|-----------|------|-------------|-------------|
| `data_pagamento` | Date | ❌ | (opcional - preenchido quando proposta é marcada como "paga") |

#### Modifique o campo `status`:
- **Antes:** Select com opções: `aguardando`, `aprovada`, `recusada`
- **Depois:** Select com opções: `aguardando`, `aprovada`, `paga`, `vencida`, `recusada`

**Passos:**
1. Clique no campo `status` para editar
2. Nas "Options", adicione duas novas opções:
   - `paga` (para quando a proposta foi paga)
   - `vencida` (para quando a validade expirou)

### 4. Salve as mudanças

Clique em "Save" para confirmar as alterações.

### 5. Próximos passos:

- [ ] Campo `data_pagamento` adicionado
- [ ] Status `paga` e `vencida` adicionados
- [ ] Testar fluxo: marcar proposta como "Paga" na UI e verificar se data é gravada
- [ ] Testar: criar proposta com validade de 1 dia atrás para ver status "vencida"

## Mudanças no Frontend (já implementadas)

- ✅ GeradorPropostas.tsx atualizado com:
  - Novo status "paga" e "vencida"
  - Novo campo `data_pagamento` na interface Proposal
  - Dialog para selecionar data de pagamento ao marcar como "paga"
  - Cores atualizadas: "paga" = verde, "vencida" = vermelho, "aprovada" = azul
  - Filtros atualizados: tabs para "Pagas" e "Vencidas"
  - Exibição da data de pagamento no preview da proposta

## Observações

- Propostas com status "vencida" devem ser definidas manualmente (futura: adicionar automação)
- Data de pagamento é opcional e só preenchida quando status é "paga"
- O sistema agora diferencia entre "aprovada" (aceita) e "paga" (dinheiro recebido)
