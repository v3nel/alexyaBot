import fetch from "node-fetch";

interface makeRequestPayload {
    url: string;
    headers: Record<string, string>;
    body: Array<string> | Buffer<ArrayBuffer>;
    method: "GET" | "POST" | "PATCH"
}

const baseHeaders = {
    "user-agent" : "Mozilla/5.0 (X11; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0",
    "referrer": "https://alexya.ai/generate-picture-new",
    "accept": "*/*"
}

export default async function makeRequest(payload: makeRequestPayload) {
    const headers = { ...baseHeaders, ...payload.headers };

    try {
        const Request = await fetch(payload.url, {
            method: payload.method,
            headers: headers,
            body: JSON.stringify(payload.body)
        });

        const Response = await Request.json()

        return Response
    } catch(e) {
        console.error(e)
    }
}