import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Product } from './schemas/products.schema';

const generateFilename = (file: Express.Multer.File): string => {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  return `${uniqueSuffix}${extname(file.originalname)}`;
};

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Product> {
    console.log('🔥 Called GET /products/' + id);
    return this.productsService.findOne(id);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, generateFilename(file));
        },
      }),
    }),
  )
  async create(
    @Body() dto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      dto.image = `http://localhost:3001/uploads/${file.filename}`;
    }
    return this.productsService.create(dto);
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, generateFilename(file));
        },
      }),
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      dto.image = `http://localhost:3001/uploads/${file.filename}`;
    }
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @Post('import')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, generateFilename(file));
        },
      }),
    }),
  )
  import(@UploadedFile() file: Express.Multer.File) {
    return this.productsService.importFromCsv(file.path);
  }
}
