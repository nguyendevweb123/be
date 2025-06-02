import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from './schemas/products.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import * as fs from 'fs';
import * as csv from 'csv-parser';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  async create(dto: CreateProductDto): Promise<Product> {
    const created = new this.productModel(dto);
    return created.save();
  }

  async findOne(id: string): Promise<Product> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Invalid ID format`);
    }

    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return product;
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Invalid ID format`);
    }

    const existing = await this.productModel.findById(id).exec();
    if (!existing) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    // Cập nhật từng field nếu có
    if (dto.name !== undefined) existing.name = dto.name;
    if (dto.quantity !== undefined) existing.quantity = dto.quantity;
    if (dto.price !== undefined) existing.price = dto.price;
    if (dto.category !== undefined) existing.category = dto.category;
    if (dto.status !== undefined) existing.status = dto.status;

    // ✅ Ghi đè image nếu có
    if (dto.image) {
      existing.image = dto.image;
    }

    return existing.save();
  }

  async remove(id: string): Promise<Product> {
    const deleted = await this.productModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return deleted;
  }

  async importFromCsv(filePath: string): Promise<any> {
    const results: CreateProductDto[] = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
          try {
            const product: CreateProductDto = {
              name: data.name?.trim(),
              quantity: Number(data.quantity),
              price: Number(data.price),
              category: data.category?.trim(),
              status: ['active', 'disable'].includes(data.status?.trim().toLowerCase())
                ? data.status.trim().toLowerCase()
                : 'active',
            };

            if (!product.name || !product.category || isNaN(product.price) || isNaN(product.quantity)) {
              console.warn('⚠️ Invalid product data in CSV row, skipping:', data);
              return;
            }

            results.push(product);
          } catch (err) {
            console.error('❌ Error parsing CSV row:', err.message);
          }
        })
        .on('end', async () => {
          try {
            await this.productModel.insertMany(results);
            fs.unlinkSync(filePath);
            resolve({ inserted: results.length });
          } catch (err) {
            reject(err);
          }
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }
}
