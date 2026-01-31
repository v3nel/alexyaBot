import fetch from "node-fetch";

export default async function downloadAttachment(link: string): Promise<Buffer<ArrayBuffer>> {
    const downloadRequest = await fetch(link);
    const downloadResponse = Buffer.from(await downloadRequest.arrayBuffer());
    return downloadResponse
}