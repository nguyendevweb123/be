"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const products_schema_1 = require("./schemas/products.schema");
const fs = require("fs");
const csv = require("csv-parser");
let ProductsService = class ProductsService {
    productModel;
    constructor(productModel) {
        this.productModel = productModel;
    }
    async findAll() {
        return this.productModel.find().exec();
    }
    async create(dto) {
        const created = new this.productModel(dto);
        return created.save();
    }
    async findOne(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.NotFoundException(`Invalid ID format`);
        }
        const product = await this.productModel.findById(id).exec();
        if (!product) {
            throw new common_1.NotFoundException(`Product with id ${id} not found`);
        }
        return product;
    }
    async update(id, dto) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.NotFoundException(`Invalid ID format`);
        }
        const existing = await this.productModel.findById(id).exec();
        if (!existing) {
            throw new common_1.NotFoundException(`Product with id ${id} not found`);
        }
        if (dto.name !== undefined)
            existing.name = dto.name;
        if (dto.quantity !== undefined)
            existing.quantity = dto.quantity;
        if (dto.price !== undefined)
            existing.price = dto.price;
        if (dto.category !== undefined)
            existing.category = dto.category;
        if (dto.status !== undefined)
            existing.status = dto.status;
        if (dto.image) {
            existing.image = dto.image;
        }
        return existing.save();
    }
    async remove(id) {
        const deleted = await this.productModel.findByIdAndDelete(id).exec();
        if (!deleted) {
            throw new common_1.NotFoundException(`Product with id ${id} not found`);
        }
        return deleted;
    }
    async importFromCsv(filePath) {
        const results = [];
        return new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (data) => {
                try {
                    const product = {
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
                }
                catch (err) {
                    console.error('❌ Error parsing CSV row:', err.message);
                }
            })
                .on('end', async () => {
                try {
                    await this.productModel.insertMany(results);
                    fs.unlinkSync(filePath);
                    resolve({ inserted: results.length });
                }
                catch (err) {
                    reject(err);
                }
            })
                .on('error', (error) => {
                reject(error);
            });
        });
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(products_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ProductsService);
//# sourceMappingURL=products.service.js.map