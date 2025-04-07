const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Caminho para o ícone SVG
const svgPath = path.join(__dirname, '../public/icon.svg');
const pngPath = path.join(__dirname, '../public/icon.png');

// Verifica se o ícone SVG existe
if (!fs.existsSync(svgPath)) {
  console.error('Ícone SVG não encontrado. Crie um arquivo icon.svg na pasta public.');
  process.exit(1);
}

// Converte o SVG para PNG
async function convertSvgToPng() {
  console.log('Convertendo SVG para PNG...');
  
  try {
    await sharp(svgPath)
      .png()
      .toFile(pngPath);
    
    console.log('Ícone PNG gerado com sucesso!');
  } catch (error) {
    console.error('Erro ao converter SVG para PNG:', error);
  }
}

convertSvgToPng(); 