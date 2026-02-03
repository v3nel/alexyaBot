import { createType } from "../../types/createType.js";
import { patchGeneratePicture } from "./requests/patchgenerate-picture.js";
import { pollImageCreation } from "./requests/poll-image-creation.js";
import { postGeneratePicture } from "./requests/postgenerate-picture.js";
import { seedreamCreate } from "./requests/seedream-create.js";
import { seedreamEdit } from "./requests/seedream-edit.js";

export async function createImage(payload: createType) {
    const id = await postGeneratePicture(payload);

    let task_id
    if (payload.references) {
        task_id = await seedreamEdit(payload)
    } else {
        task_id = await seedreamCreate(payload)
    }

    payload.id = id;
    payload.task_id = task_id;

    const creationSuccess = await patchGeneratePicture(payload);

    if (!creationSuccess) {
        return
    }

    const imageUrl = await pollImageCreation(payload)
    return imageUrl
}