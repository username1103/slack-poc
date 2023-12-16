import { SlackController } from '../slack/decorator/slack-controller';
import { Command, EventSubscription } from '../slack/decorator/slack-method';
import {
  ReactionAddedEvent,
  RespondFn,
  SayFn,
  SlashCommand,
} from '@slack/bolt';
import { Payload, Respond, Say } from '../slack/decorator/slack-argument';

@SlackController()
export class SampleController {
  @EventSubscription('reaction_added')
  async eventSample(@Payload() payload: ReactionAddedEvent, @Say() say: SayFn) {
    console.dir(payload, { depth: null });

    await say('Hello Slack NestJS! - EVENT');
  }

  @Command('/커맨드', false)
  async commandSample(
    @Payload() payload: SlashCommand,
    @Say() say: SayFn,
    @Respond() respond: RespondFn,
  ) {
    console.dir(payload, { depth: null });

    await say('Hello Slack NestJS! - COMMAND');

    await respond('respond');
  }
}
