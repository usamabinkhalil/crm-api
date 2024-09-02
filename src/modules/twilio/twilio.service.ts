import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as twilio from 'twilio';
import Redis from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { OpenAI } from 'openai';
import * as path from 'path';
import * as fs from 'fs';
import { CallLogsService } from '../call-logs/call-logs.service';

@Injectable()
export class TwilioService {
  private twilioClient: twilio.Twilio;
  private openaiClient: OpenAI;
  private audioDir: string;

  constructor(
    private configService: ConfigService,
    private callLogsService: CallLogsService,
    @InjectRedis() private readonly redis: Redis,
  ) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    const openaiApiKey = this.configService.get<string>('OPENAI_API_KEY');

    this.twilioClient = new twilio.Twilio(accountSid, authToken);
    this.openaiClient = new OpenAI({
      apiKey: openaiApiKey,
    });

    this.audioDir = path.join(__dirname, '..', '..', 'audio');
  }

  getValidJson(jsonString: string): any {
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      return { message: jsonString };
    }
  }

  async getThreadId(phone: number): Promise<any> {
    return await this.redis.get(`threadId:${phone}`);
  }

  async getConversationContext(phone: number): Promise<any> {
    const context = await this.redis.get(`assistant:${phone}:conversation`);
    return context ? JSON.parse(context) : null;
  }

  async saveConversationContext(phone: number, context: any): Promise<void> {
    await this.redis.set(
      `assistant:${phone}:conversation`,
      JSON.stringify(context),
    );
  }

  async deleteConversationContext(phone: number): Promise<any> {
    await this.redis.del(`assistant:${phone}:conversation`);
  }

  async generateTTSResponse(
    phone: number,
    assistantId: string,
    message: string,
  ): Promise<string> {
    const ttsResponse = await this.openaiClient.audio.speech.create({
      model: 'tts-1',
      voice: 'alloy',
      input: message,
    });
    const audioBuffer = Buffer.from(await ttsResponse.arrayBuffer());
    const filename = `ttsResponse_${phone}.mp3`;
    const ttsResponsePath = path.join(
      this.audioDir,
      'ttsResponse',
      assistantId,
    );
    if (!fs.existsSync(ttsResponsePath)) {
      fs.mkdirSync(ttsResponsePath, { recursive: true });
    }
    const audioPath = path.join(ttsResponsePath, filename);
    fs.writeFileSync(audioPath, audioBuffer);
    return path.join('audio', 'ttsResponse', assistantId, filename);
  }

  createTwimlResponse(audioFile: string, assistantId: string): string {
    const baseUrl = this.configService.get<string>('BASE_URL');
    const audioUrl = `${baseUrl}${audioFile}`;
    const twiml = new twilio.twiml.VoiceResponse();
    twiml.play(audioUrl);
    // twiml.record({
    //   action: `/api/twilio/voice-response/${assistantId}`,
    //   method: 'POST',
    //   recordingStatusCallback: `${baseUrl}api/twilio/recording-status/${assistantId}`,
    //   recordingStatusCallbackMethod: 'POST',
    //   playBeep: false,
    //   transcribe: true,
    // });
    twiml.gather({
      input: ['speech'],
      action: `/api/twilio/voice-response/${assistantId}`,
      method: 'POST',
      speechTimeout: 'auto',
    });
    return twiml.toString();
  }

  async processUserMessage(
    phone: number,
    userMessage: string,
  ): Promise<string> {
    const conversation = await this.getConversationContext(phone);
    const openaiResponse = await this.openaiClient.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [...conversation, { role: 'user', content: userMessage }],
      temperature: 0.7,
      max_tokens: 150,
      response_format: { type: 'json_object' },
    });
    const replyMessage = openaiResponse.choices[0].message.content.trim();
    conversation.push({ role: 'assistant', content: replyMessage });
    await this.saveConversationContext(phone, conversation);
    const validJson = this.getValidJson(replyMessage);
    console.log(validJson);
    return validJson.message;
  }

  async getCallLog(callSid: string): Promise<any> {
    try {
      const call = await this.twilioClient.calls(callSid).fetch();
      await this.callLogsService.create(call);
      // const recordings = await this.twilioClient.recordings.list({
      //   callSid,
      // });
      // console.log('Call Log:', call);
      // console.log('Call recordings:', recordings);
    } catch (error) {
      console.error('Error fetching call log:', error);
    }
  }

  async updateVoiceUrl(phoneNumber: string, id: string): Promise<any> {
    try {
      const baseUrl = this.configService.get<string>('BASE_URL');
      const voiceUrl = `${baseUrl}api/twilio/voice/${id}`;
      const voiceFallbackUrl = `${baseUrl}api/twilio/voice-fallback/${id}`;
      const statusCallback = `${baseUrl}api/twilio/call-status/${id}`;
      const numbers = await this.twilioClient.incomingPhoneNumbers.list({
        phoneNumber,
      });

      if (numbers.length > 0) {
        const incomingPhoneNumber = numbers[0];
        // await this.twilioClient.insights.v1
        //   .settings()
        //   .update({ voiceTrace: true });
        await this.twilioClient
          .incomingPhoneNumbers(incomingPhoneNumber.sid)
          .update({
            voiceUrl,
            voiceMethod: 'POST',
            voiceFallbackUrl,
            voiceFallbackMethod: 'POST',
            statusCallback,
            statusCallbackMethod: 'POST',
          });
        return { voiceUrl, voiceFallbackUrl, statusCallback };
      } else {
        throw new Error('Phone number not found');
      }
    } catch (error) {
      console.error('Error updating voice URL:', error);
      throw error;
    }
  }
}
