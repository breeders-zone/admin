const times = n => f => {
    let iter = i => {
        if (i === n) return;
        f (i);
        iter (i + 1)
    };
    return iter (0)
};

export default times;