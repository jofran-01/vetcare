-- =====================================================
-- SCRIPT SQL PARA BANCO DE DADOS - PROJETO TCC VETERINÁRIO
-- Sistema de Agendamento e Gestão de Clínicas Veterinárias
-- Banco: PostgreSQL (Supabase)
-- =====================================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABELA: usuarios_tutores
-- Armazena informações dos tutores de animais
-- =====================================================
CREATE TABLE usuarios_tutores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    endereco TEXT,
    cidade VARCHAR(100),
    estado VARCHAR(50),
    cep VARCHAR(10),
    ativo BOOLEAN DEFAULT true,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA: usuarios_clinicas
-- Armazena informações das clínicas veterinárias
-- =====================================================
CREATE TABLE usuarios_clinicas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome_clinica VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    endereco TEXT,
    cidade VARCHAR(100),
    estado VARCHAR(50),
    cep VARCHAR(10),
    cnpj VARCHAR(18),
    responsavel_tecnico VARCHAR(255),
    crmv VARCHAR(20),
    horario_funcionamento JSONB,
    ativo BOOLEAN DEFAULT true,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA: animais
-- Armazena informações dos animais cadastrados
-- =====================================================
CREATE TABLE animais (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    especie VARCHAR(100) NOT NULL,
    raca VARCHAR(100),
    idade INTEGER,
    peso DECIMAL(5,2),
    cor VARCHAR(100),
    sexo VARCHAR(10) CHECK (sexo IN ('Macho', 'Fêmea')),
    castrado BOOLEAN DEFAULT false,
    foto_url TEXT,
    qr_code_url TEXT,
    historico_medico TEXT,
    observacoes TEXT,
    tutor_id UUID NOT NULL REFERENCES usuarios_tutores(id) ON DELETE CASCADE,
    clinica_id UUID REFERENCES usuarios_clinicas(id) ON DELETE SET NULL,
    ativo BOOLEAN DEFAULT true,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA: agendamentos
-- Armazena os agendamentos de consultas
-- =====================================================
CREATE TABLE agendamentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tutor_id UUID NOT NULL REFERENCES usuarios_tutores(id) ON DELETE CASCADE,
    clinica_id UUID NOT NULL REFERENCES usuarios_clinicas(id) ON DELETE CASCADE,
    animal_id UUID NOT NULL REFERENCES animais(id) ON DELETE CASCADE,
    data_agendamento DATE NOT NULL,
    horario TIME NOT NULL,
    tipo_consulta VARCHAR(100) DEFAULT 'Consulta Geral',
    observacoes TEXT,
    status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'aceito', 'recusado', 'concluido', 'cancelado')),
    motivo_recusa TEXT,
    valor DECIMAL(10,2),
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA: consultas
-- Armazena o histórico de consultas realizadas
-- =====================================================
CREATE TABLE consultas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agendamento_id UUID NOT NULL REFERENCES agendamentos(id) ON DELETE CASCADE,
    animal_id UUID NOT NULL REFERENCES animais(id) ON DELETE CASCADE,
    clinica_id UUID NOT NULL REFERENCES usuarios_clinicas(id) ON DELETE CASCADE,
    veterinario VARCHAR(255),
    data_consulta TIMESTAMP WITH TIME ZONE NOT NULL,
    diagnostico TEXT,
    tratamento TEXT,
    medicamentos TEXT,
    observacoes TEXT,
    proxima_consulta DATE,
    valor DECIMAL(10,2),
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA: vacinas
-- Armazena o histórico de vacinação dos animais
-- =====================================================
CREATE TABLE vacinas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    animal_id UUID NOT NULL REFERENCES animais(id) ON DELETE CASCADE,
    clinica_id UUID REFERENCES usuarios_clinicas(id) ON DELETE SET NULL,
    nome_vacina VARCHAR(255) NOT NULL,
    data_aplicacao DATE NOT NULL,
    data_vencimento DATE,
    lote VARCHAR(100),
    veterinario VARCHAR(255),
    observacoes TEXT,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA: contatos
-- Armazena mensagens enviadas pelo formulário de contato
-- =====================================================
CREATE TABLE contatos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    assunto VARCHAR(255),
    mensagem TEXT NOT NULL,
    respondido BOOLEAN DEFAULT false,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA: configuracoes_usuario
-- Armazena preferências e configurações dos usuários
-- =====================================================
CREATE TABLE configuracoes_usuario (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL,
    tipo_usuario VARCHAR(20) NOT NULL CHECK (tipo_usuario IN ('tutor', 'clinica')),
    tema VARCHAR(20) DEFAULT 'claro' CHECK (tema IN ('claro', 'escuro')),
    idioma VARCHAR(10) DEFAULT 'pt-BR',
    tamanho_fonte VARCHAR(20) DEFAULT 'medio' CHECK (tamanho_fonte IN ('pequeno', 'medio', 'grande')),
    notificacoes_email BOOLEAN DEFAULT true,
    notificacoes_sms BOOLEAN DEFAULT false,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(usuario_id, tipo_usuario)
);

