import {
  IsString,
  IsBoolean,
  IsMongoId,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ObjectId } from 'mongodb';
import { OmitType } from '@nestjs/mapped-types';

export class SmsSettingDto {
  @IsOptional()
  @IsString()
  readonly key: string;

  @IsOptional()
  @IsString()
  readonly condition: string;

  @IsOptional()
  @IsString()
  readonly content: string;
}

export class CallTransferSettingDto {
  @IsOptional()
  @IsString()
  readonly key: string;

  @IsOptional()
  @IsString()
  readonly condition: string;

  @IsOptional()
  @IsString()
  readonly number: string;
}

export class InformationExtractorDto {
  @IsOptional()
  @IsString()
  readonly key: string;

  @IsOptional()
  @IsString()
  readonly condition: string;

  @IsOptional()
  @IsString()
  readonly identifier: string;
}

export class AssistantDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsString()
  readonly image?: string;

  @IsOptional()
  @IsString()
  readonly voice?: string;

  @IsOptional()
  @IsString()
  readonly language?: string;

  @IsOptional()
  @IsBoolean()
  readonly recording?: boolean;

  @IsOptional()
  @IsString()
  readonly customGreeting?: string;

  @IsOptional()
  @IsString()
  readonly prompt?: string;

  @IsOptional()
  @IsBoolean()
  readonly isActive?: boolean;

  @IsOptional()
  @IsString()
  readonly number?: string;

  @IsOptional()
  @IsString()
  openaiAssistant?: string;

  @IsOptional()
  @IsMongoId()
  @Type(() => ObjectId)
  createdBy?: ObjectId;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SmsSettingDto)
  readonly smsSettings?: SmsSettingDto[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CallTransferSettingDto)
  readonly callTransferSettings?: CallTransferSettingDto[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => InformationExtractorDto)
  readonly informationExtractor?: InformationExtractorDto[];
}

export class BodyAssistantDto extends OmitType(AssistantDto, [
  'createdBy',
] as const) {}
