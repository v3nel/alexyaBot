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
        taskId: payload.task_id,
        generationId: payload.id
    };

    console.log(`Polling image creation with taskId: ${payload.task_id}, generationId: ${payload.id}`);
    console.log(`URL: ${process.env.ALEXYA_API_URL}/poll-image-generation`);
    console.log(`Body:`, JSON.stringify(body, null, 2));

    const data = await makeRequest({
        method: 'POST',
        url: process.env.ALEXYA_API_URL + "/poll-image-generation",
        headers: {
            'cookie': cookie,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }) as pollImageCreationType

    if (data.error) {
        console.error('Erreur dans pollImageCreation:', data.error);
        return;
    }

    return data.outputUrl
} 