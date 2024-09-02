import { Controller, Post, Param, Req, Res } from '@nestjs/common';
import { TwilioService } from './twilio.service';
import { Request, Response } from 'express';
import { AssistantService } from '../assistant/assistant.service';
import { isEmpty } from 'lodash';

@Controller('twilio')
export class TwilioController {
  constructor(
    private readonly twilioService: TwilioService,
    private readonly assistantService: AssistantService,
  ) {}

  @Post('voice/:id')
  async handleVoice(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    console.log('handleVoice');
    const assistant = await this.assistantService.findOne({ _id: id });
    const conversationId = +req.body.From;

    let conversation =
      await this.twilioService.getConversationContext(conversationId);
    if (isEmpty(conversation)) {
      conversation = [{ role: 'system', content: assistant.prompt }];
      await this.twilioService.saveConversationContext(
        conversationId,
        conversation,
      );
    }
    const filePath = await this.twilioService.generateTTSResponse(
      conversationId,
      id,
      assistant.customGreeting || 'How can I assist you today?',
    );
    const twiml = this.twilioService.createTwimlResponse(filePath, id);
    res.type('text/xml');
    res.send(twiml);
  }

  @Post('voice-response/:id')
  async handleVoiceResponse(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    console.log('handleVoiceResponse');

    const { SpeechResult: userMessage } = req.body;
    const conversationId = +req.body.From;
    const replyMessage = await this.twilioService.processUserMessage(
      conversationId,
      userMessage,
    );
    const filePath = await this.twilioService.generateTTSResponse(
      conversationId,
      id,
      replyMessage,
    );
    const twiml = this.twilioService.createTwimlResponse(filePath, id);
    res.type('text/xml');
    res.send(twiml);
  }

  @Post('call-status/:id')
  async handleCallStatus(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    console.log('handleCallStatus');
    const conversationId = +req.body.From;
    await this.twilioService.deleteConversationContext(conversationId);
    await this.twilioService.getCallLog(req.body.CallSid);
    res.status(200).send();
  }

  @Post('voice-fallback/:id')
  async handleVoiceFallback(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    console.log('handleVoiceFallback');
    const conversationId = +req.body.From;
    await this.twilioService.deleteConversationContext(conversationId);
    console.log(id);
    console.log(req.body);
    res.status(200).send();
  }

  //   @Post('recording-status/:id')
  //   async handleRecordingStatus(
  //     @Param('id') id: string,
  //     @Req() req: Request,
  //     @Res() res: Response,
  //   ) {
  //     console.log('handleRecordingStatus');
  //     console.log(id);
  //     console.log(req.body);
  //     res.status(200).send();
  //   }
}
