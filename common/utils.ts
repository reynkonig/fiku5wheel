export const timeoutPromise = (prom: Promise<any>, time: number) => {
  let timer: any;
  return Promise.race([
    prom,
    new Promise((_r, rej) => timer = setTimeout(rej, time))
  ]).finally(() => clearTimeout(timer));
}
