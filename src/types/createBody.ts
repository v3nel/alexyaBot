export type createBodyType = {
    title: "Edit" | "Create",
    prompt: string,
    input_image_url: string | null,
    settings: {
        prompt: string,
        width: number,
        height: number,
        images: string[] | [],
        mode: "classic" | "high-quality"
    }
}