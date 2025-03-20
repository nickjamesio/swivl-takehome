type OkResult<T> = { ok: true; value: T };
type FailResult = { ok: false; error: Error };
type ResultType<T> = OkResult<T> | FailResult;

class Result {
  static ok<T>(value: T): OkResult<T> {
    return { ok: true, value };
  }

  static fail(error: unknown): FailResult {
    if (error instanceof Error) {
      return { ok: false, error };
    }
    if (typeof error === 'string') {
      return { ok: false, error: new Error(error) };
    }

    return { ok: false, error: new Error('Something went wrong') };
  }

  static safe<Return = any>(func: () => Return): ResultType<Return> {
    try {
      const result = func();
      return Result.ok(result);
    } catch (err) {
      return Result.fail(err);
    }
  }

  static async safeAsync<Return = any>(
    func: () => Promise<Return>,
  ): Promise<ResultType<Return>> {
    try {
      const result = await func();
      return Result.ok(result);
    } catch (err) {
      return Result.fail(err);
    }
  }
}

export { Result };
export type { ResultType, OkResult, FailResult };
