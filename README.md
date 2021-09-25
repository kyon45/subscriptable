> A decorator library makes ESNext Class subscriptable.

## Installation

```
npm install @kyon45/subscriptable
```

or

```
yarn add @kyon45/subscriptable
```

## Usage

### Decorator

```typescript
// esm
import subscriptable from '@kyon45/subscriptable';

@subscriptable('_data')
class MyData<T> {
  private _data: T[];

  push(...values: T[]): void {
    this._data.push(...values);
  }
}

const d = new MyData<number>();
d[0]   // undefined
d.push(0, 1, 2);
d[0]   // 0
d[1]   // 1
d[2]   // 2
```

### Trap

```typescript
// esm
import { trap as subscriptable } from '@kyon45/subscriptable';
// or
import subscriptable from '@kyon45/subscriptable/lib/trap';

class MyData<T> {
  private _data: T[];

  push(...values: T[]): void {
    this._data.push(...values);
  }
}

const MyDataProxied = subscriptable(MyData, '_data');

const d = new MyDataProxied<number>();
d[0]   // undefined
d.push(0, 1, 2);
d[0]   // 0
d[1]   // 1
d[2]   // 2
```

### Something like `__getitem__` ?

If you do not pass a prop (`'_data'` in the above examples), you can choose to define an `at` method, somehow like `__getitem__` in Python.

```typescript
// esm
import subscriptable from '@kyon45/subscriptable';

@subscriptable()
class MyData {
  private _data: string;

  constructor(data: string) {
    this._data = data;
  }

  at(index: number): string {
    return this._data.substr(index, 1);
  }
}

const d = new MyData('subscriptable');
d[0]    // 's'
d[2]    // 'b'
d[-1]   // 'e'
```

## TODO

- [ ] setter
- [ ] slice, like `data[0:1]`?
- [ ] iterable?
- [ ] * Pull Request welcome

## LICENSE

MIT
