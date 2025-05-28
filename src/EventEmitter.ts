/**
 * Analogous to the NodeJS version.
 */
export class EventEmitter<const T extends Record<any,[...args:any[]]>>
{
    callbacks = {} as Record<keyof T,((...args:any[])=>void)[]>;

    constructor(){}

    on<K extends keyof T, Args extends T[K] = T[K]>(event:K, cb:(...Args)=>void)
    {
        if(!this.callbacks[event])
            this.callbacks[event] = [];
        this.callbacks[event].push(cb)
    }

    off<K extends keyof T, Args extends T[K] = T[K]>(event:K, cb:(...Args)=>void)
    {
        if(!this.callbacks[event])
            return;
        this.callbacks[event].splice(this.callbacks[event].indexOf(cb),1);
    }

    emit<K extends keyof T, Args extends T[K] = T[K]>(event:K, ...data:Args){
        let cbs = this.callbacks[event]
        if(cbs)
        {
            cbs.forEach(cb => cb(...data))
        }
    }
}