from flask import Blueprint, request, jsonify
from src.config.database import supabase

contact_bp = Blueprint('contact', __name__)

@contact_bp.route('/', methods=['POST'])
def create_contact():
    """
    Criar nova mensagem de contato
    """
    try:
        data = request.get_json()
        
        # Validação dos campos obrigatórios
        required_fields = ['nome', 'email', 'mensagem']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Campo {field} é obrigatório'}), 400
        
        nome = data['nome'].strip()
        email = data['email'].strip().lower()
        telefone = data.get('telefone', '').strip()
        assunto = data.get('assunto', '').strip()
        mensagem = data['mensagem'].strip()
        
        # Validação básica de email
        import re
        if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email):
            return jsonify({'error': 'Email inválido'}), 400
        
        # Inserir no banco
        contact_data = {
            'nome': nome,
            'email': email,
            'telefone': telefone,
            'assunto': assunto,
            'mensagem': mensagem
        }
        
        result = supabase.table('contatos').insert(contact_data).execute()
        
        if result.data:
            return jsonify({
                'message': 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
                'contact': result.data[0]
            }), 201
        else:
            return jsonify({'error': 'Erro ao enviar mensagem'}), 500
            
    except Exception as e:
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

@contact_bp.route('/', methods=['GET'])
def get_contacts():
    """
    Listar mensagens de contato (para administração)
    """
    try:
        # Esta rota pode ser protegida com autenticação de admin no futuro
        result = supabase.table('contatos').select('*').order('criado_em', desc=True).execute()
        
        return jsonify({
            'contacts': result.data
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

@contact_bp.route('/<contact_id>/respond', methods=['PUT'])
def mark_as_responded(contact_id):
    """
    Marcar mensagem como respondida
    """
    try:
        result = supabase.table('contatos').update({'respondido': True}).eq('id', contact_id).execute()
        
        if result.data:
            return jsonify({
                'message': 'Mensagem marcada como respondida'
            }), 200
        else:
            return jsonify({'error': 'Mensagem não encontrada'}), 404
            
    except Exception as e:
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

