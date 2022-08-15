interface PollerOptions {
  fn: Function;
  validate: Function;
  interval: number;
  maxAttempts: number;
}

export async function poller({
  fn,
  validate,
  interval,
  maxAttempts,
}: PollerOptions): Promise<any> {
  let attempts = 0;

  const executePoll = async (resolve: any, reject: any) => {
    const result = await fn();
    attempts++;

    if (validate(result)) {
      return resolve(result);
    } else if (attempts === maxAttempts) {
      return reject(new Error("Exceeded max attempts"));
    } else {
      setTimeout(executePoll, interval, resolve, reject);
    }
  };

  return new Promise(executePoll);
}
