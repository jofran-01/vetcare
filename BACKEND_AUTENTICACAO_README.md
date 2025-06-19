# 🔐 BACKEND DE AUTENTICAÇÃO - PROJETO TCC VETERINÁRIO

## 📋 RESUMO DO QUE FOI DESENVOLVIDO

### 🏗️ Estrutura do Backend
- **Framework**: Flask (Python)
- **Banco de Dados**: Supabase (PostgreSQL)
- **Autenticação**: JWT + bcrypt
- **CORS**: Habilitado para integração frontend

### 📁 Arquivos Criados

#### 🔧 Configuração Principal
- `src/main.py` - Aplicação Flask principal com CORS e blueprints
- `src/config/database.py` - Configuração do Supabase
- `src/utils/auth.py` - Utilitários de autenticação (hash, JWT, validações)

#### 🛣️ Rotas da API
- `src/routes/auth.py` - Autenticação (cadastro/login tutores e clínicas)
- `src/routes/animals.py` - Gestão de animais com QR Code
- `src/routes/appointments.py` - Sistema de agendamentos
- `src/routes/contact.py` - Formulário de contato

### 🔐 Funcionalidades de Autenticação

#### ✅ Cadastro de Tutores
**Endpoint**: `POST /api/auth/register/tutor`
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "senha123",
  "telefone": "(11) 99999-9999",
  "endereco": "Rua das Flores, 123",
  "cidade": "São Paulo",
  "estado": "SP",
  "cep": "01234-567"
}
```

#### ✅ Cadastro de Clínicas
**Endpoint**: `POST /api/auth/register/clinica`
```json
{
  "nome_clinica": "Clínica Veterinária ABC",
  "email": "contato@clinicaabc.com",
  "senha": "senha123",
  "telefone": "(11) 88888-8888",
  "endereco": "Av. Principal, 456",
  "cidade": "São Paulo",
  "estado": "SP",
  "cep": "01234-567",
  "cnpj": "12.345.678/0001-90",
  "responsavel_tecnico": "Dr. Maria Santos",
  "crmv": "CRMV-SP 12345"
}
```

#### ✅ Login Universal
**Endpoint**: `POST /api/auth/login`
```json
{
  "email": "usuario@email.com",
  "senha": "senha123",
  "tipo": "tutor" // ou "clinica"
}
```

#### ✅ Verificação de Token
**Endpoint**: `GET /api/auth/verify`
**Header**: `Authorization: Bearer [token]`

### 🐾 Funcionalidades de Animais

#### ✅ Cadastrar Animal
**Endpoint**: `POST /api/animals/`
**Autenticação**: Requerida (apenas tutores)
```json
{
  "nome": "Rex",
  "especie": "Cão",
  "raca": "Golden Retriever",
  "idade": 3,
  "peso": 25.5,
  "cor": "Dourado",
  "sexo": "Macho",
  "castrado": true,
  "historico_medico": "Vacinado em dia",
  "observacoes": "Animal dócil"
}
```

#### ✅ Listar Animais
**Endpoint**: `GET /api/animals/`
**Autenticação**: Requerida

#### ✅ Buscar Animal por ID (QR Code)
**Endpoint**: `GET /api/animals/{id}`
**Público**: Sim (para QR Code)

#### ✅ Pesquisar Animais
**Endpoint**: `GET /api/animals/search?q=termo`
**Autenticação**: Requerida

### 📅 Funcionalidades de Agendamentos

#### ✅ Criar Agendamento
**Endpoint**: `POST /api/appointments/`
**Autenticação**: Requerida (apenas tutores)
```json
{
  "animal_id": "uuid-do-animal",
  "email_clinica": "clinica@email.com",
  "data_agendamento": "2024-01-15",
  "horario": "14:30",
  "tipo_consulta": "Consulta Geral",
  "observacoes": "Animal com tosse"
}
```

#### ✅ Listar Agendamentos
**Endpoint**: `GET /api/appointments/`
**Autenticação**: Requerida

#### ✅ Atualizar Status (Clínicas)
**Endpoint**: `PUT /api/appointments/{id}/status`
**Autenticação**: Requerida (apenas clínicas)
```json
{
  "status": "aceito", // ou "recusado"
  "motivo_recusa": "Horário indisponível" // obrigatório se recusado
}
```

#### ✅ Horários Disponíveis
**Endpoint**: `GET /api/appointments/available-times?email_clinica=clinica@email.com&data=2024-01-15`

### 📧 Funcionalidades de Contato

#### ✅ Enviar Mensagem
**Endpoint**: `POST /api/contact/`
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "telefone": "(11) 99999-9999",
  "assunto": "Dúvida sobre agendamento",
  "mensagem": "Gostaria de saber como agendar uma consulta..."
}
```

### 🔒 Segurança Implementada

#### ✅ Hash de Senhas
- Utiliza bcrypt para hash seguro das senhas
- Salt automático para cada senha

#### ✅ JWT Tokens
- Tokens válidos por 7 dias
- Incluem ID do usuário e tipo (tutor/clínica)
- Verificação automática em rotas protegidas

#### ✅ Validações
- Email: formato válido
- Senha: mínimo 6 caracteres, pelo menos 1 número e 1 letra
- Telefone: formato brasileiro (10-11 dígitos)
- Dados obrigatórios verificados

#### ✅ Proteção de Rotas
- Decorator `@token_required` para rotas protegidas
- Verificação de permissões por tipo de usuário
- Headers Authorization com Bearer token

### 🎯 QR Code para Animais
- Geração automática ao cadastrar animal
- Formato base64 para fácil exibição
- URL aponta para página pública do animal
- Pode ser usado para impressão em carteirinhas

### 🌐 CORS Configurado
- Permite requisições de qualquer origem
- Essencial para integração com frontend
- Headers apropriados para APIs REST

## 🚀 COMO USAR

### 1. Configurar Variáveis de Ambiente
Edite o arquivo `.env` com suas credenciais reais do Supabase:
```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-chave-anon
SUPABASE_SERVICE_KEY=sua-chave-service
```

### 2. Instalar Dependências
```bash
cd backend-api
source venv/bin/activate
pip install -r requirements.txt
```

### 3. Executar o Servidor
```bash
python src/main.py
```

### 4. Testar as APIs
O servidor roda em `http://localhost:5000`

**Endpoint de Saúde**: `GET /health`

## 📝 PRÓXIMOS PASSOS

1. **Frontend**: Criar interfaces para consumir essas APIs
2. **Upload de Imagens**: Implementar upload de fotos dos animais
3. **Notificações**: Sistema de notificações por email/SMS
4. **Dashboard**: Painéis administrativos para tutores e clínicas
5. **Relatórios**: Geração de relatórios e estatísticas

## 🔧 DEPENDÊNCIAS INSTALADAS

- `flask` - Framework web
- `flask-cors` - CORS para APIs
- `supabase` - Cliente Python do Supabase
- `bcrypt` - Hash de senhas
- `python-dotenv` - Variáveis de ambiente
- `qrcode[pil]` - Geração de QR Codes
- `pyjwt` - JSON Web Tokens

O backend está pronto para integração com o frontend e deploy na Vercel!

