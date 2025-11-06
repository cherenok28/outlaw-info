const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/outlaw', async (req, res) => {
  // ... ваш код прокси
});

// Замена: добавьте сюда:
app.get('/get-player-info', async (req, res) => {
  const id = req.query.id; 
  if (!id) return res.status(400).json({ error: "missing_id" });
  try {
    const response = await fetch("https://outlaw-game.online/ajax/home_ajax.php", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: `id=${encodeURIComponent(id)}`
    });
    if (!response.ok) {
      return res.status(response.status).json({ notFound: true });
    }
    const textResponse = await response.text();
    console.log('Ответ сервера:', textResponse);
    const data = JSON.parse(textResponse); // вручную парсим, чтобы ловить ошибки
    
    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.status(502).json({ error: "proxy_error", detail: e.message });
  }
});

app.get('/status', (req, res) => {
  res.json({ message: "API работает" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Outlaw-proxy слушает на порту ${port}`);
});
