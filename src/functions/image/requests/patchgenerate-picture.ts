import { createType } from "../../../types/createType";
import createCookie from "../../create-cookie";
import makeRequest from "../../makeRequest";

export type patchGenerationPictureType = {
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
        prompt: string,
        task_id: string
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

export async function patchGeneratePicture(payload: createType) {
    const cookie = await createCookie()
    if (!cookie) return;

    const body = {
        id: payload.id,
        updates: {
            settings: {
                mode: payload.type,
                width: payload.width,
                height: payload.height,
                images: payload.references ? payload.references : [],
                prompt: payload.prompt,
                task_id: payload.task_id
            }
        }
    }

    const data = await makeRequest({
        method: "PATCH",
        url: process.env.ALEXYA_API_URL + "/generate-picture",
        headers: { 
            'cookie': cookie
        },
        body: JSON.stringify(body)
    }) as patchGenerationPictureType

    if (data.error) return false;

    return true
    
}