const OpenAI = require("openai");

exports.handler = async (event) => {

  const openai = new OpenAI({
    apiKey: "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",
  });

  const { pergunta } = JSON.parse(event.body);

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "Você é Zyphor..."
      },
      {
        role: "user",
        content: pergunta
      }
    ],
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      resposta: completion.choices[0].message.content
    })
  };
};
