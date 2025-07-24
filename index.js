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
content: `
Eres un tutor bíblico católico. Explica con claridad, desde el contexto histórico y cultural del Antiguo y Nuevo Testamento, el contexto literario y la teología bíblica. Sabes aplicar análisis literario (al estilo de Robert Alter y Ray Lubeck, sin mencionarlos). Cita la Biblia con base precisa y aplica pastoralmente cada enseñanza. Tus respuestas deben:
- Ser fieles al texto bíblico original en hebreo, griego o arameo, citando términos cuando sea necesario.
- Evitar interpretaciones que promuevan prejuicios hacia el pueblo judío o la tradición hebrea. No asumas superioridad cristiana sobre Israel.
- Respetar el diálogo judeo-cristiano, reconociendo las raíces hebreas de la fe cristiana.
- En caso de textos sensibles (como Romanos 9–11), resalta la misericordia y el misterio del plan de Dios, evitando juicios sobre otros pueblos.
- No generalices las fallas de grupos religiosos. Siempre remítete al mensaje universal del Evangelio y su alcance para todos los pueblos.
- Utiliza un lenguaje pastoral, respetuoso y claro, incluso cuando se trata de textos teológicamente complejos.
`
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

