import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { contactAPI } from '../lib/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    assunto: '',
    mensagem: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await contactAPI.sendMessage(formData);
      setSuccess(true);
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        assunto: '',
        mensagem: ''
      });
    } catch (error) {
      setError(error.message || 'Erro ao enviar mensagem');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      content: 'contato@vetcare.com',
      description: 'Resposta em até 24 horas'
    },
    {
      icon: Phone,
      title: 'Telefone',
      content: '(11) 9999-9999',
      description: 'Seg a Sex, 8h às 18h'
    },
    {
      icon: MapPin,
      title: 'Localização',
      content: 'São Paulo, SP',
      description: 'Brasil'
    },
    {
      icon: Clock,
      title: 'Horário',
      content: '24/7 Online',
      description: 'Sistema sempre disponível'
    }
  ];

  const faqs = [
    {
      question: 'Como faço para cadastrar minha clínica?',
      answer: 'Acesse a página de cadastro, selecione "Clínica Veterinária" e preencha todas as informações necessárias. O processo é gratuito e leva apenas alguns minutos.'
    },
    {
      question: 'O sistema é gratuito para tutores?',
      answer: 'Sim! Para tutores, o VetCare é completamente gratuito. Você pode cadastrar seus pets, agendar consultas e usar todas as funcionalidades sem custo.'
    },
    {
      question: 'Como funciona o agendamento?',
      answer: 'Após cadastrar seu pet, você pode buscar clínicas próximas, visualizar horários disponíveis e fazer o agendamento. A clínica receberá a solicitação e poderá aceitar ou recusar.'
    },
    {
      question: 'Os dados são seguros?',
      answer: 'Sim, utilizamos criptografia de ponta e seguimos as melhores práticas de segurança. Todos os dados são protegidos conforme a LGPD.'
    },
    {
      question: 'Posso usar em dispositivos móveis?',
      answer: 'Sim! O VetCare é totalmente responsivo e funciona perfeitamente em smartphones, tablets e computadores.'
    }
  ];

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Mensagem Enviada!
            </h2>
            <p className="text-gray-600 mb-6">
              Obrigado pelo contato! Responderemos em breve.
            </p>
            <Button onClick={() => setSuccess(false)} className="w-full">
              Enviar Nova Mensagem
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="vet-gradient text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 fade-in">
              Entre em Contato
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto fade-in">
              Estamos aqui para ajudar! Entre em contato conosco para tirar dúvidas, 
              dar sugestões ou solicitar suporte.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <Card key={index} className="vet-card text-center hover:scale-105 transition-transform duration-200">
                  <CardHeader>
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{info.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-semibold text-gray-900 mb-1">{info.content}</p>
                    <p className="text-sm text-gray-600">{info.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Contact Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Envie sua Mensagem
              </h2>
              <p className="text-gray-600 mb-8">
                Preencha o formulário abaixo e entraremos em contato o mais breve possível. 
                Todas as informações são tratadas com confidencialidade.
              </p>

              <Card>
                <CardHeader>
                  <CardTitle>Formulário de Contato</CardTitle>
                  <CardDescription>
                    Todos os campos marcados com * são obrigatórios
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="nome">Nome Completo *</Label>
                        <Input
                          id="nome"
                          name="nome"
                          required
                          value={formData.nome}
                          onChange={handleChange}
                          placeholder="Seu nome completo"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="seu@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="telefone">Telefone</Label>
                        <Input
                          id="telefone"
                          name="telefone"
                          value={formData.telefone}
                          onChange={handleChange}
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                      <div>
                        <Label htmlFor="assunto">Assunto</Label>
                        <Input
                          id="assunto"
                          name="assunto"
                          value={formData.assunto}
                          onChange={handleChange}
                          placeholder="Assunto da mensagem"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="mensagem">Mensagem *</Label>
                      <Textarea
                        id="mensagem"
                        name="mensagem"
                        required
                        value={formData.mensagem}
                        onChange={handleChange}
                        placeholder="Digite sua mensagem aqui..."
                        rows={6}
                      />
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                        {error}
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loading}
                    >
                      {loading ? (
                        'Enviando...'
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Enviar Mensagem
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* FAQ Section */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Perguntas Frequentes
              </h2>
              <p className="text-gray-600 mb-8">
                Confira as respostas para as dúvidas mais comuns sobre o VetCare.
              </p>

              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <Card key={index} className="vet-card">
                    <CardHeader>
                      <CardTitle className="text-lg">{faq.question}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Support */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Outras Formas de Suporte
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Escolha a melhor forma de entrar em contato conosco
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="vet-card text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-blue-500" />
                </div>
                <CardTitle>Suporte por Email</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Para dúvidas técnicas e suporte geral
                </p>
                <Button variant="outline" className="w-full">
                  suporte@vetcare.com
                </Button>
              </CardContent>
            </Card>

            <Card className="vet-card text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-green-500" />
                </div>
                <CardTitle>Suporte por Telefone</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Para urgências e suporte imediato
                </p>
                <Button variant="outline" className="w-full">
                  (11) 9999-9999
                </Button>
              </CardContent>
            </Card>

            <Card className="vet-card text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-purple-500" />
                </div>
                <CardTitle>Chat Online</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Chat em tempo real durante horário comercial
                </p>
                <Button variant="outline" className="w-full">
                  Iniciar Chat
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 vet-gradient text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ainda não tem uma conta?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Cadastre-se gratuitamente e comece a usar o VetCare hoje mesmo
          </p>
          <a
            href="/cadastro"
            className="inline-flex items-center px-8 py-3 bg-white text-primary rounded-lg font-medium hover:bg-white/90 transition-colors"
          >
            Cadastrar Gratuitamente
          </a>
        </div>
      </section>
    </div>
  );
};

export default Contact;

