import { Users, Heart, Award, Target, CheckCircle, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const About = () => {
  const team = [
    {
      name: 'João Francisco',
      role: 'Desenvolvedor Full-Stack',
      description: 'Especialista em desenvolvimento web e integração de sistemas'
    },
    {
      name: 'Ana Beatriz',
      role: 'Designer UX/UI',
      description: 'Focada na experiência do usuário e design intuitivo'
    },
    {
      name: 'Gheniffer',
      role: 'Analista de Sistemas',
      description: 'Responsável pela arquitetura e modelagem do sistema'
    },
    {
      name: 'Eduardo',
      role: 'Especialista em Banco de Dados',
      description: 'Gerenciamento e otimização de dados'
    }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Amor pelos Animais',
      description: 'Acreditamos que todo pet merece o melhor cuidado possível'
    },
    {
      icon: Users,
      title: 'Comunidade',
      description: 'Conectamos tutores e veterinários em uma rede de cuidado'
    },
    {
      icon: Award,
      title: 'Excelência',
      description: 'Buscamos sempre a melhor qualidade em nossos serviços'
    },
    {
      icon: Target,
      title: 'Inovação',
      description: 'Utilizamos tecnologia para facilitar o cuidado animal'
    }
  ];

  const achievements = [
    { number: '2024', label: 'Ano de Fundação' },
    { number: '4', label: 'Desenvolvedores' },
    { number: '100%', label: 'Dedicação' },
    { number: '∞', label: 'Amor pelos Pets' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="vet-gradient text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 fade-in">
              Sobre o VetCare
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto fade-in">
              Projeto de TCC desenvolvido com paixão por estudantes dedicados a revolucionar 
              o cuidado veterinário através da tecnologia.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Nossa Missão
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Facilitar o acesso aos cuidados veterinários através de uma plataforma 
                digital que conecta tutores de animais com clínicas veterinárias de forma 
                simples, rápida e eficiente.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Acreditamos que a tecnologia pode transformar a maneira como cuidamos 
                dos nossos pets, tornando o processo mais organizado, acessível e humano.
              </p>
              <div className="flex items-center space-x-4">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <span className="text-gray-700">Sistema completo de agendamento</span>
              </div>
              <div className="flex items-center space-x-4 mt-2">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <span className="text-gray-700">Gestão de histórico médico</span>
              </div>
              <div className="flex items-center space-x-4 mt-2">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <span className="text-gray-700">Carteirinhas digitais com QR Code</span>
              </div>
            </div>
            <div className="relative">
              <div className="w-full h-96 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                <Heart className="w-32 h-32 text-primary/50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nossos Valores
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Os princípios que guiam nosso trabalho e desenvolvimento
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="vet-card text-center hover:scale-105 transition-transform duration-200">
                  <CardHeader>
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">
                      {value.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nossa Equipe
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Estudantes apaixonados por tecnologia e cuidado animal
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="vet-card text-center hover:scale-105 transition-transform duration-200">
                <CardHeader>
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-10 h-10 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <CardDescription className="text-primary font-medium">
                    {member.role}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Projeto TCC 2024</h2>
            <p className="text-white/80">Desenvolvido com dedicação e paixão</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {achievements.map((achievement, index) => (
              <div key={index}>
                <div className="text-3xl md:text-4xl font-bold mb-2">{achievement.number}</div>
                <div className="text-white/80">{achievement.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tecnologias Utilizadas
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Stack moderno para uma solução robusta e escalável
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="vet-card">
              <CardHeader>
                <CardTitle className="text-xl text-center">Frontend</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• React + Vite</li>
                  <li>• Tailwind CSS</li>
                  <li>• shadcn/ui</li>
                  <li>• React Router</li>
                  <li>• Axios</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="vet-card">
              <CardHeader>
                <CardTitle className="text-xl text-center">Backend</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Python Flask</li>
                  <li>• PHP</li>
                  <li>• JWT Authentication</li>
                  <li>• bcrypt</li>
                  <li>• QR Code Generation</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="vet-card">
              <CardHeader>
                <CardTitle className="text-xl text-center">Infraestrutura</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Supabase (PostgreSQL)</li>
                  <li>• Vercel Deploy</li>
                  <li>• GitHub</li>
                  <li>• CORS</li>
                  <li>• RESTful API</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 vet-gradient text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Quer saber mais sobre o projeto?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Entre em contato conosco para conhecer mais detalhes sobre o desenvolvimento
          </p>
          <a
            href="/contato"
            className="inline-flex items-center px-8 py-3 bg-white text-primary rounded-lg font-medium hover:bg-white/90 transition-colors"
          >
            Falar Conosco
          </a>
        </div>
      </section>
    </div>
  );
};

export default About;

