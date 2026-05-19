
interface Args {
    key:string;
    value:string;
}

export const setLocalStorage = (...args :Args[] )=>{
    args.forEach((value)=>{
        localStorage.setItem(value.key,value.value)
    })
}

