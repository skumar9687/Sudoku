/*function timerCal(timeleft, timetotal, element) {
    element.innerHTML = timeleft;
    if(timeleft > 0) {
        setTimeout(function() {
            timerCal(timeleft - 1, timetotal, element);
        }, 1000);
    }
};*/
var clearTimer = false;
function timerCal(sec, min, hr,element) {
	
			element.innerHTML = ((hr<10)?("0"+hr):hr)+":"+((min<10)?("0"+min):min)+":"+((sec<10)?("0"+sec):sec);

};
export {timerCal,
		clearTimer}
//export default clearTimer;