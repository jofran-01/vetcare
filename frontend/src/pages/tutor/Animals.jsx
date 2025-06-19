import { useState, useEffect } from 'react';
import { Plus, Search, Edit, QrCode, Heart, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { animalsAPI, utils } from '../../lib/api';

const TutorAnimals = () => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    especie: '',
    raca: '',
    idade: '',
    peso: '',
    cor: '',
    sexo: '',
    castrado: false,
    historico_medico: '',
    observacoes: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnimals();
  }, []);

  const fetchAnimals = async () => {
    try {
      const response = await animalsAPI.getAnimals();
      setAnimals(response.animals || []);
    } catch (error) {
      console.error('Erro ao carregar animais:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
      nome: '',
      especie: '',
      raca: '',
      idade: '',
      peso: '',
      cor: '',
      sexo: '',
      castrado: false,
      historico_medico: '',
      observacoes: ''
    });
    setEditingAnimal(null);
    setError('');
  };

  const handleEdit = (animal) => {
    setEditingAnimal(animal);
    setFormData({
      nome: animal.nome || '',
      especie: animal.especie || '',
      raca: animal.raca || '',
      idade: animal.idade || '',
      peso: animal.peso || '',
      cor: animal.cor || '',
      sexo: animal.sexo || '',
      castrado: animal.castrado || false,
      historico_medico: animal.historico_medico || '',
      observacoes: animal.observacoes || ''
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');

    try {
      if (editingAnimal) {
        await animalsAPI.updateAnimal(editingAnimal.id, formData);
      } else {
        await animalsAPI.createAnimal(formData);
      }
      
      await fetchAnimals();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      setError(error.message || 'Erro ao salvar animal');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDownloadQR = (animal) => {
    if (animal.qr_code_url) {
      const link = document.createElement('a');
      link.href = animal.qr_code_url;
      link.download = `qr-code-${animal.nome}.png`;
      link.click();
    }
  };

  const filteredAnimals = animals.filter(animal =>
    animal.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    animal.especie.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (animal.raca && animal.raca.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
            <h1 className="text-3xl font-bold text-gray-900">Meus Pets</h1>
            <p className="text-gray-600 mt-2">
              Gerencie todos os seus animais cadastrados
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Pet
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingAnimal ? 'Editar Pet' : 'Adicionar Novo Pet'}
                </DialogTitle>
                <DialogDescription>
                  Preencha as informações do seu animal de estimação
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome">Nome *</Label>
                    <Input
                      id="nome"
                      name="nome"
                      required
                      value={formData.nome}
                      onChange={handleInputChange}
                      placeholder="Nome do pet"
                    />
                  </div>
                  <div>
                    <Label htmlFor="especie">Espécie *</Label>
                    <Select value={formData.especie} onValueChange={(value) => handleSelectChange('especie', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a espécie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cão">Cão</SelectItem>
                        <SelectItem value="Gato">Gato</SelectItem>
                        <SelectItem value="Pássaro">Pássaro</SelectItem>
                        <SelectItem value="Peixe">Peixe</SelectItem>
                        <SelectItem value="Hamster">Hamster</SelectItem>
                        <SelectItem value="Coelho">Coelho</SelectItem>
                        <SelectItem value="Outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="raca">Raça</Label>
                    <Input
                      id="raca"
                      name="raca"
                      value={formData.raca}
                      onChange={handleInputChange}
                      placeholder="Raça do animal"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cor">Cor</Label>
                    <Input
                      id="cor"
                      name="cor"
                      value={formData.cor}
                      onChange={handleInputChange}
                      placeholder="Cor predominante"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="idade">Idade (anos)</Label>
                    <Input
                      id="idade"
                      name="idade"
                      type="number"
                      min="0"
                      max="50"
                      value={formData.idade}
                      onChange={handleInputChange}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="peso">Peso (kg)</Label>
                    <Input
                      id="peso"
                      name="peso"
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.peso}
                      onChange={handleInputChange}
                      placeholder="0.0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sexo">Sexo</Label>
                    <Select value={formData.sexo} onValueChange={(value) => handleSelectChange('sexo', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Macho">Macho</SelectItem>
                        <SelectItem value="Fêmea">Fêmea</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="castrado"
                    name="castrado"
                    checked={formData.castrado}
                    onChange={handleInputChange}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="castrado">Animal castrado</Label>
                </div>

                <div>
                  <Label htmlFor="historico_medico">Histórico Médico</Label>
                  <Textarea
                    id="historico_medico"
                    name="historico_medico"
                    value={formData.historico_medico}
                    onChange={handleInputChange}
                    placeholder="Informações sobre vacinas, cirurgias, doenças, etc."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    name="observacoes"
                    value={formData.observacoes}
                    onChange={handleInputChange}
                    placeholder="Comportamento, preferências, cuidados especiais, etc."
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
                    {formLoading ? 'Salvando...' : (editingAnimal ? 'Atualizar' : 'Cadastrar')}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar pets por nome, espécie ou raça..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Animals Grid */}
        {filteredAnimals.length === 0 ? (
          <Card className="vet-card">
            <CardContent className="text-center py-12">
              <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'Nenhum pet encontrado' : 'Nenhum pet cadastrado'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? 'Tente buscar com outros termos'
                  : 'Comece adicionando seu primeiro animal de estimação'
                }
              </p>
              {!searchTerm && (
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Primeiro Pet
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAnimals.map((animal) => (
              <Card key={animal.id} className="vet-card hover:scale-105 transition-transform duration-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden">
                        {animal.foto_url ? (
                          <img 
                            src={animal.foto_url} 
                            alt={animal.nome}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Heart className="w-6 h-6 text-primary" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{animal.nome}</CardTitle>
                        <CardDescription>
                          {animal.especie} {animal.raca && `• ${animal.raca}`}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(animal)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      {animal.qr_code_url && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadQR(animal)}
                        >
                          <QrCode className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {animal.idade && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Idade:</span>
                        <span>{animal.idade} anos</span>
                      </div>
                    )}
                    {animal.peso && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Peso:</span>
                        <span>{animal.peso} kg</span>
                      </div>
                    )}
                    {animal.sexo && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Sexo:</span>
                        <span>{animal.sexo}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-500">Castrado:</span>
                      <span>{animal.castrado ? 'Sim' : 'Não'}</span>
                    </div>
                    {animal.cor && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Cor:</span>
                        <span>{animal.cor}</span>
                      </div>
                    )}
                  </div>
                  
                  {animal.qr_code_url && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Carteirinha Digital:</span>
                        <div className="flex space-x-2">
                          <a 
                            href={`/animal/${animal.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline text-sm"
                          >
                            Visualizar
                          </a>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDownloadQR(animal)}
                          >
                            <Download className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorAnimals;

