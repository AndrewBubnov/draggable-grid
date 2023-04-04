import { AUTO } from '../constants';

export const getComputedParam = (param: string) => (param === AUTO ? 1 : +param.split(' ')[1]);
