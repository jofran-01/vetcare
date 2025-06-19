from flask import Blueprint, request, jsonify
from src.config.database import supabase
from src.utils.auth import token_required
import qrcode
import io
import base64
import os

animals_bp = Blueprint('animals', __name__)

@animals_bp.route('/', methods=['GET'])
@token_required
def get_animals(current_user):
    """
    Listar animais do usuário logado
    """
    try:
        if current_user['type'] == 'tutor':
            # Tutores veem apenas seus próprios animais
            result = supabase.table('animais').select('*').eq('tutor_id', current_user['id']).eq('ativo', True).execute()
        else:
            # Clínicas veem animais associados a elas
            result = supabase.table('animais').select('*').eq('clinica_id', current_user['id']).eq('ativo', True).execute()
        
        return jsonify({
            'animals': result.data
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

@animals_bp.route('/', methods=['POST'])
@token_required
def create_animal(current_user):
    """
    Cadastrar novo animal
    """
    try:
        data = request.get_json()
        
        # Validação dos campos obrigatórios
        required_fields = ['nome', 'especie']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Campo {field} é obrigatório'}), 400
        
        # Apenas tutores podem cadastrar animais inicialmente
        if current_user['type'] != 'tutor':
            return jsonify({'error': 'Apenas tutores podem cadastrar animais'}), 403
        
        animal_data = {
            'nome': data['nome'].strip(),
            'especie': data['especie'].strip(),
            'raca': data.get('raca', '').strip(),
            'idade': data.get('idade'),
            'peso': data.get('peso'),
            'cor': data.get('cor', '').strip(),
            'sexo': data.get('sexo'),
            'castrado': data.get('castrado', False),
            'historico_medico': data.get('historico_medico', '').strip(),
            'observacoes': data.get('observacoes', '').strip(),
            'tutor_id': current_user['id']
        }
        
        # Validar sexo se fornecido
        if animal_data['sexo'] and animal_data['sexo'] not in ['Macho', 'Fêmea']:
            return jsonify({'error': 'Sexo deve ser "Macho" ou "Fêmea"'}), 400
        
        result = supabase.table('animais').insert(animal_data).execute()
        
        if result.data:
            animal = result.data[0]
            
            # Gerar QR Code
            qr_code_url = generate_qr_code(animal['id'])
            
            # Atualizar animal com URL do QR Code
            supabase.table('animais').update({'qr_code_url': qr_code_url}).eq('id', animal['id']).execute()
            
            animal['qr_code_url'] = qr_code_url
            
            return jsonify({
                'message': 'Animal cadastrado com sucesso',
                'animal': animal
            }), 201
        else:
            return jsonify({'error': 'Erro ao cadastrar animal'}), 500
            
    except Exception as e:
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

@animals_bp.route('/<animal_id>', methods=['GET'])
def get_animal_by_id(animal_id):
    """
    Buscar animal por ID (público para QR Code)
    """
    try:
        result = supabase.table('view_animais_completo').select('*').eq('id', animal_id).execute()
        
        if not result.data:
            return jsonify({'error': 'Animal não encontrado'}), 404
        
        return jsonify({
            'animal': result.data[0]
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

@animals_bp.route('/<animal_id>', methods=['PUT'])
@token_required
def update_animal(current_user, animal_id):
    """
    Atualizar dados do animal
    """
    try:
        # Verificar se o animal existe e se o usuário tem permissão
        animal_result = supabase.table('animais').select('*').eq('id', animal_id).eq('ativo', True).execute()
        
        if not animal_result.data:
            return jsonify({'error': 'Animal não encontrado'}), 404
        
        animal = animal_result.data[0]
        
        # Verificar permissões
        if current_user['type'] == 'tutor' and animal['tutor_id'] != current_user['id']:
            return jsonify({'error': 'Sem permissão para editar este animal'}), 403
        elif current_user['type'] == 'clinica' and animal['clinica_id'] != current_user['id']:
            return jsonify({'error': 'Sem permissão para editar este animal'}), 403
        
        data = request.get_json()
        
        # Campos que podem ser atualizados
        updatable_fields = ['nome', 'especie', 'raca', 'idade', 'peso', 'cor', 'sexo', 'castrado', 'historico_medico', 'observacoes']
        
        update_data = {}
        for field in updatable_fields:
            if field in data:
                update_data[field] = data[field]
        
        # Validar sexo se fornecido
        if 'sexo' in update_data and update_data['sexo'] and update_data['sexo'] not in ['Macho', 'Fêmea']:
            return jsonify({'error': 'Sexo deve ser "Macho" ou "Fêmea"'}), 400
        
        if update_data:
            result = supabase.table('animais').update(update_data).eq('id', animal_id).execute()
            
            if result.data:
                return jsonify({
                    'message': 'Animal atualizado com sucesso',
                    'animal': result.data[0]
                }), 200
            else:
                return jsonify({'error': 'Erro ao atualizar animal'}), 500
        else:
            return jsonify({'error': 'Nenhum campo para atualizar'}), 400
            
    except Exception as e:
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

@animals_bp.route('/search', methods=['GET'])
@token_required
def search_animals(current_user):
    """
    Pesquisar animais por nome, tutor ou código
    """
    try:
        query = request.args.get('q', '').strip()
        
        if not query:
            return jsonify({'error': 'Parâmetro de busca é obrigatório'}), 400
        
        # Buscar na view que já traz dados completos
        result = supabase.table('view_animais_completo').select('*').or_(
            f'nome_animal.ilike.%{query}%,nome_tutor.ilike.%{query}%,id.eq.{query}'
        ).execute()
        
        return jsonify({
            'animals': result.data
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

def generate_qr_code(animal_id):
    """
    Gerar QR Code para o animal
    """
    try:
        # URL que será codificada no QR Code
        base_url = os.getenv('QR_CODE_BASE_URL', 'http://localhost:3000/animal/')
        qr_url = f"{base_url}{animal_id}"
        
        # Gerar QR Code
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(qr_url)
        qr.make(fit=True)
        
        # Criar imagem
        img = qr.make_image(fill_color="black", back_color="white")
        
        # Converter para base64
        buffer = io.BytesIO()
        img.save(buffer, format='PNG')
        img_str = base64.b64encode(buffer.getvalue()).decode()
        
        return f"data:image/png;base64,{img_str}"
        
    except Exception as e:
        print(f"Erro ao gerar QR Code: {e}")
        return None

