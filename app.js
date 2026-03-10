const canvas = document.getElementById('wallpaperCanvas');
const ctx = canvas.getContext('2d');

const controls = {
  styleType: document.getElementById('styleType'),
  primaryColor: document.getElementById('primaryColor'),
  secondaryColor: document.getElementById('secondaryColor'),
  accentColor: document.getElementById('accentColor'),
  density: document.getElementById('density'),
  randomizeBtn: document.getElementById('randomizeBtn'),
  downloadBtn: document.getElementById('downloadBtn')
};

function drawGradient() {
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, controls.primaryColor.value);
  gradient.addColorStop(1, controls.secondaryColor.value);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const glow = ctx.createRadialGradient(
    canvas.width * 0.7,
    canvas.height * 0.2,
    10,
    canvas.width * 0.7,
    canvas.height * 0.2,
    canvas.width * 0.6
  );
  glow.addColorStop(0, `${controls.accentColor.value}99`);
  glow.addColorStop(1, '#00000000');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawStripes() {
  ctx.fillStyle = controls.primaryColor.value;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const stripeWidth = (canvas.width / Number(controls.density.value)) * 2;
  ctx.fillStyle = controls.secondaryColor.value;

  for (let x = -canvas.height; x < canvas.width + canvas.height; x += stripeWidth) {
    ctx.save();
    ctx.translate(x, 0);
    ctx.rotate(Math.PI / 5);
    ctx.fillRect(0, -canvas.height, stripeWidth / 2, canvas.height * 2);
    ctx.restore();
  }

  ctx.globalAlpha = 0.35;
  ctx.fillStyle = controls.accentColor.value;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalAlpha = 1;
}

function drawDots() {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, controls.primaryColor.value);
  gradient.addColorStop(1, controls.secondaryColor.value);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const spacing = canvas.width / Number(controls.density.value);
  const radius = Math.max(10, spacing * 0.18);
  ctx.fillStyle = `${controls.accentColor.value}bb`;

  for (let y = spacing / 2; y < canvas.height; y += spacing) {
    for (let x = spacing / 2; x < canvas.width; x += spacing) {
      const offset = (Math.floor(y / spacing) % 2) * (spacing / 2);
      ctx.beginPath();
      ctx.arc(x + offset, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function renderWallpaper() {
  const drawMap = {
    gradient: drawGradient,
    stripes: drawStripes,
    dots: drawDots
  };

  const draw = drawMap[controls.styleType.value] ?? drawGradient;
  draw();
}

function randomColor() {
  return `#${Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, '0')}`;
}

function randomizeColors() {
  controls.primaryColor.value = randomColor();
  controls.secondaryColor.value = randomColor();
  controls.accentColor.value = randomColor();
  renderWallpaper();
}

function downloadWallpaper() {
  const link = document.createElement('a');
  link.download = `wallpaper-${controls.styleType.value}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

Object.values(controls).forEach((element) => {
  if (element.tagName === 'BUTTON') return;
  element.addEventListener('input', renderWallpaper);
});

controls.randomizeBtn.addEventListener('click', randomizeColors);
controls.downloadBtn.addEventListener('click', downloadWallpaper);

renderWallpaper();
