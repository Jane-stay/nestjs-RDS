import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import { S3Service } from '../s3/s3.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Express } from 'express';
import { Multer } from 'multer';
import { Request } from 'express';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    private s3Service: S3Service,
  ) {}

  async uploadImage(file: Express.Multer.File) {
    const filePath = 'image';
    const resultUrl = await this.s3Service.uploadFile(file!, filePath);
    const image = this.imageRepository.create({
      imageUrl: resultUrl,
      filePath,
    });
    await this.imageRepository.save(image);
    return { resultUrl };
  }
}
