import moment from 'moment';

const getDates = (startDate: string|Date, stopDate: string|Date): string[] => {
    let dateArray = [];
    let currentDate = moment(startDate);
    let stopDate1 = moment(stopDate);
    while (currentDate <= stopDate1) {
        dateArray.push( moment(currentDate).format('DD.MM'));
        currentDate = moment(currentDate).add(1, 'days');
    }
    return dateArray;
};

export default getDates;
