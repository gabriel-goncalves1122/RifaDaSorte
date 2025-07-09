import { config } from 'dotenv';
import path from 'path';

// Carrega o .env do diretório raiz do projeto
const envPath = path.resolve(__dirname, '../../.env');
const result = config({ path: envPath });

if (result.error) {
  console.error('❌ Erro ao carregar .env:', result.error);
  process.exit(1);
}

// Verifica se DATABASE_URL existe
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL não definida no arquivo .env');
  console.log('ℹ️ Caminho do .env:', envPath);
  console.log('🔍 Conteúdo do .env:', require('fs').readFileSync(envPath, 'utf-8'));
  process.exit(1);
}

console.log('✅ Variáveis de ambiente carregadas com sucesso');