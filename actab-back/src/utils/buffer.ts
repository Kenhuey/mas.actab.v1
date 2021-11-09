import { Type } from "./index";

/**
 * The `BufferReader` module provides an implementation of C/C++ style data struct buffer convert
 */
export class BufferReader {
  /**
   * Buffer instance
   */
  private buffer: Buffer;

  /**
   * Buffer instance getter
   * @return `buffer: Buffer` - C/C++ style data struct buffer
   */
  public get Buffer(): Buffer {
    return this.buffer;
  }

  /**
   * Buffer offset
   */
  private offset: number = 0;

  /**
   * Buffer offset getter
   * @return `offset: number` - Currerent offset
   */
  public get Offset(): number {
    return this.offset;
  }

  /**
   * `BufferReader` constructor
   * @param `data: Buffer` - C/C++ style data struct buffer.
   */
  public constructor(data: Buffer) {
    this.buffer = data;
  }

  /**
   * Reset buffer offset to 0
   * @return `this` Current instance
   */
  public resetOffset(): this {
    this.offset = 0;
    return this;
  }

  /**
   * Add current offset
   * @param `length: number` - Offset length
   * @return `this` Current instance
   */
  private addOffset(length: number): this {
    this.offset += length;
    return this;
  }

  /**
   * Read 8 bit unsigned integer
   * @return `number` - 8 bit unsigned integer
   */
  public nextUInt8(): number {
    const size: number = 1;
    const result: number = this.buffer.readUInt8(this.offset);
    this.addOffset(size);
    return result;
  }

  /**
   * Read next 16 bit little-endian unsigned integer.
   * @return `number` - 16 bit little-endian unsigned integer.
   */
  public nextUInt16LE(): number {
    const size: number = 2;
    const result: number = this.buffer.readInt16LE(this.offset);
    this.addOffset(size);
    return result;
  }

  /**
   * Read next 32 bit little-endian unsigned integer
   * @return `number` - 32 bit little-endian unsigned integer
   */
  public nextUInt32LE(): number {
    const size: number = 4;
    const result: number = this.buffer.readInt32LE(this.offset);
    this.addOffset(size);
    return result;
  }

  /**
   * Read next string
   * @return `string` - utf8
   */
  public nextString(): string {
    const length: number = this.nextUInt8();
    const result: string = this.buffer
      .slice(this.offset, this.offset + length)
      .toString("utf8");
    this.addOffset(length);
    return result;
  }

  /**
   * Read next string
   * @return `string` - utf16le
   */
  public nextStringW(): string {
    const length: number = this.nextUInt8() * 4;
    const result: string = this.buffer
      .slice(this.offset, this.offset + length)
      .toString("utf16le");
    this.addOffset(length);
    return result.replace(/\u0000/gi, "");
  }

  /**
   * Read next little-endian float
   * @return `number` - little-endian float
   */
  public nextFloatLE(): number {
    const size: number = 4;
    const result: number = this.buffer.readFloatLE(this.offset);
    this.addOffset(size);
    return result;
  }
}

/**
 * The `BufferCreater` module provides an implementation of creating C/C++ style data struct buffer
 */
export class BufferCreater {
  /**
   * Buffer current offset
   */
  private offset: number = 0;

  /**
   * Buffer offset getter
   * @return `offset: number` - Currerent offset
   */
  public get Offset(): number {
    return this.offset;
  }

  /**
   * Buffer instance
   */
  private buffer: Buffer;

  /**
   * Buffer instance getter
   * @return `Buffer` Current buffer
   */
  public get get(): Buffer {
    return this.buffer;
  }

  /**
   * `BufferCreater` constructor
   */
  public constructor() {
    this.buffer = Buffer.alloc(0);
  }

  /**
   * Add current offset
   * @param `length: number` - Offset length
   * @return `this` Current instance
   */
  private addOffset(length: number): this {
    this.offset += length;
    return this;
  }

  /**
   * Reset offset and clear appended buffer
   * @return `this` Current instance
   */
  public clear(): this {
    this.buffer = Buffer.alloc(0, 0x0);
    this.offset = 0;
    return this;
  }

