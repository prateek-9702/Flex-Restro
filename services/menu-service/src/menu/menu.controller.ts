import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MenuService } from './menu.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('menus')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createMenuDto: any, @Request() req) {
    return this.menuService.createMenu(req.user.tenantId, createMenuDto.restaurant_id, createMenuDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Request() req) {
    return this.menuService.findAllMenus(req.user.tenantId, req.query.restaurant_id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @Request() req) {
    return this.menuService.findMenuById(+id, req.user.tenantId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateMenuDto: any, @Request() req) {
    return this.menuService.updateMenu(+id, req.user.tenantId, updateMenuDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() req) {
    return this.menuService.deleteMenu(+id, req.user.tenantId);
  }

  @Post(':menuId/items')
  @UseGuards(JwtAuthGuard)
  createItem(@Param('menuId') menuId: string, @Body() createItemDto: any) {
    return this.menuService.createMenuItem(+menuId, createItemDto);
  }

  @Get(':menuId/items')
  @UseGuards(JwtAuthGuard)
  findItems(@Param('menuId') menuId: string) {
    return this.menuService.findMenuItems(+menuId);
  }

  @Patch('items/:id')
  @UseGuards(JwtAuthGuard)
  updateItem(@Param('id') id: string, @Body() updateItemDto: any) {
    return this.menuService.updateMenuItem(+id, updateItemDto);
  }

  @Delete('items/:id')
  @UseGuards(JwtAuthGuard)
  removeItem(@Param('id') id: string) {
    return this.menuService.deleteMenuItem(+id);
  }

  @Post('upload-image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const key = `menu-images/${Date.now()}-${file.originalname}`;
    const imageUrl = await this.menuService.uploadImageToS3(file, key);
    return { message: 'Image uploaded successfully', imageUrl };
  }
}
