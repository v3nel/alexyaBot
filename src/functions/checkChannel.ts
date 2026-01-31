import { DMChannel, TextBasedChannel, TextChannel } from "discord.js";

export default function checkChannel(channel: TextBasedChannel) {
    return (
        channel instanceof TextChannel ||
        channel instanceof DMChannel
    )
}