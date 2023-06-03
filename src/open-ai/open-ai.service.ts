import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { error, log } from 'console';
const { Configuration, OpenAIApi } = require('openai');
@Injectable()
export class OpenAiService {
  private configuration;
  constructor(private configService: ConfigService) {
    this.configuration = new Configuration({
      apiKey: configService.get<string>('openai_api_key'),
    });
  }

  async dataExtraction(problem: string) {
    const prompt = `${this.configService.get<string>(
      'openai_prompt_data_extraction',
    )}"${problem}"`;
    const result = await this.createCompletion(prompt);
    if (result) {
      return result;
    } else {
      return {
        error: 'AI error please try again',
      };
    }
  }

  async problemAnalysis(data: any) {
    const prompt = `${this.configService.get<string>(
      'openai_prompt_analysis',
    )}"${data}"`;
    const result = await this.createCompletion(prompt);
    if (result) {
      return result;
    } else {
      return {
        error: 'AI error please try again',
      };
    }
  }

  private async createCompletion(prompt) {
    const openai = new OpenAIApi(this.configuration);
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
