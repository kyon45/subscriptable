export { default as trap } from './trap';

type Cls = new (...args: any[]) => any;

/**
 * A class decorator that makes ESNext Class subscriptable.
 * @param clsProp
 *   - The property that subscript operation maps to.
 *   - If given `undefined`, then subscript operation maps
 *     to the `at` method invocation.
 * @returns The subscriptable class constructor.
 * 
 * @example
 * ```
 * "@subscriptable('_data')"  // remove the `"` marks when use
 * class MyData<T> {
 *   private _data: T[] = [];
 * 
 *   push(...values: T[]): void {
 *     this._data.push(...values);
 *   }
 * }
 * 
 * const d = new MyData<number>();
 * d[0]   // undefined
 * d.push(0, 1, 2);
 * d[0]   // 0
 * d[1]   // 1
 * d[2]   // 2
 *
 * ```
 */
function subscriptable(clsProp?: string | symbol): ClassDecorator {
  const numericGetHandler: ProxyHandler<InstanceType<Cls>> = {
    get(target, propKey) {
      const numericProp = Number(propKey);

      if (Number.isInteger(numericProp)) {
        if (clsProp) {
          return Reflect.get(target, clsProp)?.[numericProp];
        }
        const at = Reflect.get(target, 'at');
        if (typeof at === 'function' || Object.prototype.toString.call(at) === '[object Function]') {
          return at.call(target, numericProp);
        }
      }
      return Reflect.get(target, propKey);
    }
  };

  const constructProxyHandler: ProxyHandler<Cls> = {
    construct(target, args: ConstructorParameters<Cls>) {
      // call the constructor normally
      const instance = new target(...args);

      // return a proxy
      return new Proxy(instance, numericGetHandler);
    }
  };

  return function (target: any) {
    return new Proxy(target, constructProxyHandler);
  }
}

export default subscriptable;
