import { Controller, Get, Param, Query, Res, Sse } from '@nestjs/common';
import { EventEmitter } from 'stream';
import { Response } from 'express';
import { readFileSync } from 'fs';
import { AppService } from './app.service';
import { join } from 'path';
import { fromEvent, Observable } from 'rxjs';

@Controller()
export class AppController {
  private readonly emitter = new EventEmitter();
  constructor(private readonly appService: AppService) {}

  @Get('test/:id')
  getHello(@Param() param): string {
    this.emitter.emit(param.id, { data: { name: 'Fauzi' } });
    return this.appService.getHello();
  }

  @Sse('event/transaction')
  test(@Query() query: { id: string }): Observable<any> {
    return fromEvent(this.emitter, query.id);
  }

  @Get('html')
  index(@Res() response: Response) {
    response
      .type('text/html')
      .send(readFileSync(join(__dirname, 'index.html')).toString());
  }
}
