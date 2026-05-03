import pRetry from "p-retry";

export async function withRetry(operation, options = {}) {
  const retries = options.retries ?? 3;

  return pRetry(operation, {
    retries,
    onFailedAttempt: (error) => {
      console.log(
        `Attempt ${error.attemptNumber} failed. Retries left: ${error.retriesLeft}`
      );
    },
  });
}