export type responseCreationType = {
    id: string,
    user_id: string,
    type: string,
    title: "Create" | "Edit",
    status: string,
    input_image_url: string | null,
    output_url: string | null,
    thumbnail_url: string | null,
    settings: {
        mode: "classic" | "high-quality",
        width: number,
        height: number,
        images: [] | string[],
        prompt: string
    },
    credit_used: number,
    created_at: string,
    completed_at: string | null,
    retry_count: number,
    processing_by: string | null,
    trend_id: string | null,
    prompt: string
}