import makeRequest from "../../makeRequest";
import { createType } from "../../../types/createType";
import createCreateBody from "./createCreateBody";
import createCookie from "../../create-cookie";
import { responseCreationType } from "../../../types/responseCreationType";


export default async function requestCreation(payload: createType) {
    const body = createCreateBody(payload);
    const cookie = await createCookie();

    if (!cookie) return;

    const Request = await makeRequest({
        url: process.env.ALEXYA_API_URL + "/generate-picture",
        body: body,
        headers: {
            cookie: cookie
        },
        method: "POST"
    })

    return Request as responseCreationType
}