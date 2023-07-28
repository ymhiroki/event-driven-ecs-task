import { App } from 'aws-cdk-lib';
import { EventDrivenEcsTaskStack } from './lib/event-driven-ecs-task-stack';

const app = new App();

new EventDrivenEcsTaskStack(app, 'event-driven-ecs-task-dev', {});

app.synth();
