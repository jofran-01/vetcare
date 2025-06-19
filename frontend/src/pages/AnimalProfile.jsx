import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Heart, Calendar, MapPin, Phone, Mail, QrCode, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { animalsAPI, utils } from '../lib/api';

const AnimalProfile = () => {
  const { id } = useParams();
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        const response = await animalsAPI.getAnimalById(id);
        setAnimal(response.animal);
      } catch (error) {
        setError('Animal não encontrado');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAnimal();
    }
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadQR = () => {
    if (animal?.qr_code_url) {
      const link = document.createElement('a');
      link.href = animal.qr_code_url;
      link.download = `qr-code-${animal.nome}.png`;
      link.click();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !animal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Animal não encontrado
            </h2>
            <p className="text-gray-600 mb-6">
              O animal que você está procurando não foi encontrado ou não existe.
            </p>
            <a href="/" className="text-primary hover:underline">
              Voltar para o início
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b print:hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Carteirinha Digital
            </h1>
            <div className="flex space-x-2">
              <Button onClick={handleDownloadQR} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                QR Code
              </Button>
              <Button onClick={handlePrint} size="sm">
                Imprimir
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Animal Card */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="vet-card overflow-hidden">
          {/* Header da Carteirinha */}
          <div className="vet-gradient text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Heart className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">VetCare</h1>
                  <p className="text-white/80">Carteirinha Digital</p>
                </div>
              </div>
              {animal.qr_code_url && (
                <div className="bg-white p-2 rounded-lg">
                  <img 
                    src={animal.qr_code_url} 
                    alt="QR Code" 
                    className="w-20 h-20"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Informações do Animal */}
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Foto e Nome */}
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
                  {animal.foto_url ? (
                    <img 
                      src={animal.foto_url} 
                      alt={animal.nome}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Heart className="w-16 h-16 text-gray-400" />
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {animal.nome}
                </h2>
                <p className="text-gray-600">
                  {animal.especie} {animal.raca && `• ${animal.raca}`}
                </p>
              </div>

              {/* Informações Básicas */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Informações Básicas
                </h3>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Espécie:</span>
                    <p className="font-medium">{animal.especie}</p>
                  </div>
                  {animal.raca && (
                    <div>
                      <span className="text-gray-500">Raça:</span>
                      <p className="font-medium">{animal.raca}</p>
                    </div>
                  )}
                  {animal.idade && (
                    <div>
                      <span className="text-gray-500">Idade:</span>
                      <p className="font-medium">{animal.idade} anos</p>
                    </div>
                  )}
                  {animal.peso && (
                    <div>
                      <span className="text-gray-500">Peso:</span>
                      <p className="font-medium">{animal.peso} kg</p>
                    </div>
                  )}
                  {animal.cor && (
                    <div>
                      <span className="text-gray-500">Cor:</span>
                      <p className="font-medium">{animal.cor}</p>
                    </div>
                  )}
                  {animal.sexo && (
                    <div>
                      <span className="text-gray-500">Sexo:</span>
                      <p className="font-medium">{animal.sexo}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-500">Castrado:</span>
                    <p className="font-medium">{animal.castrado ? 'Sim' : 'Não'}</p>
                  </div>
                </div>
              </div>

              {/* Informações do Tutor */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Tutor Responsável
                </h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Heart className="w-4 h-4 text-primary" />
                    <span className="font-medium">{animal.nome_tutor}</span>
                  </div>
                  {animal.email_tutor && (
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{animal.email_tutor}</span>
                    </div>
                  )}
                  {animal.telefone_tutor && (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{utils.formatPhone(animal.telefone_tutor)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Histórico Médico */}
            {animal.historico_medico && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Histórico Médico
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {animal.historico_medico}
                  </p>
                </div>
              </div>
            )}

            {/* Observações */}
            {animal.observacoes && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Observações
                </h3>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {animal.observacoes}
                  </p>
                </div>
              </div>
            )}

            {/* Clínica Associada */}
            {animal.nome_clinica && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Clínica Veterinária
                </h3>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="font-medium">{animal.nome_clinica}</span>
                </div>
              </div>
            )}

            {/* Footer da Carteirinha */}
            <div className="mt-8 pt-6 border-t text-center text-sm text-gray-500">
              <p>Carteirinha gerada em {utils.formatDateTime(animal.criado_em)}</p>
              <p className="mt-1">VetCare - Sistema de Gestão Veterinária</p>
            </div>
          </CardContent>
        </Card>

        {/* Ações */}
        <div className="mt-6 text-center print:hidden">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handlePrint} size="lg">
              Imprimir Carteirinha
            </Button>
            <Button onClick={handleDownloadQR} variant="outline" size="lg">
              <QrCode className="w-4 h-4 mr-2" />
              Baixar QR Code
            </Button>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            Esta carteirinha pode ser impressa e utilizada para identificação do animal
          </p>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          body {
            background: white !important;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AnimalProfile;

