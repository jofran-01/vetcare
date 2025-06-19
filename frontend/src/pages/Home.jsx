import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Shield, Clock, Users, Star, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const Home = () => {
  const features = [
    {
      icon: Heart,
      title: 'Cuidado Personalizado',
      description: 'Sistema completo para acompanhar a saúde e bem-estar do seu pet'
    },
    {
      icon: Clock,
      title: 'Agendamento Fácil',
      description: 'Agende consultas de forma rápida e prática com clínicas parceiras'
    },
    {
      icon: Shield,
      title: 'Dados Seguros',
      description: 'Suas informações e do seu pet protegidas com máxima segurança'
    },
    {
      icon: Users,
      title: 'Rede de Clínicas',
      description: 'Conecte-se com clínicas veterinárias qualificadas em sua região'
    }
  ];

  const testimonials = [
    {
      name: 'Maria Silva',
      role: 'Tutora',
      content: 'O VetCare revolucionou como cuido do meu pet. Agendamentos nunca foram tão fáceis!',
      rating: 5
    },
    {
      name: 'Dr. João Santos',
      role: 'Veterinário',
      content: 'Excelente plataforma para gerenciar minha clínica e atender melhor os pacientes.',
      rating: 5
    },
    {
      name: 'Ana Costa',
      role: 'Tutora',
      content: 'Adoro poder acompanhar todo o histórico médico dos meus pets em um só lugar.',
      rating: 5
    }
  ];

  const stats = [
    { number: '1000+', label: 'Pets Cadastrados' },
    { number: '50+', label: 'Clínicas Parceiras' },
    { number: '5000+', label: 'Consultas Agendadas' },
    { number: '98%', label: 'Satisfação' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="vet-gradient text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 fade-in">
              Cuidando do seu pet com
              <span className="block text-accent">amor e tecnologia</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto fade-in">
              Sistema completo de agendamento e gestão para clínicas veterinárias e tutores. 
              Conecte-se, agende e cuide melhor do seu melhor amigo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in">
              <Link to="/cadastro">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-3">
                  Começar Agora
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/sobre">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-3">
                  Saiba Mais
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Por que escolher o VetCare?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Oferecemos as melhores ferramentas para cuidar do seu pet e gerenciar sua clínica veterinária
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="vet-card text-center hover:scale-105 transition-transform duration-200">
                  <CardHeader>
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Como funciona
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Em poucos passos você já está cuidando melhor do seu pet
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4">Cadastre-se</h3>
              <p className="text-gray-600">
                Crie sua conta como tutor ou clínica veterinária em poucos minutos
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4">Conecte-se</h3>
              <p className="text-gray-600">
                Cadastre seus pets e encontre clínicas veterinárias próximas
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4">Agende e Cuide</h3>
              <p className="text-gray-600">
                Agende consultas e acompanhe toda a saúde do seu pet
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              O que nossos usuários dizem
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Depoimentos reais de quem já usa o VetCare
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="vet-card">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
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
                Cadastrar Agora
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/contato">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-3">
                Falar Conosco
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

