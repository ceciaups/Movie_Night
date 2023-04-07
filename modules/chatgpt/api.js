const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);

async function chatCompletion(title1, title2) {
  let strTitle1 = title1.replaceAll("+", " ");
  let strTitle2 = title2.replaceAll("+", " ");

  let messages = [];
  messages.push({ role: "user", content: `${strTitle1} and ${strTitle2}, give me 10 similar movies.` });

  console.log(messages[0].content);
  return "1. Avatar 2. The Shape of Water 3. Elysium 4. Oblivion 5. Tron: Legacy 6. Inception 7. Total Recall 8. Blade Runner 2049 9. Interstellar 10. The Abyss.";

  // const completion = await openai.createChatCompletion({
  //   model: "gpt-3.5-turbo",
  //   messages: messages,
  // });

  // return completion.data.choices[0].message.content;
}

module.exports = {
  chatCompletion
};