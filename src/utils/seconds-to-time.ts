import { zeroLeft } from './zero-left';

export function secondsToTime(seconds: number) {
  const hours = zeroLeft(seconds / 3600);
  const min = zeroLeft((seconds / 60) % 60);
  const sec = zeroLeft((seconds % 60) % 60);
  return `${hours}:${min}:${sec}`;
}
