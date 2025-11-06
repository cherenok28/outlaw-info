const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();

// Разрешаем CORS для всех доменов
app.use(cors());
app.use(express.json());

// Внутренний прокси для /outlaw
app.post('/outlaw', async (req, res) => {
  try {
    const response = await fetch("https://outlaw-game.online/ajax/home_ajax.php", {
      method: "POST",
      headers: {
        "Accept": "application/json"
      }
    });
    const text = await response.text();  // текстовый JSON
    res.status(response.status)
       .type('application/json')
       .send(text);
  } catch (e) {
    res.status(502).json({ error: "proxy_error", detail: e.message });
  }
});

// Обработка GET-запроса /get-player-info
app.get('/get-player-info', (req, res) => {
  const id = req.query.id; // получаем id из URL
  console.log('Запрос для ID:', id);

  // Тут можно заменить на реальную логику поиска из базы
  if (!id) {
    return res.status(400).json({ error: "missing_id" });
  }

  // Для теста — возвращаем фиктивные данные для конкретного ID
  if (id === '150530771') {
    return res.json({
      name: "Тестовый игрок",
      desc: "Тестовый базар",
      talents: "Тестовые таланты",
      obs: "1000",
      auth: "Высокий",
      achievements: "Достижения 1, 2",
      keys: true
    });
  }

  // Для остальных ID — возвращаем 404 или пустой ответ
  res.status(404).json({ notFound: true });
});

// Тестовая проверка
app.get('/status', (req, res) => {
  res.json({ message: "API работает" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Outlaw-proxy слушает на порту ${port}`);
});
