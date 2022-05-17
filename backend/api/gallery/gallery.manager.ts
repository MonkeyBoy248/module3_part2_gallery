import { GalleryService } from "./gallery.service";
import { MultipartRequest } from "lambda-multipart-parser";
import { HttpBadRequestError } from "@floteam/errors";

export class GalleryManager {
  private readonly service: GalleryService;

  constructor() {
    this.service = new GalleryService();
  }

  createResponseObject = async (page: string,  limit: string, filter: string, email: string) => {
    const queryParams = await this.service.validateAndConvertParams(page, limit, filter, email);

    return this.service.createResponseObject(queryParams.page, queryParams.limit, queryParams.filter, email);
  }

  uploadUserPicture = async (file: MultipartRequest, email: string) => {
    if (file.files.length === 0) {
      throw new HttpBadRequestError('No file to upload');
    }

    return this.service.uploadUserPicture(file.files[0], email);
  }

  uploadDefaultPictures = async () => {
    return this.service.uploadDefaultPictures();
  }
}
