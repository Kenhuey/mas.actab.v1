import FileStream from "fs";

/**
 * The `createDirectory` function provides to create a directory
 * @param `path` - Directory path
 * @return `Promise` Only return error object
 */
export function createDirectory(path: string): Promise<unknown | undefined> {
  return new Promise<void>(
    (
      // eslint-disable-next-line no-unused-vars
      resolve: (value: void | PromiseLike<void>) => void,
      // eslint-disable-next-line no-unused-vars
      reject: (reason?: any) => void
    ) => {
      try {
        FileStream.accessSync(path, FileStream.constants.F_OK);
      } catch (accessError: unknown) {
        try {
          FileStream.mkdirSync(path);
          resolve();
        } catch (mkdirError: unknown) {
          reject(mkdirError);
        }
      }
    }
  );
}
