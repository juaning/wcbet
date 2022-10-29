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
  }