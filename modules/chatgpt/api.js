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

  // console.log(messages[0].content);
  // return "1. The Hunger Games: Mockingjay - Part 1 2. The Maze Runner 3. Divergent 4. Ender's Game 5. War for the Planet of the Apes 6. Pacific Rim 7. Valerian and the City of a Thousand Planets 8. Jupiter Ascending 9. Guardians of the Galaxy: Vol. 2 10. Blade Runner 2049.";

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: messages,
  });

  return completion.data.choices[0].message.content;
}

module.exports = {
  chatCompletion
};