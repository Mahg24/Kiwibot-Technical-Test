import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { error, log } from 'console';
const { Configuration, OpenAIApi } = require('openai');
@Injectable()
export class OpenAiService {
  configuration;
  constructor(private configService: ConfigService) {
    this.configuration = new Configuration({
      apiKey: configService.get<string>('openai_api_key'),
    });
  }

  async dataExtraction(problem: string) {
    const openai = new OpenAIApi(this.configuration);
    const prompt = `${this.configService.get<string>(
      'openai_prompt',
    )}"${problem}"`;
    try {
      const completion = await openai.createCompletion({
        model: this.configService.get<string>('openai_model'),
        prompt,
        temperature: 0.7,
        max_tokens: 170,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      });
      const result = completion.data.choices[0].text.replace(
        /(\r\n|\n|\r)/gm,
        '',
      );
      return JSON.parse(result);
    } catch (e) {
      error(e);
      return null;
    }
  }
}
