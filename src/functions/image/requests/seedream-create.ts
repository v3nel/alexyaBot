import { createType } from "../../../types/createType";
import createCookie from "../../create-cookie";
import makeRequest from "../../makeRequest";

export type seedreamCreateType = {
    code: number,
    message: string,
    data: {
        id: string,
        model: string,
        ouputs: [],
        urls: {
            get: string,
        },
        has_nsfw_contents: any,
        status: string,
        created_at: string,
        error?: string,
        executionTime: number,
        timings: {
            inference: number
        }
    },
    error?:string
}

export async function seedreamCreate(payload: createType) {
    const cookie = await createCookie();
    if(!cookie) return;

    const body = {
        prompt: payload.prompt,
        width: payload.width,
        height: payload.height,
        enable_sync_mode: false,
        enable_base64_output: false,
    };

    const data = await makeRequest({
        method: "POST",
        url: process.env.ALEXYA_API_URL + "/seedream-create",
        headers: {
            "cookie": cookie,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }) as seedreamCreateType;

    if (data.error && data.data.error !== "") return;
    else return data.data.id;
}