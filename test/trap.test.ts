import { describe, it } from 'mocha';
import { expect } from "chai";
import { trap as subscriptable } from '../';

class _MyData<T> {
  private _data: T[] = [];
  private _name: string;

  constructor(name: string) {
    this._name = name;
  }

  get name() {
    return this._name;
  }

  push(...values: T[]): void {
    this._data.push(...values);
  }
}

describe('trap', () => {
  const MyData = subscriptable(_MyData, '_data');

  it('should return d.name', () => {
    const d = new MyData<number>('data proxied');
    expect(d.name).to.equal('data proxied');
  });

  it('should return undefined', () => {
    const d = new MyData<number>('data proxied');
    expect(d[0]).to.equal(undefined);
  });

  it('should be subscriptable', () => {
    const d = new MyData<number>('data proxied');
    d.push(0, 1, 2);

    expect(d[0]).to.equal(0);
    expect(d[1]).to.equal(1);
    expect(d[2]).to.equal(2);
  });

});

class _MyData2<T> {
  private _data: T[] = [];

  get data() {
    return this._data;
  }

  push(...values: T[]): void {
    this._data.push(...values);
  }

  at(index: number): T {
    return this._data[index];
  }
}

describe('trap:default', () => {
  const MyData2 = subscriptable(_MyData2);

  it('should be subsriptable', () => {
    const d = new MyData2<number>();

    expect(d[0]).to.equal(undefined);

    d.push(0, 1, 2);

    expect(d[0]).to.equal(0);
    expect(d[1]).to.equal(1);
    expect(d[2]).to.equal(2);
  });

});
