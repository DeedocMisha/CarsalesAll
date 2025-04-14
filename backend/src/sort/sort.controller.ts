import { Controller, Get, Query } from '@nestjs/common';
import { SortDto } from './dto/sort.dto';
import { SortService } from './sort.servise';

@Controller('sort')
export class SortController {
  constructor(private readonly sortService: SortService) {}

  @Get()
  async getSort(@Query() sortDto: SortDto) {
    return this.sortService.getSort(sortDto);
  }
}