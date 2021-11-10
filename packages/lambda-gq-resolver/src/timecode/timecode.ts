/* eslint-disable import/prefer-default-export */
const msInASecond = 1000;
const msInAMinute = msInASecond * 60;
const msInAnHour = msInAMinute * 60;

/* eslint-disable no-useless-constructor */
export class Timecode {
  constructor(private timestamp: string = '00:00:00:00') {}

  static FromMillisecondsAndFps(ms: number, fps: number): Timecode {
    const remMs = ms % 1000;
    const msMinusFrames = ms - remMs;
    const toDate = new Date(msMinusFrames);
    const ff = Math.round(remMs / (1000 / fps));
    const ss = toDate.getUTCSeconds();
    const mm = toDate.getUTCMinutes();
    const hh = toDate.getUTCHours();
    const timestamp = [hh, mm, ss, ff].map((unit) => `${unit}`.padStart(2, '0')).join(':');

    return new Timecode(timestamp);
  }

  getAsMilliseconds(fps: number): number {
    const [hh, mm, ss, ff] = this.timestamp.split(':').map((s) => +s);
    return hh * msInAnHour + mm * msInAMinute + ss * msInASecond + (1000 / fps) * ff;
  }

  add(timecode: Timecode, fps: number): Timecode {
    const myMs = this.getAsMilliseconds(fps);
    const recievedMs = timecode.getAsMilliseconds(fps);
    return Timecode.FromMillisecondsAndFps(myMs + recievedMs, fps);
  }

  toString(): string {
    return this.timestamp;
  }
}
