# Pluggy Setup - PocketBase Collection

## Coleção: `pluggy_connections`

### Campos a Criar

1. **id** (ID)
   - Tipo: Text
   - Padrão: ID automático

2. **user_id** (Relação)
   - Tipo: Relation
   - Coleção: `users`
   - Cardinalidade: Muitos para Um

3. **institution_id** (Texto)
   - Tipo: Text
   - Indexado: Sim
   - Descrição: ID da instituição no Pluggy

4. **connected_at** (Data)
   - Tipo: DateTime
   - Descrição: Data/hora de conexão

5. **last_sync** (Data)
   - Tipo: DateTime
   - Descrição: Último sincronismo de transações

6. **status** (Seletor)
   - Tipo: Select
   - Opções: `active`, `revoked`, `error`
   - Valor padrão: `active`

7. **error_message** (Texto)
   - Tipo: Text
   - Descrição: Mensagem de erro (se houver)

---

## RLS (Row-Level Security Rules)

### CREATE
```
user_id.id = @request.auth.id
```

### READ
```
user_id.id = @request.auth.id
```

### UPDATE
```
user_id.id = @request.auth.id
```

### DELETE
```
user_id.id = @request.auth.id
```

---

## SQL (Alternativa ao Admin)

```sql
CREATE TABLE pluggy_connections (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  institution_id TEXT NOT NULL,
  connected_at DATETIME NOT NULL,
  last_sync DATETIME,
  status TEXT DEFAULT 'active',
  error_message TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE(user_id, institution_id)
);

CREATE INDEX idx_pluggy_user ON pluggy_connections(user_id);
CREATE INDEX idx_pluggy_status ON pluggy_connections(status);
```

---

## Como Testar

### 1. Conectar Banco via Pluggy
```bash
curl -X POST http://localhost:3001/api/pluggy/create-connect-token \
  -H "Content-Type: application/json" \
  -d '{"userId": "USER_ID_AQUI"}'
```

Response esperada:
```json
{
  "access_token": "eyJ...",
  "expires_in": 3600
}
```

### 2. Sincronizar Contas
```bash
curl -X POST http://localhost:3001/api/pluggy/sync-accounts \
  -H "Content-Type: application/json" \
  -d '{"userId": "USER_ID_AQUI", "institutionId": "INSTITUTION_ID_AQUI"}'
```

Response esperada:
```json
{
  "success": true,
  "message": "Accounts synced successfully"
}
```

### 3. Obter Contas Conectadas
```bash
curl "http://localhost:3001/api/pluggy/accounts?userId=USER_ID_AQUI"
```

Response esperada:
```json
{
  "accounts": []
}
```

---

## Credenciais Sandbox Pluggy

As credenciais estão em `.env`:
- `PLUGGY_CLIENT_ID`
- `PLUGGY_CLIENT_SECRET`
- `PLUGGY_ENV=sandbox`

Bancos disponíveis no sandbox:
- Itaú
- Nubank
- Bradesco
- Caixa
- E muitos mais

---

## Próximos Passos

- [ ] Criar coleção `pluggy_connections` no PocketBase
- [ ] Aplicar RLS rules
- [ ] Testar fluxo completo (local)
- [ ] Integrar Dashboard
- [ ] Sincronizar transações (V2)
