import fetch, {Blob, FormData} from "node-fetch";
import createCookie from "../../create-cookie";
import makeRequest from "../../makeRequest";

type uploadResponseType = {
    success: boolean,
    imageUrl?: string,
    generationId?: string,
    error?: string
}

type uploadAttachmentType = {
    success?: boolean,
    url?: string,
    generationId?: string,
    error?: string 
}

export default async function uploadAttachment(buffer: Buffer<ArrayBuffer>): Promise<string | undefined> {
    try {
        const Cookie = await createCookie();
        if (!Cookie) return;

        const Request = await makeRequest({
            method: "POST",
            url: process.env.ALEXYA_API_URL + "/seedream-edit/upload",
            headers: {
                "Cookie": Cookie
            },
            body: buffer
        }) as uploadAttachmentType

        if (Request.error || Request.success === false) {
            throw new Error(Request.error)
        }

        return Request.url

    } catch(e) {
        console.error(`Il y a eu une erreur lors de l'upload de l'image vers les serveurs d'Alexya.ai ${e}`)
        return
    }

}