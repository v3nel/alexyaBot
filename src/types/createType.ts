export type createType = {
    prompt: string,
    references?: string[],
    type: "classic" | "high-quality",
    height: number,
    width: number,
    id?: string,
    task_id?: string,
}