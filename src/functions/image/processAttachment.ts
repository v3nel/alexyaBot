import downloadAttachment from "./downloadAttachment.js";
import uploadAttachment from "./uploadAttachment.js";

export async function processAttachment(attachment: string, contentType?: string) {
    const buffer = await downloadAttachment(attachment); 
    const url = await uploadAttachment(buffer, contentType)
    return url
}