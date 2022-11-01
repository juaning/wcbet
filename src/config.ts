export const cup2022API = process.env.GATSBY_MAIN_API || process.env.MAIN_API;

export const cup2022Options: RequestInit = {
    headers: {
        mode: 'cors',
        'Content-Type': 'application/json',
    }
};

export enum cup2022APIStatusResponseEnum {
    SUCCESS = 'success',
    ERROR = 'error',
};

export enum TeamBetTypeEnum {
    CHAMPION,
    THIRD_PLACE,
    SEMIFINAL,
    QUARTERFINAL,
    ROUND_OF_16,
    GROUP_WINNER,
    GROUP_SECOND,
};

export enum MatchTimeElapsedEnum {
    NOT_STARTED = 'notstarted',
    FIRST_HALF = 'h1',
    HALF_TIME = 'hf',
    SECOND_HALF = 'h2',
    FINISHED = 'finished'
};

export const qatarDateTimeFormat = 'MM/dd/yyyy HH:mm';
export const qatarDateTimeZone = { zone: 'Asia/Qatar' };
export const localTimeFormat = 'HH:mm';
export const localDateFormat = 'dd/MM/yyyy';