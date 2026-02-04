
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
        
        // Vérifier si la réponse est OK
        if (!Request.ok) {
            const errorText = await Request.text();
            // Tronquer le message d'erreur pour éviter les débordements
            const truncatedError = errorText.length > 200 
                ? errorText.substring(0, 200) + '...'
                : errorText;
            throw new Error(`HTTP Error ${Request.status}: ${truncatedError}`);
        }

        // Vérifier le type de contenu avant de parser
        const contentType = Request.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const responseText = await Request.text();
            throw new Error(`Expected JSON but got ${contentType}: ${responseText}`);
        }
        
        const Response = await Request.json()

        return Response
    } catch(e) {
        console.error('Erreur dans makeRequest:', e)
        throw e; // Relancer l'erreur pour que l'appelant puisse la gérer
    }
}