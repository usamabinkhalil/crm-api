import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AssistantDto } from './dto/assistant.dto';
import { Assistant } from 'src/schemas/assistant.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { OpenAI } from 'openai';
import { AssistantCreateParams } from 'openai/resources/beta/assistants';

@Injectable()
export class AssistantService {
  private openaiClient: OpenAI;
  constructor(
    @InjectModel(Assistant.name) private assistantModel: Model<Assistant>,
    private configService: ConfigService,
  ) {
    const openaiApiKey = this.configService.get<string>('OPENAI_API_KEY');
    this.openaiClient = new OpenAI({
      apiKey: openaiApiKey,
    });
  }

  async createUpdateAIAssistant(assistant: AssistantDto) {
    const body: AssistantCreateParams = {
      name: assistant.name,
      instructions: assistant.prompt,
      tools: [{ type: 'code_interpreter' }],
      model: 'gpt-4o-mini',
      response_format: 'auto',
    };
    if (assistant.openaiAssistant) {
      return await this.openaiClient.beta.assistants.update(
        assistant.openaiAssistant,
        body,
      );
    }
    return await this.openaiClient.beta.assistants.create(body);
  }

  async create(assistantDto: AssistantDto) {
    const openaiAssistant = await this.createUpdateAIAssistant(assistantDto);
    assistantDto.openaiAssistant = openaiAssistant.id;
    const assistant = new this.assistantModel(assistantDto);
    return assistant.save();
  }

  async findAll(query: any, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const total = await this.assistantModel.countDocuments(query);
    const assistants = await this.assistantModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .exec();

    return {
      total,
      page,
      limit,
      data: assistants,
    };
  }

  async findOne(query: any) {
    const assistant = await this.assistantModel.findOne(query).exec();
    if (!assistant) {
      throw new NotFoundException('Not found');
    }
    return assistant;
  }

  async update(id: string, assistantDto: AssistantDto) {
    const openaiAssistant = await this.createUpdateAIAssistant(assistantDto);
    assistantDto.openaiAssistant = openaiAssistant.id;
    const assistant = await this.assistantModel
      .findByIdAndUpdate(id, assistantDto, { new: true })
      .exec();
    if (!assistant) {
      throw new NotFoundException(`ID "${id}" not found`);
    }
    return assistant;
  }

  async remove(id: string) {
    const assistant = await this.assistantModel.findByIdAndDelete(id).exec();
    if (!assistant) {
      throw new NotFoundException(`ID "${id}" not found`);
    }
    return assistant;
  }
}
