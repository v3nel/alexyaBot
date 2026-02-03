
interface makeRequestPayload {
    url: string;
    headers: Record<string, string>;
    body?: Buffer<ArrayBuffer> | string;
    method: "GET" | "POST" | "PATCH"
}

const baseHeaders = {
    "user-agent" : "Mozilla/5.0 (X11; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0",
    "referrer": "https://alexya.ai/generate-picture-new",
    "origin": "https://alexya.ai",
    "accept": "*/*"
}

export default async function makeRequest(payload: makeRequestPayload) {
    const headers = { ...baseHeaders, ...payload.headers };

    try {
        const Request = await fetch(payload.url, {
            method: payload.method,
            headers: headers,
            body: payload.body
        });
        
        const Response = await Request.json()

        return Response
    } catch(e) {
        console.error(e)
    }
}