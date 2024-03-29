type Matcher<R> = { ctor: any, fn: (v: any) => R }
type MatchFn<R> = (inst: any) => R

export function create<T extends string>(...ctors: T[]) : { [K in T]: (value?: any) => any }

export function when<R>(ctor: any, fn: (v: any) => R) : Matcher<R>
export function match<R>(matchers: Matcher<R>[]) : MatchFn<R>
export function is(type: any, inst: any) : boolean
export function stringify(instance: any, indendation?: number) : string

export const otherwise: any
