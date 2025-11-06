const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();

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
app.get('/get-player-info', async (req, res) => {
  const id = req.query.id; 
  console.log('Запрос для ID:', id);

  if (!id) {
    return res.status(400).json({ error: "missing_id" });
  }

  try {
    // Сделайте запрос к реальному API или базе данных
    const response = await fetch("https://outlaw-game.online/ajax/home_ajax.php", {
      method: "POST",
      headers: {
        "Accept": "application/json"
      }
      // добавьте body, если API требует
    });

    if (!response.ok) {
      return res.status(response.status).json({ notFound: true });
    }

    const data = await response.json();

    // Тут можно: обработать data или оставить как есть
    return res.json(data);
  } catch (e) {
    console.error('Ошибка API:', e);
    return res.status(502).json({ error: "proxy_error", detail: e.message });
  }
});

// Тестовая страница статуса
app.get('/status', (req, res) => {
  res.json({ message: "API работает" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Outlaw-proxy слушает на порту ${port}`);
});
