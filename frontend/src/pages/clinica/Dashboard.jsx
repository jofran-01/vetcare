import { useState, useEffect } from 'react';
import { Calendar, Users, CheckCircle, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../hooks/useAuth';
import { appointmentsAPI, utils } from '../../lib/api';

const ClinicaDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPatients: 0,
    pendingAppointments: 0,
    todayAppointments: 0,
    monthlyRevenue: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const appointmentsResponse = await appointmentsAPI.getClinicaAppointments();
        setAppointments(appointmentsResponse.appointments || []);

        // Calcular estatísticas
        const today = new Date().toISOString().split('T')[0];
        const thisMonth = new Date().getMonth();
        const thisYear = new Date().getFullYear();

        const pending = appointmentsResponse.appointments?.filter(apt => apt.status === 'pendente').length || 0;
        const todayApts = appointmentsResponse.appointments?.filter(apt => 
          apt.data_agendamento === today
        ).length || 0;
        
        // Simular dados de pacientes únicos e receita
        const uniquePatients = new Set(appointmentsResponse.appointments?.map(apt => apt.animal_id)).size || 0;
        const monthlyRevenue = appointmentsResponse.appointments?.filter(apt => {
          const aptDate = new Date(apt.data_agendamento);
          return aptDate.getMonth() === thisMonth && aptDate.getFullYear() === thisYear && apt.status === 'concluido';
        }).length * 150 || 0; // Simulando R$ 150 por consulta

        setStats({
          totalPatients: uniquePatients,
          pendingAppointments: pending,
          todayAppointments: todayApts,
          monthlyRevenue: monthlyRevenue
        });
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pendente': return 'text-yellow-600 bg-yellow-100';
      case 'aceito': return 'text-green-600 bg-green-100';
      case 'recusado': return 'text-red-600 bg-red-100';
      case 'concluido': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pendente': return <Clock className="w-4 h-4" />;
      case 'aceito': return <CheckCircle className="w-4 h-4" />;
      case 'recusado': return <AlertCircle className="w-4 h-4" />;
      case 'concluido': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Bem-vinda, {user?.nome_clinica}! 🏥
          </h1>
          <p className="text-gray-600 mt-2">
            Painel de controle da sua clínica veterinária. Gerencie agendamentos e pacientes.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="vet-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pacientes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPatients}</div>
              <p className="text-xs text-muted-foreground">
                Total de animais atendidos
              </p>
            </CardContent>
          </Card>

          <Card className="vet-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingAppointments}</div>
              <p className="text-xs text-muted-foreground">
                Agendamentos aguardando resposta
              </p>
            </CardContent>
          </Card>

          <Card className="vet-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hoje</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.todayAppointments}</div>
              <p className="text-xs text-muted-foreground">
                Consultas agendadas para hoje
              </p>
            </CardContent>
          </Card>

          <Card className="vet-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {stats.monthlyRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Faturamento do mês atual
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Agendamentos Pendentes */}
          <Card className="vet-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Agendamentos Pendentes</CardTitle>
                  <CardDescription>
                    Solicitações aguardando sua resposta
                  </CardDescription>
                </div>
                <a href="/dashboard/clinica/agendamentos">
                  <Button size="sm">Ver Todos</Button>
                </a>
              </div>
            </CardHeader>
            <CardContent>
              {appointments.filter(apt => apt.status === 'pendente').length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Nenhum agendamento pendente
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments
                    .filter(apt => apt.status === 'pendente')
                    .slice(0, 3)
                    .map((appointment) => (
                    <div key={appointment.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">
                          {appointment.nome_animal}
                        </h4>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                          {getStatusIcon(appointment.status)}
                          <span className="ml-1 capitalize">{appointment.status}</span>
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Tutor: {appointment.nome_tutor}</p>
                        <p>
                          {utils.formatDate(appointment.data_agendamento)} às {appointment.horario}
                        </p>
                        {appointment.tipo_consulta && (
                          <p className="text-primary">{appointment.tipo_consulta}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Consultas de Hoje */}
          <Card className="vet-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Consultas de Hoje</CardTitle>
                  <CardDescription>
                    Agendamentos confirmados para hoje
                  </CardDescription>
                </div>
                <a href="/dashboard/clinica/agendamentos">
                  <Button size="sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    Agenda
                  </Button>
                </a>
              </div>
            </CardHeader>
            <CardContent>
              {appointments.filter(apt => 
                apt.data_agendamento === new Date().toISOString().split('T')[0] && 
                apt.status === 'aceito'
              ).length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Nenhuma consulta agendada para hoje
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments
                    .filter(apt => 
                      apt.data_agendamento === new Date().toISOString().split('T')[0] && 
                      apt.status === 'aceito'
                    )
                    .slice(0, 3)
                    .map((appointment) => (
                    <div key={appointment.id} className="p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">
                          {appointment.nome_animal}
                        </h4>
                        <span className="text-sm font-medium text-green-600">
                          {appointment.horario}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Tutor: {appointment.nome_tutor}</p>
                        {appointment.tipo_consulta && (
                          <p className="text-primary">{appointment.tipo_consulta}</p>
                        )}
                        {appointment.observacoes && (
                          <p className="text-gray-500 text-xs mt-1">
                            {appointment.observacoes.substring(0, 50)}...
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="/dashboard/clinica/agendamentos">
              <Card className="vet-card hover:scale-105 transition-transform duration-200 cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Calendar className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-medium text-gray-900 mb-1">Gerenciar Agenda</h3>
                  <p className="text-sm text-gray-600">
                    Visualizar e responder agendamentos
                  </p>
                </CardContent>
              </Card>
            </a>

            <a href="/dashboard/clinica/animais">
              <Card className="vet-card hover:scale-105 transition-transform duration-200 cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Users className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-medium text-gray-900 mb-1">Pacientes</h3>
                  <p className="text-sm text-gray-600">
                    Visualizar histórico de pacientes
                  </p>
                </CardContent>
              </Card>
            </a>

            <a href="/dashboard/clinica/configuracoes">
              <Card className="vet-card hover:scale-105 transition-transform duration-200 cursor-pointer">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-medium text-gray-900 mb-1">Configurações</h3>
                  <p className="text-sm text-gray-600">
                    Atualizar dados da clínica
                  </p>
                </CardContent>
              </Card>
            </a>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <Card className="vet-card">
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
              <CardDescription>
                Últimas ações realizadas na sua clínica
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appointments.slice(0, 5).map((appointment, index) => (
                  <div key={appointment.id} className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{appointment.nome_animal}</span> - 
                        Agendamento {appointment.status}
                      </p>
                      <p className="text-xs text-gray-500">
                        {utils.formatDateTime(appointment.criado_em)}
                      </p>
                    </div>
                  </div>
                ))}
                {appointments.length === 0 && (
                  <p className="text-gray-600 text-center py-4">
                    Nenhuma atividade recente
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClinicaDashboard;

