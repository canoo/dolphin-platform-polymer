// declare module "dolphin-platform-js" {
declare namespace dolphin {
  export interface ClientContext extends Emitter {
    dolphin: any
    beanManager: BeanManager
    connectionPromise: Promise<any>
    isConnected: boolean
    constructor(dolphin: any,
      beanManager: BeanManager,
      controllerManager: any,
      connector: any)
    connect(): Promise<any>
    onConnect(): Promise<any>
    createController(name: string): Promise<Controller>
    disconnect(): Promise<any>
  }

  export interface BeanManager {
    constructor(classRepository: any)
    notifyBeanChange(bean: any,
      propertyName: string,
      newValue: any): any
    notifyArrayChange(bean: any,
      propertyName: string,
      startIndex: number,
      addedCount: number,
      removedItems: any[]): any
    onAdded(eventHandler: any): Subscription
    onAdded(type: any,
      eventHandler: any): Subscription
    onRemoved(eventHandler: any): Subscription
    onRemoved(type: any,
      eventHandler: any): Subscription
    onBeanUpdate(eventHandler: (bean: any,
      propertyName: string,
      newValue: any, oldValue: any) => void): Subscription
    onBeanUpdate(type: any,
      eventHandler: any): Subscription
    onArrayUpdate(eventHandler: (bean: any,
      startIndex: number,
      removedCount: number,
      addedItems: any[]) => void): Subscription
    onArrayUpdate(type: any,
      eventHandler: any): Subscription
  }

  interface Controller {
    controllerId: string
    model: any
    manager: any
    destroyed: boolean
    constructor(controllerId: string, model: any, manager: any)
    getModel(): any
    getId(): string
    invoke(name: any, params: any): any
    createController(name: string): any
    destroy(): any
    onDestroyed(handler: any): Subscription
  }

  interface Emitter {
    on(event: any, fn: any): this
    once(event: any, fn: any): this
    off(event: any, fn: any): this
    emit(event: any): this
    listeners(event: any): any[]
    hasListeners(event: any): boolean
  }

  interface Subscription {
    unsubscribe(): void
  }
}