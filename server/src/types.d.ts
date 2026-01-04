declare module 'robots-parser' {
    interface Robot {
        isAllowed(url: string, ua?: string): boolean;
        isDisallowed(url: string, ua?: string): boolean;
        getMatchingLineNumber(url: string, ua?: string): number;
        getCrawlDelay(ua?: string): number;
        getSitemaps(): string[];
        getPreferredHost(): string;
    }

    function robotsParser(url: string, contents: string): Robot;
    export = robotsParser;
}
