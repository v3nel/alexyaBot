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

    console.log('📤 seedreamEdit body:', JSON.stringify(body, null, 2));

    const data = await makeRequest({
        method: "POST",
        url: process.env.ALEXYA_API_URL + "/seedream-edit",
        headers: {
            'cookie': cookie,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }) as seedreamEditType

    console.log('📦 seedreamEdit réponse:', JSON.stringify(data, null, 2));
    console.log('🔑 data.task_id:', data.task_id);
    console.log('🔑 data.data?.id:', data.data?.id);

    if (data.error) {
        console.error('❌ Erreur dans seedreamEdit:', data.error);
        return;
    }

    const taskId = data.task_id || (data as any).taskId || data.data?.id;
    console.log('✅ Task ID retourné:', taskId);
    
    return taskId
}