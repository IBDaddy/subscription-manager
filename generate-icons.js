const fs = require('fs');
const { createCanvas } = require('canvas');

function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const scale = size / 192;

  // Background - warm white with gradient
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#fdfcf8');
  gradient.addColorStop(1, '#f5f5f4');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // Main circle background
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.35;

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fillStyle = '#57534e'; // stone-600
  ctx.fill();

  // Letter "S" - modern, geometric style
  ctx.font = `bold ${size * 0.5}px "Helvetica Neue", Arial, sans-serif`;
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('S', centerX, centerY + size * 0.02);

  // Accent dot (lime)
  const dotRadius = size * 0.045;
  const dotX = centerX + size * 0.22;
  const dotY = centerY - size * 0.22;

  ctx.beginPath();
  ctx.arc(dotX, dotY, dotRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#84cc16'; // lime-500
  ctx.fill();

  return canvas;
}

// Generate both icons
const icon192 = generateIcon(192);
const icon512 = generateIcon(512);

// Save to files
const buffer192 = icon192.toBuffer('image/png');
const buffer512 = icon512.toBuffer('image/png');

fs.writeFileSync('public/icon-192.png', buffer192);
fs.writeFileSync('public/icon-512.png', buffer512);

console.log('✅ Icons generated successfully!');
console.log('📁 public/icon-192.png');
console.log('📁 public/icon-512.png');
