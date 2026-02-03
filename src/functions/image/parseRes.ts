export function parseRes(resolution: string) {
    const parts = resolution.split('x');
    const width = parseInt(parts[0], 10);
    const height = parseInt(parts[1], 10);
    return { width, height };
}