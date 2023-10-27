export function toDate(str: string): Date {
  const m: string[] = str.split(/\D/);
  return new Date(+m[0], +m[1] - 1, +m[2], +m[3], +m[4], +m[5]);
}

export function isToday(str: string) {
  const givenDate: Date = toDate(str);
  const curDate: Date = new Date(Date.now());

  if (givenDate.getFullYear() !== curDate.getFullYear()) {
    return false;
  }

  if (givenDate.getMonth() !== curDate.getMonth()) {
    return false;
  }

  if (givenDate.getDate() !== curDate.getDate()) {
    return false;
  }

  return true;
}

export function getFormattedTime(str: string) {
  const date = toDate(str);

  const H: number = date.getHours();
  const amPm: string = `${H < 12 ? '오전' : '오후'}`;
  const M: number = date.getMinutes();
  return ` ${amPm} ${
    (H % 12 == 0 ? '12' : H % 12 < 10 ? '0' : '') + (H % 12 == 0 ? '' : H % 12)
  }:${(M < 10 ? '0' : '') + M}`;
}

export function getFormattedDate(str: string) {
  const date = toDate(str);

  const M: number = date.getMonth() + 1;

  return `${date.getFullYear()}-${
    Math.floor(M / 10) == 1 ? '' : '0'
  }${M}-${date.getDate()}`;
}

export function getFormattedDateTime(str: string) {
  return `${getFormattedDate(str)} ${getFormattedTime(str)}`;
}

export function getFormattedISODateTime(date: Date) {
  return `${date.getFullYear()}-${paddingZeroOrEmpty(date.getMonth()+ 1)}${date.getMonth() + 1}-${paddingZeroOrEmpty(date.getDate())}${date.getDate()}T${paddingZeroOrEmpty(date.getHours())}${date.getHours()}:${paddingZeroOrEmpty(date.getMinutes())}${date.getMinutes()}:00`
}

function paddingZeroOrEmpty(obj: any) {
  return Math.floor(obj / 10) > 0 ? '' : '0'
}