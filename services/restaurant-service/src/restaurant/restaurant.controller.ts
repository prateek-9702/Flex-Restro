import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Logger } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';

@Controller('restaurants')
export class RestaurantController {
  private readonly logger = new Logger(RestaurantController.name);

  constructor(private readonly restaurantService: RestaurantService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createRestaurantDto: any, @Request() req) {
    return this.restaurantService.create({ ...createRestaurantDto, tenant_id: req.user.tenantId });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Request() req) {
    return this.restaurantService.findAll(req.user.tenantId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @Request() req) {
    return this.restaurantService.findOne(id, req.user.tenantId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateRestaurantDto: any, @Request() req) {
    return this.restaurantService.update(id, req.user.tenantId, updateRestaurantDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() req) {
    return this.restaurantService.remove(id, req.user.tenantId);
  }

  @Get('welcome')
  @UseGuards(JwtAuthGuard)
  welcome(@Request() req) {
    this.logger.log(`Request received: ${req.method} ${req.url}`);
    return { message: 'Welcome to the Restaurant Service!' };
  }
}
