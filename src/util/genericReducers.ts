import { get, Updater, Writable } from "svelte/store";


export const makeApplyDiff = <T>(update: (this: void, updater: Updater<T>) => void) =>
    (diff: Partial<T>) => update((state: T) => {
        return Object.assign(state, diff) as T;
    });


type UpdaterVoid<TState extends object, TArgs extends any[]> = (state: TState, ...args: TArgs) => void;

//type UpdatersVoidMap = 

type BoundUpdaterVoid<TUpdaterVoid> = TUpdaterVoid extends UpdaterVoid<any, infer TArgs>
    ? (...args: TArgs) => void
    : never;

type BoundUpdaters<TUpdatersVoidMap> = {
    [K in keyof TUpdatersVoidMap]: BoundUpdaterVoid<TUpdatersVoidMap[K]>
}

export function bindToStore<
    TStoreState,
    TUpdaters extends {
    [key: string]: UpdaterVoid<any, any>,
}>(
    store: Writable<TStoreState>,
    updatersMap: TUpdaters
): BoundUpdaters<TUpdaters> {

    return updatersMap.map(updater => (...args: any) => {
        const state = get(store);
        updater(state, ...args);
        store.set(state);
    }) as any as BoundUpdaters<TUpdaters>;

}