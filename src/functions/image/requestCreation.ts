import makeRequest from "../makeRequest.js";
import { createType } from "../../types/createType.js";
import createCreateBody from "./createCreateBody.js";
import createCookie from "../create-cookie.js";
import { responseCreationType } from "../../types/responseCreationType.js";


export default async function requestCreation(payload: createType) {
    const body = createCreateBody(payload);
    const cookie = await createCookie();

    if (!cookie) return;

    const Request = await makeRequest({
        url: process.env.ALEXYA_API_URL + "/generate-picture",
        body: JSON.stringify(body),
        headers: {
            cookie: cookie
        },
        method: "POST"
    })

    return Request as responseCreationType
}