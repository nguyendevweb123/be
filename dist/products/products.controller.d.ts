import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './schemas/products.schema';
import { ConfigService } from '@nestjs/config';
export declare class ProductsController {
    private readonly productsService;
    private readonly configService;
    constructor(productsService: ProductsService, configService: ConfigService);
    findAll(): Promise<Product[]>;
    findOne(id: string): Promise<Product>;
    create(dto: CreateProductDto, file: Express.Multer.File): Promise<Product>;
    update(id: string, dto: UpdateProductDto, file?: Express.Multer.File): Promise<Product>;
    remove(id: string): Promise<Product>;
    import(file: Express.Multer.File): Promise<any>;
}
