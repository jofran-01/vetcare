import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

# Configurações do Supabase
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

# Para desenvolvimento, permitir valores de exemplo
if SUPABASE_URL == "https://exemplo.supabase.co":
    print("⚠️  AVISO: Usando configurações de exemplo. Configure o .env com valores reais do Supabase.")
    # Criar cliente mock para desenvolvimento
    supabase = None
    supabase_admin = None
else:
    if not SUPABASE_URL or not SUPABASE_ANON_KEY:
        raise ValueError("SUPABASE_URL e SUPABASE_ANON_KEY devem estar definidas no arquivo .env")

    # Cliente Supabase para operações públicas (frontend)
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

    # Cliente Supabase para operações administrativas (backend)
    supabase_admin: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY) if SUPABASE_SERVICE_KEY else supabase

