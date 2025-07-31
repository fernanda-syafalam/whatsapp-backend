import { IsString } from "class-validator";

export class DeviceID {
  @IsString()
  deviceID: string;
}

export interface GetDevicesResponse {
  success: boolean;
  code: number;
  message: string[];
}

export interface GetGroupsResponse {
  success: boolean;
  code: number;
  message: Group[];
}

export interface Group {
  id: string;
  subject: string;
  subjectOwner?: string | undefined;
  subjectTime?: number | undefined;
  size?: number | undefined;
}

export interface SendMessageDto {
  deviceID: string;
  to: string;
  message: string;
  disappearingDay?: number | undefined;
}

export interface SendMediaDto {
  deviceID: string;
  to: string;
  urlMedia: string;
  mediaName: string;
  ptt: boolean;
  mediaType: string;
  disappearingDay?: number | undefined;
}

export interface DefaultResponse {
  success: boolean;
  code: number;
  message?: string | undefined;
  error?: string | undefined;
}
