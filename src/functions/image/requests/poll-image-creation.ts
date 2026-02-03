import { createType } from "../../../types/createType";
import createCookie from "../../create-cookie";
import makeRequest from "../../makeRequest";

export type pollImageCreationType = {
    success: boolean,
    status: string,
    outputUrl: string,
    thumbnailUrl: string,
    error?: string
}

export async function pollImageCreation(payload: createType) {
    const cookie = await createCookie();
    if (!cookie) return;

    const body = {
        generationId: payload.id,
    };

    const data = await makeRequest({
        method: 'POST',
        url: process.env.ALEXYA_API_URL + "/poll-image-creation",
        headers: {
            'cookie': cookie
        },
        body: JSON.stringify(body)
    }) as pollImageCreationType

    if (data.error) return;

    return data.outputUrl
} 