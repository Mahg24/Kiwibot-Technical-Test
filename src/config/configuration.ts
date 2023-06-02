export default () => ({
  mongo_uri: process.env.MONGO_URI,
  openai_api_key: process.env.OPENAI_API_KEY,
  openai_model: process.env.OPENAI_MODEL,
  openai_prompt: process.env.OPENAI_PROMT,
});
