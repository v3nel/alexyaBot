import createCookie from "../create-cookie.js";
import makeRequest from "../makeRequest.js";

type uploadResponseType = {
    success: boolean,
    imageUrl?: string,
    generationId?: string,
    error?: string
}

type uploadAttachmentType = {
    success?: boolean,
    imageUrl?: string,
    url?: string,
    generationId?: string,
    error?: string 
}

export default async function uploadAttachment(buffer: Buffer<ArrayBuffer>, contentType?: string): Promise<string | undefined> {
    try {
        const Cookie = await createCookie();
        if (!Cookie) return;

        // Détecter le type MIME et l'extension du fichier
        const mimeType = contentType || 'image/jpeg';
        let extension = 'jpg';
        if (mimeType.includes('png')) extension = 'png';
        else if (mimeType.includes('webp')) extension = 'webp';
        else if (mimeType.includes('jpeg') || mimeType.includes('jpg')) extension = 'jpg';

        // Créer un FormData pour l'upload d'image
        const formData = new FormData();
        const blob = new Blob([buffer], { type: mimeType });
        // Essayer avec 'image' au lieu de 'file'
        formData.append('image', blob, `image.${extension}`);

        console.log(`Uploading image with MIME type: ${mimeType}, extension: ${extension}`);
        console.log(`Upload URL: ${process.env.ALEXYA_API_URL}/seedream-edit/upload`);

        // Utiliser fetch directement pour FormData (ne pas passer par makeRequest)
        const response = await fetch(process.env.ALEXYA_API_URL + "/seedream-edit/upload", {
            method: "POST",
            headers: {
                "Cookie": Cookie,
                // Ne pas définir Content-Type manuellement, fetch le fait automatiquement pour FormData
            },
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Upload failed: ${response.status} - ${errorText}`);
            throw new Error(`HTTP Error ${response.status}: ${errorText}`);
        }

        const Request = await response.json() as uploadAttachmentType;

        console.log('📦 Réponse du serveur:', JSON.stringify(Request, null, 2));

        if (Request.error || Request.success === false) {
            throw new Error(Request.error || 'Upload failed')
        }

        // Le serveur retourne l'URL dans le champ 'imageUrl'
        const uploadedUrl = Request.imageUrl;
        
        if (!uploadedUrl) {
            console.error('❌ Aucune URL trouvée dans la réponse. Réponse complète:', Request);
            throw new Error('Aucune URL retournée par le serveur');
        }

        console.log('✅ Image uploadée avec succès:', uploadedUrl);
        return uploadedUrl

    } catch(e) {
        console.error(`Il y a eu une erreur lors de l'upload de l'image vers les serveurs d'Alexya.ai ${e}`)
        return
    }

}