import { useState, useEffect } from 'react';
import { Calendar, Plus, Search, Clock, CheckCircle, AlertCircle, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { appointmentsAPI, animalsAPI, utils } from '../../lib/api';

const TutorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    animal_id: '',
    email_clinica: '',
    data_agendamento: '',
    horario: '',
    tipo_consulta: '',
    observacoes: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [appointmentsResponse, animalsResponse] = await Promise.all([
        appointmentsAPI.getAppointments(),
        animalsAPI.getAnimals()
      ]);
      
      setAppointments(appointmentsResponse.appointments || []);
      setAnimals(animalsResponse.animals || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      animal_id: '',
      email_clinica: '',
      data_agendamento: '',
      horario: '',
      tipo_consulta: '',
      observacoes: ''
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');

    try {
      await appointmentsAPI.createAppointment(formData);
      await fetchData();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      setError(error.message || 'Erro ao criar agendamento');
    } finally {
      setFormLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (window.confirm('Tem certeza que deseja cancelar este agendamento?')) {
      try {
        await appointmentsAPI.cancelAppointment(appointmentId);
        await fetchData();
      } catch (error) {
        console.error('Erro ao cancelar agendamento:', error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pendente': return 'text-yellow-600 bg-yellow-100';
      case 'aceito': return 'text-green-600 bg-green-100';
      case 'recusado': return 'text-red-600 bg-red-100';
      case 'concluido': return 'text-blue-600 bg-blue-100';
      case 'cancelado': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pendente': return <Clock className="w-4 h-4" />;
      case 'aceito': return <CheckCircle className="w-4 h-4" />;
      case 'recusado': return <AlertCircle className="w-4 h-4" />;
      case 'concluido': return <CheckCircle className="w-4 h-4" />;
      case 'cancelado': return <X className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = 
      appointment.nome_animal?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.nome_clinica?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.tipo_consulta?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'todos' || appointment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Gerar horários disponíveis
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Agendamentos</h1>
            <p className="text-gray-600 mt-2">
              Gerencie suas consultas veterinárias
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Agendamento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Novo Agendamento</DialogTitle>
                <DialogDescription>
                  Agende uma consulta para seu pet
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="animal_id">Pet *</Label>
                  <Select value={formData.animal_id} onValueChange={(value) => handleSelectChange('animal_id', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o pet" />
                    </SelectTrigger>
                    <SelectContent>
                      {animals.map((animal) => (
                        <SelectItem key={animal.id} value={animal.id.toString()}>
                          {animal.nome} ({animal.especie})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="email_clinica">Email da Clínica *</Label>
                  <Input
                    id="email_clinica"
                    name="email_clinica"
                    type="email"
                    required
                    value={formData.email_clinica}
                    onChange={handleInputChange}
                    placeholder="contato@clinica.com"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="data_agendamento">Data *</Label>
                    <Input
                      id="data_agendamento"
                      name="data_agendamento"
                      type="date"
                      required
                      value={formData.data_agendamento}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <Label htmlFor="horario">Horário *</Label>
                    <Select value={formData.horario} onValueChange={(value) => handleSelectChange('horario', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o horário" />
                      </SelectTrigger>
                      <SelectContent>
                        {generateTimeSlots().map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="tipo_consulta">Tipo de Consulta</Label>
                  <Select value={formData.tipo_consulta} onValueChange={(value) => handleSelectChange('tipo_consulta', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Consulta de Rotina">Consulta de Rotina</SelectItem>
                      <SelectItem value="Vacinação">Vacinação</SelectItem>
                      <SelectItem value="Emergência">Emergência</SelectItem>
                      <SelectItem value="Cirurgia">Cirurgia</SelectItem>
                      <SelectItem value="Exame">Exame</SelectItem>
                      <SelectItem value="Retorno">Retorno</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    name="observacoes"
                    value={formData.observacoes}
                    onChange={handleInputChange}
                    placeholder="Descreva os sintomas ou motivo da consulta..."
                    rows={3}
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                    {error}
                  </div>
                )}

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={formLoading}>
                    {formLoading ? 'Agendando...' : 'Agendar Consulta'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por pet, clínica ou tipo de consulta..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="w-full sm:w-48">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="aceito">Aceito</SelectItem>
                <SelectItem value="recusado">Recusado</SelectItem>
                <SelectItem value="concluido">Concluído</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Appointments List */}
        {filteredAppointments.length === 0 ? (
          <Card className="vet-card">
            <CardContent className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || statusFilter !== 'todos' 
                  ? 'Nenhum agendamento encontrado' 
                  : 'Nenhum agendamento realizado'
                }
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || statusFilter !== 'todos'
                  ? 'Tente ajustar os filtros de busca'
                  : 'Comece agendando sua primeira consulta'
                }
              </p>
              {!searchTerm && statusFilter === 'todos' && (
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Fazer Primeiro Agendamento
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <Card key={appointment.id} className="vet-card">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {appointment.nome_animal}
                        </h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                          {getStatusIcon(appointment.status)}
                          <span className="ml-1 capitalize">{appointment.status}</span>
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Clínica:</span>
                          <p>{appointment.nome_clinica}</p>
                        </div>
                        <div>
                          <span className="font-medium">Data:</span>
                          <p>{utils.formatDate(appointment.data_agendamento)}</p>
                        </div>
                        <div>
                          <span className="font-medium">Horário:</span>
                          <p>{appointment.horario}</p>
                        </div>
                        {appointment.tipo_consulta && (
                          <div>
                            <span className="font-medium">Tipo:</span>
                            <p>{appointment.tipo_consulta}</p>
                          </div>
                        )}
                      </div>

                      {appointment.observacoes && (
                        <div className="mt-3">
                          <span className="font-medium text-sm text-gray-600">Observações:</span>
                          <p className="text-sm text-gray-600 mt-1">{appointment.observacoes}</p>
                        </div>
                      )}

                      {appointment.resposta_clinica && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                          <span className="font-medium text-sm text-blue-800">Resposta da Clínica:</span>
                          <p className="text-sm text-blue-700 mt-1">{appointment.resposta_clinica}</p>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 lg:mt-0 lg:ml-6">
                      {appointment.status === 'pendente' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelAppointment(appointment.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorAppointments;

