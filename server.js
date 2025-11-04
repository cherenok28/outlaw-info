const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();

// Разрешаем CORS для всех доменов (чтобы VK-расширение могло обращаться)
app.use(cors());
app.use(express.json());

app.post('/outlaw', async (req, res) => {
  try {
    const response = await fetch("https://outlaw-game.online/ajax/home_ajax.php", {
      method: "POST",
      headers: {
        "Accept": "application/json"
      }
      // НЕ указываем credentials, прокси отдаёт данные без приватных куки
    });

    const text = await response.text();  // текстовый JSON
    res.status(response.status)
       .type('application/json')
       .send(text);

  } catch (e) {
    res.status(502).json({ error: "proxy_error", detail: e.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Outlaw-proxy listening on port ${port}`);
});