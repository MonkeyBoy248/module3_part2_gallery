import {DynamoDBPicturesService} from "@models/DynamoDB/services/dynamoDBPictures.service";
import { GalleryObject, QueryObject } from "./gallery.interface";
import { HttpBadRequestError, HttpInternalServerError } from "@floteam/errors";
import {S3Service} from "@services/S3.service";
import {getEnv} from "@helper/environment";
import {v4 as uuidv4} from "uuid";

export interface PictureMetadata {
  name: string,
  extension: string,
  size: number;
  dimensions: {
    width: number,
    height: number
  }
}

export class GalleryService {
  private dbPicturesService = new DynamoDBPicturesService();
  private s3Service = new S3Service();
  private picturesBucketName = getEnv('BUCKET_NAME');

  validateAndConvertParams = async (page: string, limit: string, filter: string, email: string) => {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const filterBool = filter === 'false';
    const totalPagesAmount = await this.countTotalPagesAmount(limitNumber, filterBool, email)

    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      throw new HttpBadRequestError('Page or limit value is not a number');
    }

    if (!isFinite(pageNumber) || !isFinite(limitNumber)) {
      throw new HttpBadRequestError('Invalid query parameters');
    }

    if (pageNumber < 1 || pageNumber > totalPagesAmount) {
      throw new HttpBadRequestError('Invalid page number');
    }

    return {
      page: pageNumber,
      limit: limitNumber,
      filter: filterBool
    } as QueryObject
  }

  private countTotalPagesAmount = async (limit: number, filter: boolean, email:string): Promise<number> => {
    try {
      const picturesPerPage = limit;
      const picturesTotal = await this.dbPicturesService.getAllImages(email);
      const totalPages: number = Math.ceil(picturesTotal?.length / picturesPerPage);

      console.log('total', totalPages);

      return totalPages;
    } catch (err) {
      throw new HttpInternalServerError('Failed to get pictures amount');
    }
  }

  getPictures = async (page: number, limit: number, filter: boolean, email: string): Promise<GalleryObject> => {
    try {
      const pictures = await this.dbPicturesService.getAllImages(email);
      const total = await this.countTotalPagesAmount(limit, filter, email);
      const objects = await Promise.all(
        pictures.slice((page - 1) * limit, page * limit)
          .map((picture) => {
        return this.s3Service.getPreSignedGetUrl(`${email}/${picture.name}`, this.picturesBucketName)
      }))

      return  {
        objects,
        total,
        page
      }
    } catch (err) {
      throw new HttpInternalServerError('Failed to create response object')
    }
  }


 uploadPicture = async (email: string, metadata: PictureMetadata) => {
    const fileExtension = metadata.extension.split('/').pop();
    const pictureId = `${uuidv4()}.${fileExtension}`.toLowerCase();

    await this.dbPicturesService.createPictureObjectInDB(email, metadata, pictureId);

    return this.s3Service.getPreSignedPutUrl(`${email}/${pictureId}`, this.picturesBucketName, metadata.extension);
  }

  // uploadDefaultPictures = async () => {
  //   try {
  //     await mongoConnectionService.connectDB();
  //
  //     await this.dbPicturesService.savePicturesToTheDB();
  //
  //     return { message: 'Default pictures were added' };
  //   } catch (err) {
  //     throw new HttpInternalServerError('Failed to upload default images')
  //   }
  // }
}