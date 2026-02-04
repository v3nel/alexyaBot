import { createType } from "../../../types/createType";
import createCookie from "../../create-cookie";
import makeRequest from "../../makeRequest";

export type postGeneratePictureResponseType = {
    id: string,
    user_id: string,
    type: string,
    title: string,
    status: string,
    input_image_url?: string,
    output_url?: string,
    thumbnail_url?: string,
    settings: {
        mode: string,
        width: number,
        height: number,
        images: string[],
        prompt: string
    },
    credits_used: number,
    created_at: string,
    completed_at?: string,
    retry_count: number,
    processing_by?: string,
    trend_id?: string,
    prompt: string,
    error?: string
}

export async function postGeneratePicture(payload: createType) {
    const cookie = await createCookie();
    if (!cookie) return;

    const body = {
        title: payload.references ? "Edit" : "Create",
        prompt: payload.prompt,
        input_image_url: payload.references ? payload.references[0] : null,
        settings: {
            prompt: payload.prompt,
            width: payload.width,
            height: payload.height,
            images: payload.references ? payload.references : [],
            mode: payload.type
        }
    }
    const data = await makeRequest({
        method: "POST",
        url: process.env.ALEXYA_API_URL + "/generate-picture",
        headers: {
            'cookie': cookie,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }) as postGeneratePictureResponseType

    if (data.error) return;

    return data.id

}