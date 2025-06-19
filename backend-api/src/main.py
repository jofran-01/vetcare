import os
import sys
from flask import Flask, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv

# Importação dos blueprints
from src.routes.auth import auth_bp
from src.routes.animals import animals_bp
from src.routes.appointments import appointments_bp
from src.routes.contact import contact_bp

# Corrigir path para funcionar no Render
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

# Carregar variáveis de ambiente
load_dotenv()

# Instanciar app e configurar pasta estática
app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'asdf#FGSgvasgf$5$WGT')

# Configurar CORS (mais seguro)
CORS(app, origins=[
    "http://localhost:5173",  # Para desenvolvimento
    "https://vetcare-frontend.onrender.com",  # Produção no Render
    "https://seu-dominio.com"  # Caso use domínio próprio
])

# Registrar blueprints (rotas organizadas)
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(animals_bp, url_prefix='/api/animals')
app.register_blueprint(appointments_bp, url_prefix='/api/appointments')
app.register_blueprint(contact_bp, url_prefix='/api/contact')

# Servir arquivos estáticos (React/Vite build)
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if app.static_folder is None:
        return "Static folder not configured", 404

    file_path = os.path.join(app.static_folder, path)
    if path != "" and os.path.exists(file_path):
        return send_from_directory(app.static_folder, path)
    elif os.path.exists(os.path.join(app.static_folder, 'index.html')):
        return send_from_directory(app.static_folder, 'index.html')
    else:
        return "index.html not found", 404

# Endpoint de verificação de saúde
@app.route('/health')
def health_check():
    return {"status": "healthy", "message": "API do TCC Veterinário funcionando!"}, 200

# Executar o servidor
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') != 'production'
    app.run(debug=debug, host='0.0.0.0', port=port)
