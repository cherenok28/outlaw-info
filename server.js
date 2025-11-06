const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();

// Разрешаем CORS для всех доменов
app.use(cors());
app.use(express.json());

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

// Добавьте обработку GET-запроса
app.get('/outlaw', (req, res) => {
  res.status(200).json({ message: "API работает" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Outlaw-proxy listening on port ${port}`);
});
