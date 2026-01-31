import { DMChannel, TextBasedChannel, TextChannel, ChannelType } from "discord.js";

export default function isCollectable(
    channel: TextBasedChannel
): channel is TextChannel | DMChannel {
    return (
        channel instanceof TextChannel ||
        channel instanceof DMChannel ||
        channel.type === ChannelType.PublicThread ||
        channel.type === ChannelType.PrivateThread
    );
}