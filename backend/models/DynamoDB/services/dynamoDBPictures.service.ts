import {DynamoDBService} from "@models/DynamoDB/services/dynamoDB.service";
import {createKeyTemplate} from "@helper/keyTemplate";
import {getEnv} from "@helper/environment";
import {HashedPassword} from "@services/hashPassword.service";
import {PictureMetadata} from "../../../api/gallery/gallery.service";

export interface PictureResponse {
  partitionKey: string,
  sortKey: string,
  email: string,
  metadata: any;
  dateOfCreation: string;
  status: string;
}

export class DynamoDBPicturesService {
  private dynamoDBService = new DynamoDBService();
  private userTableName = getEnv('USERS_TABLE_NAME');
  private userPrefix = getEnv('USER_PREFIX');
  private imagePrefix = getEnv('IMAGE_PREFIX');

  createPictureObjectInDB = async (email: string, metadata: PictureMetadata) => {
    const partitionKey = createKeyTemplate(this.userPrefix, email);
    const sortKey = createKeyTemplate(this.imagePrefix, metadata.name);
    const attributes = {
      email,
      metadata,
      dateOfUploading: new Date().toLocaleDateString()
    }

    await this.dynamoDBService.putItem(this.userTableName, partitionKey, sortKey, attributes)
  }
}