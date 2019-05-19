export default function currentDateAsString() {
    let today = new Date(Date());
    today = today.getFullYear() + '-' + ('0' + (1 + today.getMonth())).slice(-2) + '-' + today.getDate();
    return today;
}