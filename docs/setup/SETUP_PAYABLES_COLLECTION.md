# Setup: Collection "payables" no PocketBase

## Instruções para criar a collection manualmente

### 1. Acesse o Admin do PocketBase
- URL: `https://pocketbase-production-d5ae.up.railway.app/_/`
- Email: `admin@bubuya.com.br`
- Senha: `Admin123456!`

### 2. Crie a Collection "payables"

**Nome:** `payables`
**Type:** Base Collection

### 3. Adicione os campos:

| Nome Campo | Tipo | Obrigatório | Propriedades |
|-----------|------|-------------|-------------|
| `descricao` | Text | | - |
| `valor` | Number | | Min: 0.01 |
| `categoria` | Text | | - |
| `data_vencimento` | Date | | - |
| `status` | Select | | Opções: `pendente`, `pago` (default: `pendente`) |
| `eh_recorrente` | Checkbox | | (default: false) |
| `frequencia_recorrencia` | Select | | Opções: `mensal`, `anual` |
| `data_pagamento` | Date | | - |
| `anotacoes` | Text | | - |
| `user_id` | Relation | | Relation: `profiles` |

### 4. Configure as API Rules

**List Rule:**
```
user_id = @request.auth.id
```

**View Rule:**
```
user_id = @request.auth.id
```

**Create Rule:**
```
@request.auth.id != null
```

**Update Rule:**
```
user_id = @request.auth.id
```

**Delete Rule:**
```
user_id = @request.auth.id
```

### 5. Após criar, execute:
```bash
# Teste criando um payable via API
curl -X POST "https://pocketbase-production-d5ae.up.railway.app/api/collections/payables/records" \
 -H "Authorization: Bearer [TOKEN_AUTH]" \
 -H "Content-Type: application/json" \
 -d '{
 "user_id": "[USER_ID]",
 "descricao": "Aluguel",
 "valor": 1200.00,
 "categoria": "Aluguel",
 "data_vencimento": "2026-04-05",
 "status": "pendente",
 "eh_recorrente": true,
 "frequencia_recorrencia": "mensal"
 }'
```

## Próximos passos:

- [ ] Collection criada e testada
- [ ] Componentes (Form, List, Página) criados
- [ ] Rotas adicionadas ao App.tsx
- [ ] Integrado ao Dashboard
