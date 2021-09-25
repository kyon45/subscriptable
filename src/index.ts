export { default as trap } from './trap';

type Cls = new (...args: any[]) => any;
type ClassDecorator<TFunction extends Cls> = (target: TFunction) => TFunction | void;

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
function subscriptable<C extends Cls>(clsProp?: string | symbol): ClassDecorator<C> {
  const numericGetHandler: ProxyHandler<InstanceType<C>> = {
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

  const constructProxyHandler: ProxyHandler<C> = {
    construct(target, args: ConstructorParameters<C>) {
      // call the constructor normally
      const instance = new target(...args);

      // return a proxy
      return new Proxy(instance, numericGetHandler);
    }
  };

  return function (target: C) {
    return new Proxy(target, constructProxyHandler);
  }
}

export default subscriptable;
