import {GalleryService} from "./gallery.service";

export class GalleryManager {
  private readonly service: GalleryService;

  constructor() {
    this.service = new GalleryService();
  }

  // createResponseObject = async (page: string,  limit: string, filter: string, email: string) => {
  //   const queryParams = await this.service.validateAndConvertParams(page, limit, filter, email);
  //
  //   return this.service.createResponseObject(queryParams.page, queryParams.limit, queryParams.filter, email);
  // }

  createPreSignedUploadLink = async (data: string, email: string) => {
    const metadata = JSON.parse(data);

    return this.service.createPreSignedUploadLink(email, metadata);
  }

  // uploadDefaultPictures = async () => {
  //   return this.service.uploadDefaultPictures();
  // }
}
