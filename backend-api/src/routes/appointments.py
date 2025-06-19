from flask import Blueprint, request, jsonify
from src.config.database import supabase
from src.utils.auth import token_required
from datetime import datetime, date

appointments_bp = Blueprint('appointments', __name__)

@appointments_bp.route('/', methods=['GET'])
@token_required
def get_appointments(current_user):
    """
    Listar agendamentos do usuário logado
    """
    try:
        if current_user['type'] == 'tutor':
            # Tutores veem seus próprios agendamentos
            result = supabase.table('view_agendamentos_completo').select('*').eq('tutor_id', current_user['id']).execute()
        else:
            # Clínicas veem agendamentos direcionados a elas
            result = supabase.table('view_agendamentos_completo').select('*').eq('clinica_id', current_user['id']).execute()
        
        return jsonify({
            'appointments': result.data
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

@appointments_bp.route('/', methods=['POST'])
@token_required
def create_appointment(current_user):
    """
    Criar novo agendamento (apenas tutores)
    """
    try:
        if current_user['type'] != 'tutor':
            return jsonify({'error': 'Apenas tutores podem criar agendamentos'}), 403
        
        data = request.get_json()
        
        # Validação dos campos obrigatórios
        required_fields = ['animal_id', 'email_clinica', 'data_agendamento', 'horario']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Campo {field} é obrigatório'}), 400
        
        animal_id = data['animal_id']
        email_clinica = data['email_clinica'].strip().lower()
        data_agendamento = data['data_agendamento']
        horario = data['horario']
        tipo_consulta = data.get('tipo_consulta', 'Consulta Geral')
        observacoes = data.get('observacoes', '').strip()
        
        # Verificar se o animal pertence ao tutor
        animal_result = supabase.table('animais').select('*').eq('id', animal_id).eq('tutor_id', current_user['id']).eq('ativo', True).execute()
        
        if not animal_result.data:
            return jsonify({'error': 'Animal não encontrado ou não pertence ao tutor'}), 404
        
        # Buscar clínica pelo email
        clinica_result = supabase.table('usuarios_clinicas').select('id').eq('email', email_clinica).eq('ativo', True).execute()
        
        if not clinica_result.data:
            return jsonify({'error': 'Clínica não encontrada com este email'}), 404
        
        clinica_id = clinica_result.data[0]['id']
        
        # Validar data (não pode ser no passado)
        try:
            appointment_date = datetime.strptime(data_agendamento, '%Y-%m-%d').date()
            if appointment_date < date.today():
                return jsonify({'error': 'Data do agendamento não pode ser no passado'}), 400
        except ValueError:
            return jsonify({'error': 'Formato de data inválido. Use YYYY-MM-DD'}), 400
        
        # Validar horário
        try:
            datetime.strptime(horario, '%H:%M')
        except ValueError:
            return jsonify({'error': 'Formato de horário inválido. Use HH:MM'}), 400
        
        # Verificar se já existe agendamento no mesmo horário
        existing_appointment = supabase.table('agendamentos').select('id').eq('clinica_id', clinica_id).eq('data_agendamento', data_agendamento).eq('horario', horario).in_('status', ['pendente', 'aceito']).execute()
        
        if existing_appointment.data:
            return jsonify({'error': 'Já existe um agendamento neste horário'}), 409
        
        # Criar agendamento
        appointment_data = {
            'tutor_id': current_user['id'],
            'clinica_id': clinica_id,
            'animal_id': animal_id,
            'data_agendamento': data_agendamento,
            'horario': horario,
            'tipo_consulta': tipo_consulta,
            'observacoes': observacoes,
            'status': 'pendente'
        }
        
        result = supabase.table('agendamentos').insert(appointment_data).execute()
        
        if result.data:
            return jsonify({
                'message': 'Agendamento criado com sucesso',
                'appointment': result.data[0]
            }), 201
        else:
            return jsonify({'error': 'Erro ao criar agendamento'}), 500
            
    except Exception as e:
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

@appointments_bp.route('/<appointment_id>/status', methods=['PUT'])
@token_required
def update_appointment_status(current_user, appointment_id):
    """
    Atualizar status do agendamento (apenas clínicas)
    """
    try:
        if current_user['type'] != 'clinica':
            return jsonify({'error': 'Apenas clínicas podem alterar status de agendamentos'}), 403
        
        data = request.get_json()
        
        if not data.get('status'):
            return jsonify({'error': 'Status é obrigatório'}), 400
        
        new_status = data['status']
        motivo_recusa = data.get('motivo_recusa', '').strip()
        
        # Validar status
        valid_statuses = ['aceito', 'recusado']
        if new_status not in valid_statuses:
            return jsonify({'error': f'Status deve ser um dos: {", ".join(valid_statuses)}'}), 400
        
        # Se recusado, motivo é obrigatório
        if new_status == 'recusado' and not motivo_recusa:
            return jsonify({'error': 'Motivo da recusa é obrigatório'}), 400
        
        # Verificar se o agendamento existe e pertence à clínica
        appointment_result = supabase.table('agendamentos').select('*').eq('id', appointment_id).eq('clinica_id', current_user['id']).execute()
        
        if not appointment_result.data:
            return jsonify({'error': 'Agendamento não encontrado'}), 404
        
        appointment = appointment_result.data[0]
        
        # Verificar se ainda está pendente
        if appointment['status'] != 'pendente':
            return jsonify({'error': 'Agendamento já foi processado'}), 400
        
        # Atualizar status
        update_data = {
            'status': new_status
        }
        
        if new_status == 'recusado':
            update_data['motivo_recusa'] = motivo_recusa
        
        result = supabase.table('agendamentos').update(update_data).eq('id', appointment_id).execute()
        
        if result.data:
            return jsonify({
                'message': f'Agendamento {new_status} com sucesso',
                'appointment': result.data[0]
            }), 200
        else:
            return jsonify({'error': 'Erro ao atualizar agendamento'}), 500
            
    except Exception as e:
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

@appointments_bp.route('/<appointment_id>', methods=['DELETE'])
@token_required
def cancel_appointment(current_user, appointment_id):
    """
    Cancelar agendamento (tutores podem cancelar seus próprios)
    """
    try:
        # Verificar se o agendamento existe
        if current_user['type'] == 'tutor':
            appointment_result = supabase.table('agendamentos').select('*').eq('id', appointment_id).eq('tutor_id', current_user['id']).execute()
        else:
            appointment_result = supabase.table('agendamentos').select('*').eq('id', appointment_id).eq('clinica_id', current_user['id']).execute()
        
        if not appointment_result.data:
            return jsonify({'error': 'Agendamento não encontrado'}), 404
        
        appointment = appointment_result.data[0]
        
        # Verificar se pode ser cancelado
        if appointment['status'] in ['concluido', 'cancelado']:
            return jsonify({'error': 'Agendamento não pode ser cancelado'}), 400
        
        # Atualizar status para cancelado
        result = supabase.table('agendamentos').update({'status': 'cancelado'}).eq('id', appointment_id).execute()
        
        if result.data:
            return jsonify({
                'message': 'Agendamento cancelado com sucesso'
            }), 200
        else:
            return jsonify({'error': 'Erro ao cancelar agendamento'}), 500
            
    except Exception as e:
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

@appointments_bp.route('/available-times', methods=['GET'])
def get_available_times():
    """
    Buscar horários disponíveis para uma clínica em uma data específica
    """
    try:
        email_clinica = request.args.get('email_clinica')
        data_agendamento = request.args.get('data')
        
        if not email_clinica or not data_agendamento:
            return jsonify({'error': 'Email da clínica e data são obrigatórios'}), 400
        
        # Buscar clínica
        clinica_result = supabase.table('usuarios_clinicas').select('id, horario_funcionamento').eq('email', email_clinica.lower()).eq('ativo', True).execute()
        
        if not clinica_result.data:
            return jsonify({'error': 'Clínica não encontrada'}), 404
        
        clinica = clinica_result.data[0]
        
        # Buscar agendamentos já marcados nesta data
        appointments_result = supabase.table('agendamentos').select('horario').eq('clinica_id', clinica['id']).eq('data_agendamento', data_agendamento).in_('status', ['pendente', 'aceito']).execute()
        
        occupied_times = [apt['horario'] for apt in appointments_result.data]
        
        # Horários padrão (pode ser customizado por clínica no futuro)
        default_times = [
            '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
            '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
            '16:00', '16:30', '17:00', '17:30'
        ]
        
        available_times = [time for time in default_times if time not in occupied_times]
        
        return jsonify({
            'available_times': available_times,
            'occupied_times': occupied_times
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

