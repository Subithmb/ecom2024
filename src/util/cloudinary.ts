/* eslint-disable */

import { HttpException, HttpStatus } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';

export async function uploadFileToCloudinary(
  file: Express.Multer.File,
  configService: ConfigService,
): Promise<{ message: string; cloudinaryUrl: string }> {
  if (!file) {
    throw new HttpException('File is required', HttpStatus.BAD_REQUEST);
  }

  const cloudName = configService.get<string>('your_cloud_name');
  const apiKey = configService.get<string>('your_api_key');
  const apiSecret = configService.get<string>('your_api_secret');

  if (!cloudName || !apiKey || !apiSecret) {
    console.error('Missing Cloudinary configuration values!');
    throw new HttpException(
      'Cloudinary configuration is missing',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  try {
    const result: UploadApiResponse = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'uploads',
          resource_type: 'auto',
        },
        (error: UploadApiErrorResponse, uploadResult: UploadApiResponse) => {
          if (error) return reject(error);
          resolve(uploadResult);
        },
      );

      uploadStream.end(file.buffer);
    });

    return {
      message: 'File uploaded successfully',
      cloudinaryUrl: result.secure_url,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new HttpException(
      `Failed to upload image: ${error.message}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
