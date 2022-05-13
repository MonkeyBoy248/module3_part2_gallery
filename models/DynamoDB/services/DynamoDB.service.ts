import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient, GetCommand,
  GetCommandInput,
  PutCommand,
  PutCommandInput, QueryCommand, QueryCommandInput,
  TranslateConfig
} from "@aws-sdk/lib-dynamodb";
import {getEnv} from "@helper/environment";
import {HashedPassword} from "@services/hashPassword.service";
import {Stats} from "fs";

interface Attributes {
  email?: string,
  password?: HashedPassword,
  metadata?: Stats,
  status?: string
}

interface ExpressionAttributeValue {
  [value: string]: unknown;
}

export class DynamoDBService {
  private readonly dynamoClient: DynamoDBClient;
  private dynamoDocumentClient: DynamoDBDocumentClient;

  constructor() {
    const marshallOptions = {
      convertEmptyValues: false,
      removeUndefinedValues: false,
      convertClassInstanceToMap: false,
    };
    const unmarshallOptions = {
      wrapNumbers: false,
    };
    const translateConfig: TranslateConfig = {marshallOptions, unmarshallOptions};

   this.dynamoClient = new DynamoDBClient({region: getEnv('REGION')});
   this.dynamoDocumentClient = DynamoDBDocumentClient.from(this.dynamoClient, translateConfig);
  }

  putItem = async (tableName: string, partitionKey: string, sortKey: string, attributes: Attributes) => {
    const params: PutCommandInput = {
      TableName: tableName,
      Item: {
        partitionKey,
        sortKey,
        ...attributes
      }
    }
    return this.dynamoDocumentClient.send(new PutCommand(params))
  }

  getItem = async (tableName: string, partitionKey: string, sortKey: string, projection?: string[]) => {
    const params: GetCommandInput = {
      TableName: tableName,
      Key: {
        partitionKey,
        sortKey
      }
    }

    if (projection) {
      params.ProjectionExpression = projection.join(', ');
    }

    return this.dynamoDocumentClient.send(new GetCommand(params))
  }

  queryItems = async (tableName: string, keyConditionExpression: string, expressionAttributeValues: ExpressionAttributeValue) => {
    const params: QueryCommandInput = {
      TableName: tableName,
      KeyConditionExpression: keyConditionExpression,
      ExpressionAttributeValues: expressionAttributeValues
    }

    return this.dynamoDocumentClient.send(new QueryCommand(params));
  }
}