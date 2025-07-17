import 'dotenv/config';
import express from 'express';
import OpenAI from 'openai';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(cors());
app.use(express.json());

// ✅ Servir archivos estáticos desde la carpeta public
app.use(express.static('public'));

app.post('/chat', async (req, res) => {
  const { message } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            'Eres un tutor bíblico católico. Explica con claridad, desde el contexto histórico y cultural del Antiguo y Nuevo Testamento, contexto literario y desde la teología bíblica y sabes aplicar el analisis literario al estilo de Robert Alter y Ray Lubeck, cita la Biblia y aplica pastoralmente cada enseñanza. Responde con base bíblica precisa.'
        },
        { role: 'user', content: message }
      ]
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error al generar la respuesta:', error);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
});

app.listen(port, () => {
  console.log(`Servidor Tutor Bíblico IA activo en puerto ${port}`);
});

