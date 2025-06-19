import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Footer from './components/Footer';

// Páginas públicas
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import AnimalProfile from './pages/AnimalProfile';

// Páginas do tutor
import TutorDashboard from './pages/tutor/Dashboard';
import TutorAnimals from './pages/tutor/Animals';
import TutorAppointments from './pages/tutor/Appointments';
import TutorSettings from './pages/tutor/Settings';

// Páginas da clínica
import ClinicaDashboard from './pages/clinica/Dashboard';
import ClinicaAnimals from './pages/clinica/Animals';
import ClinicaAppointments from './pages/clinica/Appointments';
import ClinicaSettings from './pages/clinica/Settings';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              {/* Rotas públicas */}
              <Route path="/" element={<Home />} />
              <Route path="/sobre" element={<About />} />
              <Route path="/servicos" element={<Services />} />
              <Route path="/contato" element={<Contact />} />
              <Route path="/animal/:id" element={<AnimalProfile />} />
              
              {/* Rotas de autenticação (apenas para não logados) */}
              <Route 
                path="/login" 
                element={
                  <ProtectedRoute requireAuth={false}>
                    <Login />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/cadastro" 
                element={
                  <ProtectedRoute requireAuth={false}>
                    <Register />
                  </ProtectedRoute>
                } 
              />

              {/* Rotas do tutor */}
              <Route 
                path="/dashboard/tutor" 
                element={
                  <ProtectedRoute userType="tutor">
                    <TutorDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/tutor/animais" 
                element={
                  <ProtectedRoute userType="tutor">
                    <TutorAnimals />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/tutor/agendamentos" 
                element={
                  <ProtectedRoute userType="tutor">
                    <TutorAppointments />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/tutor/configuracoes" 
                element={
                  <ProtectedRoute userType="tutor">
                    <TutorSettings />
                  </ProtectedRoute>
                } 
              />

              {/* Rotas da clínica */}
              <Route 
                path="/dashboard/clinica" 
                element={
                  <ProtectedRoute userType="clinica">
                    <ClinicaDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/clinica/animais" 
                element={
                  <ProtectedRoute userType="clinica">
                    <ClinicaAnimals />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/clinica/agendamentos" 
                element={
                  <ProtectedRoute userType="clinica">
                    <ClinicaAppointments />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/clinica/configuracoes" 
                element={
                  <ProtectedRoute userType="clinica">
                    <ClinicaSettings />
                  </ProtectedRoute>
                } 
              />

              {/* Rota 404 */}
              <Route 
                path="*" 
                element={
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                      <p className="text-gray-600 mb-8">Página não encontrada</p>
                      <a href="/" className="text-primary hover:underline">
                        Voltar para o início
                      </a>
                    </div>
                  </div>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

