export const cup2022API = 'http://api.cup2022.ir/api/v1';

const cup2022Token = process.env.GATSBY_CUP2022_TOKEN || process.env.CUP2022_TOKEN;
export const cup2022Options = {
    headers: {
        Authorization: `Bearer ${cup2022Token}`,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
};

export enum cup2022APIStatusResponseEnum {
    SUCCESS = 'success',
    ERROR = 'error',
};