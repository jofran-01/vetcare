import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PawPrint, Calendar, Plus, Heart, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../hooks/useAuth';
import { animalsAPI, appointmentsAPI, utils } from '../../lib/api';

const TutorDashboard = () => {
  const { user } = useAuth();
  const [animals, setAnimals] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAnimals: 0,
    pendingAppointments: 0,
    upcomingAppointments: 0,
    completedAppointments: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [animalsResponse, appointmentsResponse] = await Promise.all([
          animalsAPI.getAnimals(),
          appointmentsAPI.getAppointments()
        ]);

        setAnimals(animalsResponse.animals || []);
        setAppointments(appointmentsResponse.appointments || []);

        // Calcular estatísticas
        const totalAnimals = animalsResponse.animals?.length || 0;
        const pending = appointmentsResponse.appointments?.filter(apt => apt.status === 'pendente').length || 0;
        const upcoming = appointmentsResponse.appointments?.filter(apt => 
          apt.status === 'aceito' && new Date(apt.data_agendamento) >= new Date()
        ).length || 0;
        const completed = appointmentsResponse.appointments?.filter(apt => apt.status === 'concluido').length || 0;

        setStats({
          totalAnimals,
          pendingAppointments: pending,
          upcomingAppointments: upcoming,
          completedAppointments: completed
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
            Olá, {user?.nome}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Bem-vindo ao seu painel de controle. Aqui você pode gerenciar seus pets e agendamentos.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="vet-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Meus Pets</CardTitle>
              <PawPrint className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAnimals}</div>
              <p className="text-xs text-muted-foreground">
                Total de animais cadastrados
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
              <CardTitle className="text-sm font-medium">Próximas</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.upcomingAppointments}</div>
              <p className="text-xs text-muted-foreground">
                Consultas confirmadas
              </p>
            </CardContent>
          </Card>

          <Card className="vet-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedAppointments}</div>
              <p className="text-xs text-muted-foreground">
                Consultas realizadas
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Meus Pets */}
          <Card className="vet-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Meus Pets</CardTitle>
                  <CardDescription>
                    Seus animais cadastrados no sistema
                  </CardDescription>
                </div>
                <Link to="/dashboard/tutor/animais">
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {animals.length === 0 ? (
                <div className="text-center py-8">
                  <PawPrint className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    Você ainda não cadastrou nenhum pet
                  </p>
                  <Link to="/dashboard/tutor/animais">
                    <Button>Cadastrar Primeiro Pet</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {animals.slice(0, 3).map((animal) => (
                    <div key={animal.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        {animal.foto_url ? (
                          <img 
                            src={animal.foto_url} 
                            alt={animal.nome}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <Heart className="w-6 h-6 text-primary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{animal.nome}</h4>
                        <p className="text-sm text-gray-600">
                          {animal.especie} {animal.raca && `• ${animal.raca}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {animal.idade && `${animal.idade} anos`}
                        </p>
                      </div>
                    </div>
                  ))}
                  {animals.length > 3 && (
                    <Link to="/dashboard/tutor/animais">
                      <Button variant="outline" className="w-full">
                        Ver todos os pets ({animals.length})
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Agendamentos Recentes */}
          <Card className="vet-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Agendamentos Recentes</CardTitle>
                  <CardDescription>
                    Suas consultas e status atuais
                  </CardDescription>
                </div>
                <Link to="/dashboard/tutor/agendamentos">
                  <Button size="sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    Agendar
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {appointments.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    Você ainda não tem agendamentos
                  </p>
                  <Link to="/dashboard/tutor/agendamentos">
                    <Button>Fazer Primeiro Agendamento</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.slice(0, 3).map((appointment) => (
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
                        <p>{appointment.nome_clinica}</p>
                        <p>
                          {utils.formatDate(appointment.data_agendamento)} às {appointment.horario}
                        </p>
                        {appointment.tipo_consulta && (
                          <p className="text-primary">{appointment.tipo_consulta}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  {appointments.length > 3 && (
                    <Link to="/dashboard/tutor/agendamentos">
                      <Button variant="outline" className="w-full">
                        Ver todos os agendamentos ({appointments.length})
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/dashboard/tutor/animais">
              <Card className="vet-card hover:scale-105 transition-transform duration-200 cursor-pointer">
                <CardContent className="p-6 text-center">
                  <PawPrint className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-medium text-gray-900 mb-1">Gerenciar Pets</h3>
                  <p className="text-sm text-gray-600">
                    Adicionar, editar ou visualizar seus animais
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/dashboard/tutor/agendamentos">
              <Card className="vet-card hover:scale-105 transition-transform duration-200 cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Calendar className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-medium text-gray-900 mb-1">Agendar Consulta</h3>
                  <p className="text-sm text-gray-600">
                    Marcar consultas com clínicas veterinárias
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/dashboard/tutor/configuracoes">
              <Card className="vet-card hover:scale-105 transition-transform duration-200 cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Heart className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-medium text-gray-900 mb-1">Configurações</h3>
                  <p className="text-sm text-gray-600">
                    Atualizar perfil e preferências
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;

