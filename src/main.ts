import { App } from 'aws-cdk-lib';
import { EventDrivenEcsTaskStack } from './lib/event-driven-ecs-task-stack';
// import { AwsPrototypingChecks, PDKNag } from '@aws-prototyping-sdk/pdk-nag';


const app = new App();

// const app = PDKNag.app({
//   nagPacks: [new AwsPrototypingChecks()],
// });

new EventDrivenEcsTaskStack(app, 'event-driven-ecs-task-dev', {});

app.synth();
