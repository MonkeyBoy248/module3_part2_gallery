import { errorHandler } from '@helper/http-api/error-handler';
import { createResponse } from '@helper/http-api/response';
import { APIGatewayProxyHandler, APIGatewayProxyHandlerV2 } from "aws-lambda";
import { GalleryManager } from "./gallery.manager";
import multipartParser from 'lambda-multipart-parser';

const manager = new GalleryManager();

export const createResponseObject: APIGatewayProxyHandlerV2 = async (event, context) => {
  console.log(event);

  try {
    const email = event.requestContext.authorizer?.jwt.claims.email as string;
    const queryObject = event.queryStringParameters;
    const page = queryObject?.page ?? '1';
    const limit = queryObject?.limit ?? '4';
    const filter = queryObject?.filter ?? 'false';

    const responseObject = await manager.createResponseObject(page, limit, filter, email);

    return createResponse(200, responseObject);
  } catch (err) {
    return errorHandler(err);
  }
};



export const uploadUserPicture: APIGatewayProxyHandler = async (event, context) => {
  console.log(event);

  try {
    const manager = new GalleryManager();


    const email = event.requestContext.authorizer?.jwt.claims.email as string;
    const file = await multipartParser.parse(event);
    const response = await manager.uploadUserPicture(file, email);

    return createResponse(200, response);
  } catch (err) {
    return errorHandler(err);
  }
}

export const uploadDefaultPictures: APIGatewayProxyHandlerV2 = async (event, context) => {
  console.log(event);

  try {
    const manager = new GalleryManager();

    const response = await manager.uploadDefaultPictures();

    return createResponse(200, response);
  } catch (err) {
    return errorHandler(err);
  }
}


