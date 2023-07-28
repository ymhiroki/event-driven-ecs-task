import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export interface EventDrivenEcsTaskStackProps extends cdk.StackProps {
}

export class EventDrivenEcsTaskStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: EventDrivenEcsTaskStackProps) {
    super(scope, id, props);

    // ログ保存用のバケット
    const logBucket = new s3.Bucket(this, 'LogBucket', {
      autoDeleteObjects: true,
      enforceSSL: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // タスクで生成したオブジェクトを保存するバケット
    const bucket = new s3.Bucket(this, 'Bucket', {
      autoDeleteObjects: true,
      enforceSSL: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      serverAccessLogsBucket: logBucket,
    });

    // タスクが動作する VPC を作成
    const vpc = new ec2.Vpc(this, 'Vpc', {
    });

    // タスクが動作する ECS クラスターを作成
    const cluster = new ecs.Cluster(this, 'Cluster', {
      vpc,
    });

    // タスクが利用する IAM ロールを作成
    const taskRole = new iam.Role(this, 'TaskRole', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
    });
    bucket.grantReadWrite(taskRole);

    // タスクで動作するコンテナを設定
    const taskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDefinition', {
      taskRole,
    });
    taskDefinition.addContainer('AppContainer', {
      image: ecs.ContainerImage.fromAsset('./app'),
      logging: ecs.LogDrivers.awsLogs({
        streamPrefix: 'event-driven-ecs-task-demo',
      }),
      environment: {
        BUCKET_NAME: bucket.bucketName,
        REGION: cdk.Stack.of(this).region,
      }
    });

    // 一定時間毎にタスクを起動するイベントルール
    const rule = new events.Rule(this, 'Rule', {
      schedule: events.Schedule.expression('rate(5 minutes)'),
    });

    // イベントにより起動されるタスクを指定
    rule.addTarget(new targets.EcsTask({
      cluster,
      taskDefinition,
    }));

    new cdk.CfnOutput(this, 'BucketName', {
      value: bucket.bucketName,
    });
    new cdk.CfnOutput(this, 'BucketURL', {
      value: bucket.bucketWebsiteUrl,
    });
  }
}
