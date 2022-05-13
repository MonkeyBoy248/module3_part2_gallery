import {AWSPartitial} from "../../types";

export const usersTableConfig: AWSPartitial = {
  provider: {
    environment: {
      USERS_TABLE_NAME: '${self:custom.tablesNames.UsersTable.${self:provider.stage}}',
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: [
              'dynamodb:DescribeTable',
              'dynamodb:Query',
              'dynamodb:Scan',
              'dynamodb:GetItem',
              'dynamodb:PutItem',
              'dynamodb:DeleteItem',
              'dynamodb:UpdateItem',
              'dynamodb:BatchGetItem',
              'dynamodb:BatchWriteItem',
            ],
            Resource: [
              'arn:aws:dynamodb:*:*:table/${self:custom.tablesNames.UsersTable.${self:provider.stage}}',
              'arn:aws:dynamodb:*:*:table/${self:custom.tablesNames.UsersTable.${self:provider.stage}}/index/*',
            ],
          },
        ],
      },
    },
  },
  resources: {
    Resources: {
      UsersTable: {
        Type: 'AWS::DynamoDB::Table',
        DeletionPolicy: 'Retain',
        Properties: {
          AttributeDefinitions: [
            {
              AttributeName: 'PK',
              AttributeType: 'S'
            },
            {
              AttributeName: 'SK',
              AttributeType: 'S'
            },
          ],
          KeySchema: [
            {
              AttributeName: 'PK',
              KeyType: 'HASH',
            },
            {
              AttributeName: 'SK',
              KeyType: 'RANGE',
            },
          ],
          // GlobalSecondaryIndexes: [
          //   {
          //     IndexName: 'ProducerIdGlobalIndex',
          //     KeySchema: [
          //       {
          //         AttributeName: 'Partition Key: PK',
          //         KeyType: 'HASH',
          //       },
          //       {
          //         AttributeName: 'Sort Key: SK',
          //         KeyType: 'RANGE',
          //       },
          //     ],
          //     Projection: {
          //       ProjectionType: 'ALL',
          //     },
          //     ProvisionedThroughput: {
          //       ReadCapacityUnits: 2,
          //       WriteCapacityUnits: 2,
          //     },
          //   },
          //   {
          //     IndexName: 'CrewIdGlobalIndex',
          //     KeySchema: [
          //       {
          //         AttributeName: 'crewId',
          //         KeyType: 'HASH',
          //       },
          //       {
          //         AttributeName: 'status',
          //         KeyType: 'RANGE',
          //       },
          //     ],
          //     Projection: {
          //       ProjectionType: 'ALL',
          //     },
          //     ProvisionedThroughput: {
          //       ReadCapacityUnits: 2,
          //       WriteCapacityUnits: 2,
          //     },
          //   },
          // ],
          BillingMode: 'PAY_PER_REQUEST',
          TableName: '${self:custom.tablesNames.UsersTable.${self:provider.stage}}',
          StreamSpecification: {
            StreamViewType: 'NEW_AND_OLD_IMAGES',
          },
        },
      },
    },
  },
  custom: {
    tablesNames: {
      UsersTable: {
        local: 'Users-pictures-local',
        dev: 'Users-pictures-dev',
        test: 'Users-pictures-test',
        prod: 'Users-pictures',
      },
    },
  },
};