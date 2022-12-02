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
  const endOf1stRound = transformDateTimeToLocal('11/25/2022 13:00');
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
    FINAL,
};

export enum MatchTypeEnum {
  GROUP = 'group',
  ROUND_OF_16 = 'R16',
  QUARTERFINAL = 'QR',
  THIRD_PLACE = '3RD',
  SEMIFINAL = 'semi',
  FINAL = 'FIN',
  CHAMPION = 'CHAMPION',
}

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
export type IPoints = {
  [key in MatchTypeEnum]: {
    winOrDraw: number;
    result: number;
    advances?: number;
    advancesAsSecond?: number;
  };
}
export const points: IPoints = {
  [MatchTypeEnum.GROUP]: {
    winOrDraw: 10,
    result: 20,
    advances: 60,
    advancesAsSecond: 40,
  },
  [MatchTypeEnum.ROUND_OF_16]: {
    winOrDraw: 60,
    result: 100,
    advances: 100,
  },
  [MatchTypeEnum.QUARTERFINAL]: {
    winOrDraw: 100,
    result: 150,
    advances: 140,
  },
  [MatchTypeEnum.SEMIFINAL]: {
    winOrDraw: 140,
    result: 200,
    advances: 180,
  },
  [MatchTypeEnum.THIRD_PLACE]: {
    winOrDraw: 140,
    result: 200,
    advances: 180,
  },
  [MatchTypeEnum.FINAL]: {
    winOrDraw: 200,
    result: 250,
    advances: 250,
  },
  [MatchTypeEnum.CHAMPION]: {
    winOrDraw: 0,
    result: 270,
  },
};

export type TGroups = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H';
export type TLastMatchDTPerGroup = {
  [key in TGroups]: string;
}

export const lastMatchDateTimePerGroup: TLastMatchDTPerGroup = {
  A: '11/29/2022 20:10',
  B: '11/30/2022 00:10',
  C: '12/1/2022 00:10',
  D: '11/30/2022 20:10',
  E: '12/2/2022 00:10',
  F: '12/1/2022 20:10',
  G: '12/3/2022 00:10',
  H: '12/2/2022 20:10',
};

export const fifaFlag = 'https://upload.wikimedia.org/wikipedia/commons/1/10/Flag_of_FIFA.svg';
