const compareMorph = (traitTitle: string, geneTitle: string) => {
    return traitTitle === 'Normal' || traitTitle === 'Visual' ? `${geneTitle}` : `${traitTitle} ${geneTitle}`;
};


export default compareMorph;
