import { createBodyType } from "../../types/createBody";
import { createType } from "../../types/createType";

export default function createCreateBody(payload: createType) {
    return {
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
    } as createBodyType
}