import dayjs from 'dayjs';

export const getNowSecondsTime = () => Math.floor(new Date().valueOf() / 1000);

export const getNowMSTime = () => new Date().valueOf();

export const getIOSTime = () => new Date().toISOString();

export const getFutureDay = (d: number) => dayjs().add(d, 'd').toISOString();
