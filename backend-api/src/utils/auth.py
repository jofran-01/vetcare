import bcrypt
import jwt
import os
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify, current_app

def hash_password(password: str) -> str:
    """
    Gera hash da senha usando bcrypt
    """
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    """
    Verifica se a senha corresponde ao hash
    """
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def generate_token(user_id: str, user_type: str) -> str:
    """
    Gera token JWT para autenticação
    """
    payload = {
        'user_id': user_id,
        'user_type': user_type,  # 'tutor' ou 'clinica'
        'exp': datetime.utcnow() + timedelta(days=7),  # Token válido por 7 dias
        'iat': datetime.utcnow()
    }
    return jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')

def verify_token(token: str) -> dict:
    """
    Verifica e decodifica token JWT
    """
    try:
        payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def token_required(f):
    """
    Decorator para rotas que requerem autenticação
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Verificar se o token está no header Authorization
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]  # Bearer TOKEN
            except IndexError:
                return jsonify({'message': 'Token inválido'}), 401
        
        if not token:
            return jsonify({'message': 'Token não fornecido'}), 401
        
        try:
            data = verify_token(token)
            if data is None:
                return jsonify({'message': 'Token inválido ou expirado'}), 401
            
            current_user = {
                'id': data['user_id'],
                'type': data['user_type']
            }
            
        except Exception as e:
            return jsonify({'message': 'Token inválido'}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated

def validate_email(email: str) -> bool:
    """
    Validação básica de email
    """
    import re
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password: str) -> tuple[bool, str]:
    """
    Validação de senha
    Retorna (is_valid, message)
    """
    if len(password) < 6:
        return False, "A senha deve ter pelo menos 6 caracteres"
    
    if not any(c.isdigit() for c in password):
        return False, "A senha deve conter pelo menos um número"
    
    if not any(c.isalpha() for c in password):
        return False, "A senha deve conter pelo menos uma letra"
    
    return True, "Senha válida"

def validate_phone(phone: str) -> bool:
    """
    Validação básica de telefone brasileiro
    """
    import re
    # Remove caracteres não numéricos
    phone_clean = re.sub(r'\D', '', phone)
    
    # Verifica se tem 10 ou 11 dígitos (com DDD)
    return len(phone_clean) in [10, 11] and phone_clean.isdigit()

