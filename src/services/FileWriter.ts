import * as fs from 'fs';
import { Logger } from 'pino';

export class FileWriter {
  constructor(private readonly logger: Logger) {}

  public writeJsonToFile(json: any, path: string): void {
    this.logger.trace(`${FileWriter.name}::writeJsonToFile`);

    fs.writeFileSync(path, JSON.stringify(json, null, 2));
  }
}