-- =====================================================
-- TABELA: itens (conforme especificação)
-- Tabela fictícia para CRUD completo
-- =====================================================
CREATE TABLE itens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    categoria VARCHAR(100),
    ativo BOOLEAN DEFAULT true,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA OTIMIZAÇÃO DE PERFORMANCE
-- =====================================================

-- Índices para usuarios_tutores
CREATE INDEX idx_usuarios_tutores_email ON usuarios_tutores(email);
CREATE INDEX idx_usuarios_tutores_ativo ON usuarios_tutores(ativo);

-- Índices para usuarios_clinicas
CREATE INDEX idx_usuarios_clinicas_email ON usuarios_clinicas(email);
CREATE INDEX idx_usuarios_clinicas_ativo ON usuarios_clinicas(ativo);

-- Índices para animais
CREATE INDEX idx_animais_tutor_id ON animais(tutor_id);
CREATE INDEX idx_animais_clinica_id ON animais(clinica_id);
CREATE INDEX idx_animais_nome ON animais(nome);
CREATE INDEX idx_animais_ativo ON animais(ativo);

-- Índices para agendamentos
CREATE INDEX idx_agendamentos_tutor_id ON agendamentos(tutor_id);
CREATE INDEX idx_agendamentos_clinica_id ON agendamentos(clinica_id);
CREATE INDEX idx_agendamentos_animal_id ON agendamentos(animal_id);
CREATE INDEX idx_agendamentos_data ON agendamentos(data_agendamento);
CREATE INDEX idx_agendamentos_status ON agendamentos(status);

-- Índices para consultas
CREATE INDEX idx_consultas_animal_id ON consultas(animal_id);
CREATE INDEX idx_consultas_clinica_id ON consultas(clinica_id);
CREATE INDEX idx_consultas_data ON consultas(data_consulta);

-- Índices para vacinas
CREATE INDEX idx_vacinas_animal_id ON vacinas(animal_id);
CREATE INDEX idx_vacinas_data_aplicacao ON vacinas(data_aplicacao);

-- =====================================================
-- TRIGGERS PARA ATUALIZAÇÃO AUTOMÁTICA DE TIMESTAMPS
-- =====================================================

-- Função para atualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para tabelas com campo atualizado_em
CREATE TRIGGER update_usuarios_tutores_updated_at BEFORE UPDATE ON usuarios_tutores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_usuarios_clinicas_updated_at BEFORE UPDATE ON usuarios_clinicas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_animais_updated_at BEFORE UPDATE ON animais FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_agendamentos_updated_at BEFORE UPDATE ON agendamentos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_configuracoes_usuario_updated_at BEFORE UPDATE ON configuracoes_usuario FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_itens_updated_at BEFORE UPDATE ON itens FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- POLÍTICAS RLS (ROW LEVEL SECURITY) - OPCIONAL
-- Para maior segurança, descomente se necessário
-- =====================================================

-- ALTER TABLE usuarios_tutores ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE usuarios_clinicas ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE animais ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- DADOS INICIAIS DE EXEMPLO (OPCIONAL)
-- =====================================================

-- Inserir algumas categorias de exemplo para itens
INSERT INTO itens (nome, descricao, categoria) VALUES 
('Exemplo Item 1', 'Descrição do primeiro item de exemplo', 'Categoria A'),
('Exemplo Item 2', 'Descrição do segundo item de exemplo', 'Categoria B'),
('Exemplo Item 3', 'Descrição do terceiro item de exemplo', 'Categoria A');

-- =====================================================
-- VIEWS ÚTEIS PARA CONSULTAS
-- =====================================================

-- View para listar animais com informações do tutor
CREATE VIEW view_animais_completo AS
SELECT 
    a.id,
    a.nome AS nome_animal,
    a.especie,
    a.raca,
    a.idade,
    a.sexo,
    a.foto_url,
    a.qr_code_url,
    t.nome AS nome_tutor,
    t.email AS email_tutor,
    t.telefone AS telefone_tutor,
    c.nome_clinica,
    a.criado_em
FROM animais a
JOIN usuarios_tutores t ON a.tutor_id = t.id
LEFT JOIN usuarios_clinicas c ON a.clinica_id = c.id
WHERE a.ativo = true;

-- View para agendamentos com informações completas
CREATE VIEW view_agendamentos_completo AS
SELECT 
    ag.id,
    ag.data_agendamento,
    ag.horario,
    ag.tipo_consulta,
    ag.status,
    ag.observacoes,
    an.nome AS nome_animal,
    an.especie,
    t.nome AS nome_tutor,
    t.email AS email_tutor,
    t.telefone AS telefone_tutor,
    c.nome_clinica,
    c.email AS email_clinica,
    ag.criado_em
FROM agendamentos ag
JOIN animais an ON ag.animal_id = an.id
JOIN usuarios_tutores t ON ag.tutor_id = t.id
JOIN usuarios_clinicas c ON ag.clinica_id = c.id;

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================

-- Para executar este script no Supabase:
-- 1. Acesse o painel do Supabase
-- 2. Vá em "SQL Editor"
-- 3. Cole este script completo
-- 4. Execute clicando em "Run"
-- 5. Verifique se todas as tabelas foram criadas em "Table Editor"

