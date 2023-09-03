import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { JobsService } from './jobs.service';


@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}



}
