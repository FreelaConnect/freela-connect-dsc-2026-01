const { execSync } = require('child_process');
const path = require('path');

const projectPath = path.join(__dirname, '..', 'freelaconnect-backend');

console.log('🔨 Iniciando BUILD do projeto...\n');

try {
  const output = execSync('npm run build', { 
    cwd: projectPath,
    encoding: 'utf-8',
    stdio: 'inherit'
  });
  
  console.log('\n✅ BUILD CONCLUÍDO COM SUCESSO!\n');
  process.exit(0);
} catch (error) {
  console.log('\n❌ ERRO NA COMPILAÇÃO\n');
  process.exit(1);
}
