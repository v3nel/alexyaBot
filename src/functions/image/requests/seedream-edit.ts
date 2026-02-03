import { createType } from "../../../types/createType";
import createCookie from "../../create-cookie";
import makeRequest from "../../makeRequest";

export type seedreamEditType = {
    data: {
        id: string
    },
    request_id: string,
    task_id: string,
    error?: string
}

export async function seedreamEdit(payload: createType) {
    const cookie = await createCookie();
    if (!cookie) return;

    const body = {
        prompt: payload.prompt,
        width: payload.width,
        height: payload.height,
        enable_sync_mode: false,
        enable_base64_output: false,
        images: payload.references
    };

    const data = await makeRequest({
        method: "POST",
        url: process.env.ALEXYA_API_URL + "/seedream-edit",
        headers: {
            'cookie': cookie
        },
        body: JSON.stringify({body})
    }) as seedreamEditType

    if (data.error) return;

    return data.task_id
}