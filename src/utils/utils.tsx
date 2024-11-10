export async function sleep(time: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
}
export function getStatusMessage(startTime: number, endTime: number, nowTime: number): string {
    // const now = new Date().getTime();
    // const start = new Date(startTime).getTime();
    // const end = new Date(endTime).getTime();
    if (nowTime < startTime) {
        // Before the start time
        const minutesUntilStart = Math.ceil((startTime - nowTime) / (60));
        return minutesUntilStart <= 5
            ? `${minutesUntilStart} mins left for start`
            : `Bet will start in ${minutesUntilStart} mins`;
    } else if (nowTime >= startTime && nowTime < endTime) {
        // During the betting period
        const minutesUntilEnd = Math.ceil((endTime - nowTime) / (60));
        return minutesUntilEnd <= 5
            ? `Bet ends in ${minutesUntilEnd} mins`
            : `Bet available for ${minutesUntilEnd} mins`;
    } else {
        // After the end time
        const minutesSinceEnd = Math.ceil((nowTime - endTime) / (60));
        return minutesSinceEnd <= 5
            ? `Ended ${minutesSinceEnd} mins ago`
            : `Betting period has ended`;
    }
}

export function getlotState(startTime: number, endTime: number, nowTime: number): number {

    // const now = new Date().getTime();
    // const start = new Date(startTime).getTime();
    // const end = new Date(endTime).getTime();
    if (nowTime < startTime) {
        return -1;
    } else if (nowTime >= startTime && nowTime < endTime) {
        return 0;
    } else {
        return 1;
    }
}