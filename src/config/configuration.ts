export default () => ({
  mongo_uri: process.env.MONGO_URI,
  openai_api_key: process.env.OPENAI_API_KEY,
  openai_model: process.env.OPENAI_MODEL,
  openai_prompt_data_extraction: process.env.OPENAI_PROMT_DATA_EXTRACTION,
  openai_prompt_analysis: process.env.OPENAI_PROMT_ANALYSIS,
});
