const toUrl = (name) => {
    const nameUrl = name.replace(/\s+/gi, '-').toLowerCase();

    return `${nameUrl}`;
};

export default toUrl;