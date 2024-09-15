import { Injectable } from '@nestjs/common';
import { WorkerService } from './worker.service';

@Injectable()
export class WorkerConsumer {
  constructor(private readonly workerService: WorkerService) {}


}