import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { HttpService } from '@nestjs/common';

interface Checkbox {
  id: string;
  value: boolean;
}

@WebSocketGateway()
export class CheckboxGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private httpService: HttpService) {}

  async getCheckboxes() {
    const { data } = await this.httpService
      .get<Checkbox[]>('https://609645ed116f3f00174b2db3.mockapi.io/checkboxes')
      .toPromise();

    return data;
  }

  async changeCheckbox(id: string, value: boolean) {
    const { data: receivedCheckbox } = await this.httpService
      .get(`https://609645ed116f3f00174b2db3.mockapi.io/checkboxes/${id}`)
      .toPromise();

    const { data } = await this.httpService
      .put<Checkbox>(
        `https://609645ed116f3f00174b2db3.mockapi.io/checkboxes/${id}`,
        {
          ...receivedCheckbox,
          value,
        },
      )
      .toPromise();

    return data;
  }

  async handleConnection() {
    const data = await this.getCheckboxes();
    this.server.emit('checkbox-all', data);
  }

  @SubscribeMessage('checkbox-changed')
  async handleCheckboxValue(@MessageBody() { id, value }: Checkbox) {
    const data = await this.changeCheckbox(id, value);
    console.log('changed', data);
    this.server.emit('checkbox-changed', data);
  }
}
