from flask import Blueprint, request, jsonify
from src.config.database import supabase
from src.utils.auth import hash_password, verify_password, generate_token, validate_email, validate_password, validate_phone
import uuid

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register/tutor', methods=['POST'])
def register_tutor():
    """
    Cadastro de tutor
    """
    try:
        data = request.get_json()
        
        # Validação dos campos obrigatórios
        required_fields = ['nome', 'email', 'senha', 'telefone']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Campo {field} é obrigatório'}), 400
        
        nome = data['nome'].strip()
        email = data['email'].strip().lower()
        senha = data['senha']
        telefone = data['telefone'].strip()
        endereco = data.get('endereco', '').strip()
        cidade = data.get('cidade', '').strip()
        estado = data.get('estado', '').strip()
        cep = data.get('cep', '').strip()
        
        # Validações
        if not validate_email(email):
            return jsonify({'error': 'Email inválido'}), 400
        
        is_valid_password, password_message = validate_password(senha)
        if not is_valid_password:
            return jsonify({'error': password_message}), 400
        
        if not validate_phone(telefone):
            return jsonify({'error': 'Telefone inválido'}), 400
        
        # Verificar se email já existe
        existing_user = supabase.table('usuarios_tutores').select('id').eq('email', email).execute()
        if existing_user.data:
            return jsonify({'error': 'Email já cadastrado'}), 409
        
        # Hash da senha
        senha_hash = hash_password(senha)
        
        # Inserir no banco
        user_data = {
            'nome': nome,
            'email': email,
            'senha_hash': senha_hash,
            'telefone': telefone,
            'endereco': endereco,
            'cidade': cidade,
            'estado': estado,
            'cep': cep
        }
        
        result = supabase.table('usuarios_tutores').insert(user_data).execute()
        
        if result.data:
            user = result.data[0]
            # Gerar token
            token = generate_token(user['id'], 'tutor')
            
            return jsonify({
                'message': 'Tutor cadastrado com sucesso',
                'token': token,
                'user': {
                    'id': user['id'],
                    'nome': user['nome'],
                    'email': user['email'],
                    'type': 'tutor'
                }
            }), 201
        else:
            return jsonify({'error': 'Erro ao cadastrar tutor'}), 500
            
    except Exception as e:
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

@auth_bp.route('/register/clinica', methods=['POST'])
def register_clinica():
    """
    Cadastro de clínica veterinária
    """
    try:
        data = request.get_json()
        
        # Validação dos campos obrigatórios
        required_fields = ['nome_clinica', 'email', 'senha', 'telefone']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Campo {field} é obrigatório'}), 400
        
        nome_clinica = data['nome_clinica'].strip()
        email = data['email'].strip().lower()
        senha = data['senha']
        telefone = data['telefone'].strip()
        endereco = data.get('endereco', '').strip()
        cidade = data.get('cidade', '').strip()
        estado = data.get('estado', '').strip()
        cep = data.get('cep', '').strip()
        cnpj = data.get('cnpj', '').strip()
        responsavel_tecnico = data.get('responsavel_tecnico', '').strip()
        crmv = data.get('crmv', '').strip()
        
        # Validações
        if not validate_email(email):
            return jsonify({'error': 'Email inválido'}), 400
        
        is_valid_password, password_message = validate_password(senha)
        if not is_valid_password:
            return jsonify({'error': password_message}), 400
        
        if not validate_phone(telefone):
            return jsonify({'error': 'Telefone inválido'}), 400
        
        # Verificar se email já existe
        existing_user = supabase.table('usuarios_clinicas').select('id').eq('email', email).execute()
        if existing_user.data:
            return jsonify({'error': 'Email já cadastrado'}), 409
        
        # Hash da senha
        senha_hash = hash_password(senha)
        
        # Inserir no banco
        user_data = {
            'nome_clinica': nome_clinica,
            'email': email,
            'senha_hash': senha_hash,
            'telefone': telefone,
            'endereco': endereco,
            'cidade': cidade,
            'estado': estado,
            'cep': cep,
            'cnpj': cnpj,
            'responsavel_tecnico': responsavel_tecnico,
            'crmv': crmv
        }
        
        result = supabase.table('usuarios_clinicas').insert(user_data).execute()
        
        if result.data:
            user = result.data[0]
            # Gerar token
            token = generate_token(user['id'], 'clinica')
            
            return jsonify({
                'message': 'Clínica cadastrada com sucesso',
                'token': token,
                'user': {
                    'id': user['id'],
                    'nome_clinica': user['nome_clinica'],
                    'email': user['email'],
                    'type': 'clinica'
                }
            }), 201
        else:
            return jsonify({'error': 'Erro ao cadastrar clínica'}), 500
            
    except Exception as e:
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """
    Login para tutores e clínicas
    """
    try:
        data = request.get_json()
        
        if not data.get('email') or not data.get('senha'):
            return jsonify({'error': 'Email e senha são obrigatórios'}), 400
        
        email = data['email'].strip().lower()
        senha = data['senha']
        user_type = data.get('tipo', 'tutor')  # 'tutor' ou 'clinica'
        
        if user_type not in ['tutor', 'clinica']:
            return jsonify({'error': 'Tipo de usuário inválido'}), 400
        
        # Buscar usuário na tabela correspondente
        table_name = 'usuarios_tutores' if user_type == 'tutor' else 'usuarios_clinicas'
        
        result = supabase.table(table_name).select('*').eq('email', email).eq('ativo', True).execute()
        
        if not result.data:
            return jsonify({'error': 'Email ou senha incorretos'}), 401
        
        user = result.data[0]
        
        # Verificar senha
        if not verify_password(senha, user['senha_hash']):
            return jsonify({'error': 'Email ou senha incorretos'}), 401
        
        # Gerar token
        token = generate_token(user['id'], user_type)
        
        # Preparar dados do usuário para resposta
        user_data = {
            'id': user['id'],
            'email': user['email'],
            'type': user_type
        }
        
        if user_type == 'tutor':
            user_data['nome'] = user['nome']
        else:
            user_data['nome_clinica'] = user['nome_clinica']
        
        return jsonify({
            'message': 'Login realizado com sucesso',
            'token': token,
            'user': user_data
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

@auth_bp.route('/verify', methods=['GET'])
def verify_token():
    """
    Verificar se o token é válido
    """
    try:
        token = None
        
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]  # Bearer TOKEN
            except IndexError:
                return jsonify({'error': 'Token inválido'}), 401
        
        if not token:
            return jsonify({'error': 'Token não fornecido'}), 401
        
        from src.utils.auth import verify_token as verify_jwt_token
        data = verify_jwt_token(token)
        
        if data is None:
            return jsonify({'error': 'Token inválido ou expirado'}), 401
        
        # Buscar dados atualizados do usuário
        table_name = 'usuarios_tutores' if data['user_type'] == 'tutor' else 'usuarios_clinicas'
        
        result = supabase.table(table_name).select('*').eq('id', data['user_id']).eq('ativo', True).execute()
        
        if not result.data:
            return jsonify({'error': 'Usuário não encontrado'}), 404
        
        user = result.data[0]
        
        user_data = {
            'id': user['id'],
            'email': user['email'],
            'type': data['user_type']
        }
        
        if data['user_type'] == 'tutor':
            user_data['nome'] = user['nome']
        else:
            user_data['nome_clinica'] = user['nome_clinica']
        
        return jsonify({
            'valid': True,
            'user': user_data
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

@auth_bp.route('/logout', methods=['POST'])
def logout():
    """
    Logout (no lado do cliente, apenas remove o token)
    """
    return jsonify({'message': 'Logout realizado com sucesso'}), 200

