const add = (arg?: number) => {
    if(typeof arg === "undefined") {
        return 0;
    }
    return arg+arg;
}