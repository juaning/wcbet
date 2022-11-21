import { DateTime } from 'luxon';

export const transformDateTimeToLocal = (datetime: string) =>
  DateTime.fromFormat(
    datetime,
    qatarDateTimeFormat,
    qatarDateTimeZone,
  ).toLocal();

export const hasWCStarted = (): boolean => {
  const now = DateTime.now().toLocal();
  return now >= wcStartDateTime;
}

export const canBetChamNGroups = (): boolean => {
  const now = DateTime.now().toLocal();
  const endOf1stRound = transformDateTimeToLocal('11/25/2022 15:00');
  return now >= endOf1stRound;
}

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

export const qatarDateTimeFormat = 'MM/d/yyyy HH:mm';
export const qatarDateTimeZone = { zone: 'Asia/Qatar' };
export const localTimeFormat = 'HH:mm';
export const localDateFormat = 'dd/MM/yyyy';
export const wcStartDateTime = transformDateTimeToLocal('11/20/2022 19:00');