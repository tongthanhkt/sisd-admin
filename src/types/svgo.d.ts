declare module 'svgo' {
    export function optimize(svgString: string, config?: any): { data: string };
} 