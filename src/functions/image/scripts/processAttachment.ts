import downloadAttachment from "./downloadAttachment";
import uploadAttachment from "./uploadAttachment";

export async function processAttachment(attachment: string) {
    const buffer = await downloadAttachment(attachment); 
    const url = await uploadAttachment(buffer)
    return url
}