import * as snowId from 'simple-flakeid';

/**
 * 雪花算法，id 生成器，15为数字
 * example: 574829628072019
 * workerId: 不同机器最好设置不同之，否则存在一定概率重复（重复率很小）
 * */
const gen = new snowId.SnowflakeIdv1({ workerId: 1 });
export const genSnowUUId = () => gen.NextId();
