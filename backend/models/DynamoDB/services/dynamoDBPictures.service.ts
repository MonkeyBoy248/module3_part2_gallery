import {DynamoDBService} from "@models/DynamoDB/services/dynamoDB.service";
import {createKeyTemplate} from "@helper/keyTemplate";
import {getEnv} from "@helper/environment";
import {PictureMetadata} from "../../../api/gallery/gallery.service";

export interface PictureResponse {
  partitionKey: string,
  sortKey: string,
  name: string,
  metadata: any;
  dateOfCreation: string;
  status: string;
}

export class DynamoDBPicturesService {
  private dynamoDBService = new DynamoDBService();
  private userTableName = getEnv('USERS_TABLE_NAME');
  private userPrefix = getEnv('USER_PREFIX');
  private imagePrefix = getEnv('IMAGE_PREFIX');

  createPictureObjectInDB = async (email: string, metadata: PictureMetadata, pictureId: string) => {
    const partitionKey = createKeyTemplate(this.userPrefix, email);
    const sortKey = createKeyTemplate(this.imagePrefix, pictureId);
    const attributes = {
      name: pictureId,
      metadata,
      dateOfUploading: new Date().toLocaleDateString()
    }

    await this.dynamoDBService.putItem(this.userTableName, partitionKey, sortKey, attributes)
  }

  getAllImages = async (email: string) => {
    const userKey = createKeyTemplate(this.userPrefix, email);
    const keyConditionExpression = `PK = :u AND begins_with(SK, :i)`;
    const expressionAttributeValues = {
      ':u': `${userKey}`,
      ':i': `${this.imagePrefix}#`
    }

    const pictures = await this.dynamoDBService.queryItems(this.userTableName, keyConditionExpression, expressionAttributeValues);

    return pictures.Items ? pictures.Items as PictureResponse[]: [];
  }
}