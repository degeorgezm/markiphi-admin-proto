const months = {
    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December'
}

const days = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday'
}

export function blobToBase64(blob, callback) {
    let reader = new FileReader();
    reader.onload = function () {
        let result = reader.result;
        callback(result);
    };
    reader.readAsDataURL(blob);
}

export function dateToString(date): string {
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();

    let string = months[month] + " " + day + ", " + year;

    return string
}

export function timeToString(date): string {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

export function dayToString(day): string {
    return days[day];
}

export function hoursSince(date): string {
    let now = new Date();

    var hours = Math.abs(now.getTime() - date.getTime()) / 36e5;

    return hours.toFixed(2);
}

export function addDays(date, days): Date {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}