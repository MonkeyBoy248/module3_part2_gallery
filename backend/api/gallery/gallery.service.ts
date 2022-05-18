import {DynamoDBPicturesService} from "@models/DynamoDB/services/dynamoDBPictures.service";
import { GalleryObject, QueryObject } from "./gallery.interface";
import { Picture } from "@interfaces/picture.interface";
import { mongoConnectionService } from "@models/MongoDB/services/mongoConnection.service";
import { MultipartFile } from 'lambda-multipart-parser'
import { FileService } from "@services/file.service";
import { UserDBService } from "@models/MongoDB/services/userDB.service";
import { HttpBadRequestError, HttpInternalServerError } from "@floteam/errors";
import {S3Service} from "@services/S3.service";
import {getEnv} from "@helper/environment";
import {DynamoDBUserService} from "@models/DynamoDB/services/dynamoDBUser.service";

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
  private fileService = new FileService();
  private dbUsersService = new DynamoDBUserService();
  private dbPicturesService = new DynamoDBPicturesService();
  private s3Service = new S3Service();
  private picturesBucketName = getEnv('BUCKET_NAME');

  // validateAndConvertParams = async (page: string, limit: string, filter: string, email: string) => {
  //   const pageNumber = parseInt(page, 10);
  //   const limitNumber = parseInt(limit, 10);
  //   const filterBool = filter === 'false';
  //   const totalPagesAmount = await this.countTotalPagesAmount(limitNumber, filterBool, email)
  //
  //   if (isNaN(pageNumber) || isNaN(limitNumber)) {
  //     throw new HttpBadRequestError('Page or limit value is not a number');
  //   }
  //
  //   if (!isFinite(pageNumber) || !isFinite(limitNumber)) {
  //     throw new HttpBadRequestError('Invalid query parameters');
  //   }
  //
  //   if (pageNumber < 1 || pageNumber > totalPagesAmount) {
  //     throw new HttpBadRequestError('Invalid page number');
  //   }
  //
  //   return {
  //     page: pageNumber,
  //     limit: limitNumber,
  //     filter: filterBool
  //   } as QueryObject
  // }

  // countTotalPagesAmount = async (limit: number, filter: boolean, email:string): Promise<number> => {
  //   try {
  //     await mongoConnectionService.connectDB();
  //
  //     const user = await this.dbUsersService.getUserByEmail(email);
  //     const picturesPerPage = limit;
  //     const picturesTotal = await this.dbPicturesService.getPicturesAmount(user._id!, filter) || 0;
  //     const totalPages: number = Math.ceil(picturesTotal / picturesPerPage);
  //
  //     console.log('total', totalPages);
  //
  //     return totalPages;
  //   } catch (err) {
  //     throw new HttpInternalServerError('Failed to get pictures amount');
  //   }
  // }

  // createResponseObject = async (page: number, limit: number, filter: boolean, email: string): Promise<GalleryObject> => {
  //   try {
  //     await mongoConnectionService.connectDB();
  //
  //     const user = await this.dbUsersService.findUserByEmail(email);
  //     const objects = await this.dbPicturesService.getPicturesFromDB(user._id!, page, limit, filter) || [] as Picture[];
  //     const total = await this.countTotalPagesAmount(limit, filter, email);
  //
  //     return  {
  //       objects: objects,
  //       total,
  //       page
  //     }
  //   } catch (err) {
  //     throw new HttpInternalServerError('Failed to create response object')
  //   }
  // }

  createPreSignedUploadLink = async (email: string, metadata: PictureMetadata) => {
    const fileName = metadata.name;

    await this.dbPicturesService.createPictureObjectInDB(email, metadata);

    return this.s3Service.getPreSignedPutUrl(`${email}/${fileName}`, this.picturesBucketName, metadata.extension);
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