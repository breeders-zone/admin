const times = n => f => {
    return [...Array(n)].map((item, idx) => f(++idx))
};

export default times;