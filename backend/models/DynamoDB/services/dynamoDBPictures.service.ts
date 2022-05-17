import {DynamoDBService} from "@models/DynamoDB/services/dynamoDB.service";
import {createKeyTemplate} from "@helper/keyTemplate";
import {getEnv} from "@helper/environment";
import {HashedPassword} from "@services/hashPassword.service";

interface PictureResponse {
  partitionKey: string,
  sortKey: string,
  email: string,
  metadata: any;
  dateOfCreation: string;
  status: string;
}

class DynamoDBPicturesService {
  private dynamoDBService = new DynamoDBService();
  private userPicturesTableName = getEnv('USERS_TABLE_NAME');
  private userPrefix = getEnv('USER_PREFIX');
  private profilePrefix = getEnv('PROFILE_PREFIX');

  createPictureObjectInDB = () => {

  }
}