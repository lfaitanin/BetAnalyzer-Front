const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Cria o diretório de ícones se não existir
const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Tamanhos dos ícones
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Caminho para o ícone original
const sourceIcon = path.join(__dirname, '../public/icon.png');

// Verifica se o ícone original existe
if (!fs.existsSync(sourceIcon)) {
  console.error('Ícone original não encontrado. Crie um arquivo icon.png na pasta public.');
  process.exit(1);
}

// Gera os ícones em diferentes tamanhos
async function generateIcons() {
  console.log('Gerando ícones para PWA...');
  
  for (const size of sizes) {
    const outputPath = path.join(iconsDir, `icon-${size}x${size}.png`);
    
    try {
      await sharp(sourceIcon)
        .resize(size, size)
        .toFile(outputPath);
      
      console.log(`Ícone ${size}x${size} gerado com sucesso.`);
    } catch (error) {
      console.error(`Erro ao gerar ícone ${size}x${size}:`, error);
    }
  }
  
  console.log('Todos os ícones foram gerados com sucesso!');
}

generateIcons(); 