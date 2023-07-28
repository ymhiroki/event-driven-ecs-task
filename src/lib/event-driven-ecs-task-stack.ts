import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import { Construct } from 'constructs';

export interface EventDrivenEcsTaskStackProps extends cdk.StackProps {
}

export class EventDrivenEcsTaskStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: EventDrivenEcsTaskStackProps) {
    super(scope, id, props);

    // タスクが動作する VPC を作成
    const vpc = new ec2.Vpc(this, 'Vpc', {
    });

    // タスクが動作する ECS クラスターを作成
    const cluster = new ecs.Cluster(this, 'Cluster', {
      vpc,
    });

    // タスクで動作するコンテナを設定
    const taskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDefinition', {
    });
    taskDefinition.addContainer('AppContainer', {
      image: ecs.ContainerImage.fromAsset('./app'),
    });

    // 一定時間毎にタスクを起動するイベントルール
    const rule = new events.Rule(this, 'Rule', {
      schedule: events.Schedule.expression('rate(1 minute)'),
    });

    // イベントにより起動されるタスクを指定
    rule.addTarget(new targets.EcsTask({
      cluster,
      taskDefinition,
    }));
  }
}
