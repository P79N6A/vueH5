function getDate() {
    var this_date = {};
    var d = new Date();
    var str = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
    if (d.getMonth() < 9) {
        if (d.getDate() < 10) {
            str = d.getFullYear() + "-0" + (d.getMonth() + 1) + "-0" + d.getDate();
        } else {
            str = d.getFullYear() + "-0" + (d.getMonth() + 1) + "-" + d.getDate();
        }
    } else {
        str = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
    }
    this_date.begin_time=str+" 00:00:00";
    this_date.end_time=str+" 23:59:59";
    return this_date
}
