import { Calendar, Heart, Shield, Clock, Users, Star, CheckCircle, QrCode, FileText, Bell } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

const Services = () => {
  const tutorServices = [
    {
      icon: Calendar,
      title: 'Agendamento Online',
      description: 'Agende consultas com clínicas veterinárias de forma rápida e prática',
      features: [
        'Busca por clínicas próximas',
        'Visualização de horários disponíveis',
        'Confirmação automática',
        'Lembretes por email'
      ]
    },
    {
      icon: Heart,
      title: 'Gestão de Pets',
      description: 'Mantenha todos os dados dos seus pets organizados em um só lugar',
      features: [
        'Cadastro completo dos animais',
        'Histórico médico detalhado',
        'Controle de vacinação',
        'Fotos e documentos'
      ]
    },
    {
      icon: QrCode,
      title: 'Carteirinha Digital',
      description: 'Carteirinha com QR Code para identificação rápida do seu pet',
      features: [
        'QR Code único por animal',
        'Acesso rápido aos dados',
        'Impressão em alta qualidade',
        'Atualização automática'
      ]
    },
    {
      icon: FileText,
      title: 'Relatórios de Saúde',
      description: 'Acompanhe a evolução da saúde do seu pet com relatórios detalhados',
      features: [
        'Histórico de consultas',
        'Gráficos de peso e crescimento',
        'Alertas de vacinação',
        'Exportação em PDF'
      ]
    }
  ];

  const clinicaServices = [
    {
      icon: Users,
      title: 'Gestão de Pacientes',
      description: 'Sistema completo para gerenciar todos os animais atendidos',
      features: [
        'Cadastro de novos pacientes',
        'Histórico médico completo',
        'Busca avançada',
        'Relatórios de atendimento'
      ]
    },
    {
      icon: Calendar,
      title: 'Agenda Inteligente',
      description: 'Organize sua agenda e gerencie agendamentos de forma eficiente',
      features: [
        'Visualização por dia/semana/mês',
        'Aceitar/recusar agendamentos',
        'Bloqueio de horários',
        'Notificações automáticas'
      ]
    },
    {
      icon: Shield,
      title: 'Dados Seguros',
      description: 'Seus dados e dos pacientes protegidos com máxima segurança',
      features: [
        'Criptografia de dados',
        'Backup automático',
        'Controle de acesso',
        'Conformidade LGPD'
      ]
    },
    {
      icon: Bell,
      title: 'Notificações',
      description: 'Mantenha-se sempre informado sobre novos agendamentos e atualizações',
      features: [
        'Novos agendamentos',
        'Cancelamentos',
        'Lembretes de consulta',
        'Atualizações do sistema'
      ]
    }
  ];

  const plans = [
    {
      name: 'Tutor',
      price: 'Gratuito',
      description: 'Para tutores de animais',
      features: [
        'Cadastro ilimitado de pets',
        'Agendamento de consultas',
        'Carteirinha digital',
        'Histórico médico',
        'Suporte por email'
      ],
      popular: false
    },
    {
      name: 'Clínica Básica',
      price: 'R$ 99/mês',
      description: 'Para clínicas pequenas',
      features: [
        'Até 500 pacientes',
        'Agenda completa',
        'Relatórios básicos',
        'Suporte prioritário',
        'Backup automático'
      ],
      popular: false
    },
    {
      name: 'Clínica Premium',
      price: 'R$ 199/mês',
      description: 'Para clínicas médias e grandes',
      features: [
        'Pacientes ilimitados',
        'Relatórios avançados',
        'API personalizada',
        'Suporte 24/7',
        'Treinamento incluído'
      ],
      popular: true
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="vet-gradient text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 fade-in">
              Nossos Serviços
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto fade-in">
              Soluções completas para tutores e clínicas veterinárias. 
              Tudo que você precisa para cuidar melhor dos pets.
            </p>
          </div>
        </div>
      </section>

      {/* Tutor Services */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Para Tutores
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ferramentas essenciais para cuidar melhor do seu pet
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {tutorServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="vet-card hover:scale-105 transition-transform duration-200">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{service.title}</CardTitle>
                        <CardDescription>{service.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Clinica Services */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Para Clínicas Veterinárias
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Sistema completo de gestão para sua clínica veterinária
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {clinicaServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="vet-card hover:scale-105 transition-transform duration-200">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{service.title}</CardTitle>
                        <CardDescription>{service.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Como Funciona
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Processo simples e intuitivo para começar a usar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4">Cadastre-se</h3>
              <p className="text-gray-600">
                Crie sua conta como tutor ou clínica veterinária. 
                O processo é rápido e gratuito.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4">Configure</h3>
              <p className="text-gray-600">
                Adicione seus pets ou configure sua clínica. 
                Personalize conforme suas necessidades.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4">Comece a Usar</h3>
              <p className="text-gray-600">
                Agende consultas, gerencie pacientes e 
                aproveite todas as funcionalidades.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Planos e Preços
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Escolha o plano ideal para suas necessidades
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card key={index} className={`vet-card relative ${plan.popular ? 'ring-2 ring-primary' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                      Mais Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold text-primary">{plan.price}</div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/cadastro">
                    <Button 
                      className={`w-full ${plan.popular ? 'bg-primary' : 'bg-gray-600'}`}
                    >
                      Começar Agora
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 vet-gradient text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para começar?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Junte-se a milhares de tutores e clínicas que já confiam no VetCare
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/cadastro">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-3">
                Cadastrar Gratuitamente
              </Button>
            </Link>
            <Link to="/contato">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-3">
                Falar com Vendas
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;

