import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Heart, User, Building } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useAuth } from '../hooks/useAuth';
import { utils } from '../lib/api';

const Register = () => {
  const [activeTab, setActiveTab] = useState('tutor');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [tutorData, setTutorData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    telefone: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: ''
  });

  const [clinicaData, setClinicaData] = useState({
    nome_clinica: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    telefone: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    cnpj: '',
    responsavel_tecnico: '',
    crmv: ''
  });

  const { registerTutor, registerClinica } = useAuth();
  const navigate = useNavigate();

  const handleTutorChange = (e) => {
    setTutorData({
      ...tutorData,
      [e.target.name]: e.target.value
    });
  };

  const handleClinicaChange = (e) => {
    setClinicaData({
      ...clinicaData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = (data, isTutor = true) => {
    // Validações básicas
    if (data.senha !== data.confirmarSenha) {
      return 'As senhas não coincidem';
    }

    if (data.senha.length < 6) {
      return 'A senha deve ter pelo menos 6 caracteres';
    }

    if (!utils.validateEmail(data.email)) {
      return 'Email inválido';
    }

    if (!utils.validatePhone(data.telefone)) {
      return 'Telefone inválido';
    }

    // Validações específicas para clínica
    if (!isTutor) {
      if (!data.nome_clinica.trim()) {
        return 'Nome da clínica é obrigatório';
      }
      if (!data.responsavel_tecnico.trim()) {
        return 'Responsável técnico é obrigatório';
      }
    } else {
      if (!data.nome.trim()) {
        return 'Nome é obrigatório';
      }
    }

    return null;
  };

  const handleTutorSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const validationError = validateForm(tutorData, true);
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      const { confirmarSenha, ...submitData } = tutorData;
      await registerTutor(submitData);
      navigate('/dashboard/tutor');
    } catch (error) {
      setError(error.message || 'Erro ao cadastrar tutor');
    } finally {
      setLoading(false);
    }
  };

  const handleClinicaSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const validationError = validateForm(clinicaData, false);
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      const { confirmarSenha, ...submitData } = clinicaData;
      await registerClinica(submitData);
      navigate('/dashboard/clinica');
    } catch (error) {
      setError(error.message || 'Erro ao cadastrar clínica');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <Link to="/" className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-primary">VetCare</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">
            Criar conta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Já tem uma conta?{' '}
            <Link to="/login" className="font-medium text-primary hover:text-primary/80">
              Faça login
            </Link>
          </p>
        </div>

        {/* Formulário */}
        <Card>
          <CardHeader>
            <CardTitle>Cadastre-se no VetCare</CardTitle>
            <CardDescription>
              Escolha o tipo de conta que deseja criar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="tutor" className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Tutor</span>
                </TabsTrigger>
                <TabsTrigger value="clinica" className="flex items-center space-x-2">
                  <Building className="w-4 h-4" />
                  <span>Clínica</span>
                </TabsTrigger>
              </TabsList>

              {/* Formulário Tutor */}
              <TabsContent value="tutor">
                <form onSubmit={handleTutorSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nome">Nome Completo *</Label>
                      <Input
                        id="nome"
                        name="nome"
                        required
                        value={tutorData.nome}
                        onChange={handleTutorChange}
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
                        value={tutorData.email}
                        onChange={handleTutorChange}
                        placeholder="seu@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="senha">Senha *</Label>
                      <div className="relative">
                        <Input
                          id="senha"
                          name="senha"
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={tutorData.senha}
                          onChange={handleTutorChange}
                          placeholder="Mínimo 6 caracteres"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="confirmarSenha">Confirmar Senha *</Label>
                      <div className="relative">
                        <Input
                          id="confirmarSenha"
                          name="confirmarSenha"
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          value={tutorData.confirmarSenha}
                          onChange={handleTutorChange}
                          placeholder="Confirme sua senha"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="telefone">Telefone *</Label>
                    <Input
                      id="telefone"
                      name="telefone"
                      required
                      value={tutorData.telefone}
                      onChange={handleTutorChange}
                      placeholder="(11) 99999-9999"
                    />
                  </div>

                  <div>
                    <Label htmlFor="endereco">Endereço</Label>
                    <Input
                      id="endereco"
                      name="endereco"
                      value={tutorData.endereco}
                      onChange={handleTutorChange}
                      placeholder="Rua, número, complemento"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="cidade">Cidade</Label>
                      <Input
                        id="cidade"
                        name="cidade"
                        value={tutorData.cidade}
                        onChange={handleTutorChange}
                        placeholder="Sua cidade"
                      />
                    </div>
                    <div>
                      <Label htmlFor="estado">Estado</Label>
                      <Input
                        id="estado"
                        name="estado"
                        value={tutorData.estado}
                        onChange={handleTutorChange}
                        placeholder="SP"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cep">CEP</Label>
                      <Input
                        id="cep"
                        name="cep"
                        value={tutorData.cep}
                        onChange={handleTutorChange}
                        placeholder="00000-000"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                      {error}
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Cadastrando...' : 'Cadastrar como Tutor'}
                  </Button>
                </form>
              </TabsContent>

              {/* Formulário Clínica */}
              <TabsContent value="clinica">
                <form onSubmit={handleClinicaSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nome_clinica">Nome da Clínica *</Label>
                      <Input
                        id="nome_clinica"
                        name="nome_clinica"
                        required
                        value={clinicaData.nome_clinica}
                        onChange={handleClinicaChange}
                        placeholder="Nome da sua clínica"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={clinicaData.email}
                        onChange={handleClinicaChange}
                        placeholder="contato@clinica.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="senha">Senha *</Label>
                      <div className="relative">
                        <Input
                          id="senha"
                          name="senha"
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={clinicaData.senha}
                          onChange={handleClinicaChange}
                          placeholder="Mínimo 6 caracteres"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="confirmarSenha">Confirmar Senha *</Label>
                      <div className="relative">
                        <Input
                          id="confirmarSenha"
                          name="confirmarSenha"
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          value={clinicaData.confirmarSenha}
                          onChange={handleClinicaChange}
                          placeholder="Confirme sua senha"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="telefone">Telefone *</Label>
                      <Input
                        id="telefone"
                        name="telefone"
                        required
                        value={clinicaData.telefone}
                        onChange={handleClinicaChange}
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cnpj">CNPJ</Label>
                      <Input
                        id="cnpj"
                        name="cnpj"
                        value={clinicaData.cnpj}
                        onChange={handleClinicaChange}
                        placeholder="00.000.000/0001-00"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="responsavel_tecnico">Responsável Técnico *</Label>
                      <Input
                        id="responsavel_tecnico"
                        name="responsavel_tecnico"
                        required
                        value={clinicaData.responsavel_tecnico}
                        onChange={handleClinicaChange}
                        placeholder="Dr. Nome do Veterinário"
                      />
                    </div>
                    <div>
                      <Label htmlFor="crmv">CRMV</Label>
                      <Input
                        id="crmv"
                        name="crmv"
                        value={clinicaData.crmv}
                        onChange={handleClinicaChange}
                        placeholder="CRMV-SP 12345"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="endereco">Endereço</Label>
                    <Input
                      id="endereco"
                      name="endereco"
                      value={clinicaData.endereco}
                      onChange={handleClinicaChange}
                      placeholder="Rua, número, complemento"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="cidade">Cidade</Label>
                      <Input
                        id="cidade"
                        name="cidade"
                        value={clinicaData.cidade}
                        onChange={handleClinicaChange}
                        placeholder="Sua cidade"
                      />
                    </div>
                    <div>
                      <Label htmlFor="estado">Estado</Label>
                      <Input
                        id="estado"
                        name="estado"
                        value={clinicaData.estado}
                        onChange={handleClinicaChange}
                        placeholder="SP"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cep">CEP</Label>
                      <Input
                        id="cep"
                        name="cep"
                        value={clinicaData.cep}
                        onChange={handleClinicaChange}
                        placeholder="00000-000"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                      {error}
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Cadastrando...' : 'Cadastrar Clínica'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Link para Login */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Já tem uma conta?{' '}
            <Link to="/login" className="font-medium text-primary hover:text-primary/80">
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

