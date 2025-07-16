import 'dotenv/config';
import express from 'express';
import OpenAI from 'openai';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
  const { message } = req.body;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content:
          'Eres un tutor bíblico católico. Explica con claridad, cita la Biblia y aplica pastoralmente cada enseñanza. Responde con base bíblica precisa.'
      },
      { role: 'user', content: message }
    ]
  });

  res.json({ reply: completion.choices[0].message.content });
});

app.listen(port, () => {
  console.log(`Servidor Tutor Bíblico IA activo en puerto ${port}`);
});