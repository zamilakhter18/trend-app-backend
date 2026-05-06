import { Injectable } from "@nestjs/common";
import { ServiceResponse } from "./common/interfaces/service-response.interface";
import { messages } from "./common/helpers/message";

@Injectable()
export class AppService {
  async getHello(): Promise<ServiceResponse<string>> {
    return {
      success: true,
      message: messages.FETCH_SUCCESS,
      data: "Hello World!",
    };
  }
}
