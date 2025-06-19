// frontend/src/lib/api.js

// Configuração da API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const API_URL = `${API_BASE_URL}/api`;

// Função para obter o token do localStorage
const getToken = () => localStorage.getItem('token');

// Função para obter headers com autenticação
const getAuthHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Função genérica para fazer requisições
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;

  const config = {
    headers: getAuthHeaders(),
    ...options
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Erro ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
};

// API de Autenticação
export const authAPI = {
  registerTutor: (userData) =>
    apiRequest('/auth/register/tutor', {
      method: 'POST',
      body: JSON.stringify(userData)
    }),

  registerClinica: (userData) =>
    apiRequest('/auth/register/clinica', {
      method: 'POST',
      body: JSON.stringify(userData)
    }),

  login: (email, senha, tipo) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha, tipo })
    }),

  verifyToken: () => apiRequest('/auth/verify'),

  logout: () =>
    apiRequest('/auth/logout', {
      method: 'POST'
    })
};

// API de Animais
export const animalsAPI = {
  getAnimals: () => apiRequest('/animals/'),

  createAnimal: (animalData) =>
    apiRequest('/animals/', {
      method: 'POST',
      body: JSON.stringify(animalData)
    }),

  getAnimalById: (id) => apiRequest(`/animals/${id}`),

  updateAnimal: (id, animalData) =>
    apiRequest(`/animals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(animalData)
    }),

  searchAnimals: (query) =>
    apiRequest(`/animals/search?q=${encodeURIComponent(query)}`)
};

// API de Agendamentos
export const appointmentsAPI = {
  getAppointments: () => apiRequest('/appointments/'),

  createAppointment: (appointmentData) =>
    apiRequest('/appointments/', {
      method: 'POST',
      body: JSON.stringify(appointmentData)
    }),

  updateAppointmentStatus: (id, status, motivoRecusa = '') =>
    apiRequest(`/appointments/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, motivo_recusa: motivoRecusa })
    }),

  cancelAppointment: (id) =>
    apiRequest(`/appointments/${id}`, {
      method: 'DELETE'
    }),

  getAvailableTimes: (emailClinica, data) =>
    apiRequest(
      `/appointments/available-times?email_clinica=${encodeURIComponent(
        emailClinica
      )}&data=${data}`
    )
};

// API de Contato
export const contactAPI = {
  sendMessage: (contactData) =>
    apiRequest('/contact/', {
      method: 'POST',
      body: JSON.stringify(contactData)
    }),

  getMessages: () => apiRequest('/contact/'),

  markAsResponded: (id) =>
    apiRequest(`/contact/${id}/respond`, {
      method: 'PUT'
    })
};

// Funções utilitárias
export const utils = {
  saveToken: (token) => localStorage.setItem('token', token),
  removeToken: () => localStorage.removeItem('token'),
  isLoggedIn: () => !!getToken(),
  saveUser: (userData) => localStorage.setItem('user', JSON.stringify(userData)),
  getUser: () => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  },
  removeUser: () => localStorage.removeItem('user'),
  logout: () => {
    utils.removeToken();
    utils.removeUser();
  },
  formatDate: (dateString) => new Date(dateString).toLocaleDateString('pt-BR'),
  formatDateTime: (dateString) => new Date(dateString).toLocaleString('pt-BR'),
  validateEmail: (email) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email),
  validatePhone: (phone) => {
    const phoneClean = phone.replace(/\D/g, '');
    return phoneClean.length >= 10 && phoneClean.length <= 11;
  },
  formatPhone: (phone) => {
    const phoneClean = phone.replace(/\D/g, '');
    if (phoneClean.length === 11) {
      return phoneClean.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (phoneClean.length === 10) {
      return phoneClean.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return phone;
  },
  formatDocument: (doc) => {
    const docClean = doc.replace(/\D/g, '');
    if (docClean.length === 11) {
      return docClean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (docClean.length === 14) {
      return docClean.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return doc;
  }
};