  /**
   * Append 8 bit unsigned integer
   * @param `value` - Value to append
   * @return `this` Current instance
   */
  public appendUInt8(value: number): this {
    if (!Type.isUInt8(value)) {
      throw new Error(`"${value}" is not a 8 bit unsigned integer number.`);
    }
    const size: number = 1;
    const legecyBuffer: Buffer = this.get;
    this.buffer = Buffer.alloc(this.buffer.length + size);
    legecyBuffer.copy(this.buffer, 0);
    this.get.writeUInt8(value, this.offset);
    this.addOffset(size);
    return this;
  }

  /**
   * Append 16 bit little-endian unsigned integer
   * @param `value` - Value to append
   * @return `this` Current instance
   */
  public appendUInt16LE(value: number): this {
    if (!Type.isUInt16(value)) {
      throw new Error(`"${value}" is not a 16 bit unsigned integer number.`);
    }
    const size: number = 2;
    const legecyBuffer: Buffer = this.get;
    this.buffer = Buffer.alloc(this.buffer.length + size);
    legecyBuffer.copy(this.buffer, 0);
    this.get.writeUInt16LE(value, this.offset);
    this.addOffset(size);
    return this;
  }

  /**
   * Append 32 bit little-endian unsigned integer
   * @param `value` - Value to append
   * @return `this` Current instance
   */
  public appendUInt32LE(value: number): this {
    if (!Type.isUInt32(value)) {
      throw new Error(`"${value}" is not a 32 bit unsigned integer number.`);
    }
    const size: number = 4;
    const legecyBuffer: Buffer = this.get;
    this.buffer = Buffer.alloc(this.buffer.length + size);
    legecyBuffer.copy(this.buffer, 0);
    this.get.writeUInt32LE(value, this.offset);
    this.addOffset(size);
    return this;
  }

  /**
   * Append string
   * @param `value` - Value to append
   * @return `this` Current instance
   */
  public appendString(value: string): this {
    const converValue: () => Buffer = () => {
      value.substr(0, 255);
      const converted: string = `${value.split("").join("\u0000")}\u0000`;
      const buffer: Buffer = Buffer.alloc(value.length + 1, 0x0);
      buffer.writeUInt8(value.length, 0);
      buffer.write(converted, 1, "utf8");
      return buffer;
    };
    const resultValue: Buffer = converValue();
    const legecyBuffer: Buffer = this.get;
    this.buffer = Buffer.alloc(this.buffer.length + resultValue.length);
    legecyBuffer.copy(this.buffer, 0);
    resultValue.copy(this.buffer, this.offset);
    this.addOffset(resultValue.length);
    return this;
  }

  /**
   * Append wide string
   * @param `value` - Value to append
   * @return `this` Current instance
   */
  public appendStringW(value: string): this {
    const converValue: () => Buffer = () => {
      value.substr(0, 255);
      const converted: string = `${value.split("").join("\u0000")}\u0000`;
      const buffer: Buffer = Buffer.alloc(value.length * 4 + 1, 0x0);
      buffer.writeUInt8(value.length, 0);
      buffer.write(converted, 1, "utf16le");
      return buffer;
    };
    const resultValue: Buffer = converValue();
    const legecyBuffer: Buffer = this.get;
    this.buffer = Buffer.alloc(this.buffer.length + resultValue.length);
    legecyBuffer.copy(this.buffer, 0);
    resultValue.copy(this.buffer, this.offset);
    this.addOffset(resultValue.length);
    return this;
  }

  /**
   * Append little-endian float
   * @param `value` - Value to append
   * @return `this` Current instance
   */
  public appendFloatLE(value: number): this {
    const size: number = 4;
    const legecyBuffer: Buffer = this.get;
    this.buffer = Buffer.alloc(this.buffer.length + size);
    legecyBuffer.copy(this.buffer, 0);
    this.buffer.writeFloatLE(value, this.offset);
    this.addOffset(size);
    return this;
  }

  /**
   * Append raw string
   * @param `value` - Value to append
   * @return `this` Current instance
   */
  public appendStringRaw(value: string): this {
    const buffer: Buffer = Buffer.alloc(value.length, 0x0);
    buffer.write(value, 0);
    const legecyBuffer: Buffer = this.get;
    this.buffer = Buffer.alloc(this.buffer.length + buffer.length);
    legecyBuffer.copy(this.buffer, 0);
    buffer.copy(this.buffer, this.offset);
    this.addOffset(buffer.length);
    return this;
  }
}
