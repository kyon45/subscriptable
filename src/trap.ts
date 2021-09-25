type Cls = new (...args: any[]) => any;

/**
 * A trap function that makes ESNext Class subscriptable.
 * @param cls The class constructor to trap.
 * @param clsProp 
 *   - The property that subscript operation maps to.
 *   - If given `undefined`, then subscript operation maps
 *     to the `at` method invocation.
 * @returns The subscriptable class construtor.
 * 
 * @example
 * ```
 * class MyData<T> {
 *   private _data: T[];
 * 
 *   push(...values: T[]): void {
 *     this._data.push(...values);
 *   }
 * }
 * 
 * class MyDataProxied = subscriptable(MyData, '_data');
 * 
 * const d = new MyData<number>();
 * d[0]   // undefined
 * d.push(0, 1, 2);
 * d[0]   // 0
 * d[1]   // 1
 * d[2]   // 2
 * ```
 */
function subscriptable<C extends Cls>(cls: C, clsProp?: string | symbol): C {
  const numericGetHandler: ProxyHandler<InstanceType<C/** typeof cls */>> = {
    get(target, prop: string | symbol) {
      const numericProp = Number(prop);

      if (Number.isInteger(numericProp)) {
        if (clsProp) {
          return Reflect.get(target, clsProp)?.[numericProp];
        }
        const at = Reflect.get(target, 'at');
        if (typeof at === 'function' || Object.prototype.toString.call(at) === '[object Function]') {
          return at.call(target, numericProp);
        }
      }
      return Reflect.get(target, prop);
    }
  }
  
  const constructProxyHandler: ProxyHandler<C/** typeof cls */> = {
    construct(target, args: ConstructorParameters<C/** typeof cls */>) {
      // call the constructor normally
      const instance = new target(...args);

      // return a proxy
      return new Proxy(instance, numericGetHandler);
    }
  };

  return new Proxy(cls, constructProxyHandler);
};

export default subscriptable;
