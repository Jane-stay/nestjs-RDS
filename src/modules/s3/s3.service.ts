import { Injectable } from '@nestjs/common';
import { AwsConfigService } from '../../config/aws/config.service';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Express } from 'express';
import { Multer } from 'multer';


@Injectable()
export class S3Service {
  private s3: S3Client;

  constructor(private awsConfigService: AwsConfigService) {
    this.s3 = new S3Client({
      region: this.awsConfigService.awsRegion,
      credentials: {
        accessKeyId: this.awsConfigService.awsAccessKeyId!,
        secretAccessKey: this.awsConfigService.awsSecretAccessKey!,
      },
    });
  }
  async uploadFile(file: Express.Multer.File, dirPath: string) {
    if (!file) {
      throw new Error();
    }
    // const fileName = Date.now().toString();
    const fileName = `${Date.now()}-${file.originalname}`;
    // const fileName = `${dirPath}/${Date.now()}`;

    const uploadParams = {
      Bucket: this.awsConfigService.awsBucketName,
      Key: `${dirPath}/${fileName.toString()}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    await this.s3.send(new PutObjectCommand(uploadParams));

    return `https://${this.awsConfigService.awsBucketName}.s3.${this.awsConfigService.awsRegion}.amazonaws.com/${fileName}`;
  }
}
