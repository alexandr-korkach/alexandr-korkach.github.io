"use strict";

function pomodoro(elem) {
    var breakBlock = document.getElementById("break-block"),
        sessionBlock = document.getElementById("session-block"),
        controlBlock = document.querySelector(".pomodoro__controls"),
        scale = document.getElementById("pomodoro-scale"),
        time = document.getElementById("time"),
        clockBlock = document.querySelector(".pomodoro__clock"),
        timeValue = null,
        minutes = void 0,
        currentProcess = "session-block",
        timer = null,
        scaleHeight = null;

    breakBlock.innerText = 5;
    sessionBlock.innerText = 25;
    time.innerText = 25;

    clockBlock.addEventListener("click", processes);
    controlBlock.addEventListener("click", changeValue);

    function processes() {
        clockBlock.removeEventListener("click", processes);
        clockBlock.addEventListener("click", pauseTimer);
        if (timeValue == null) {
            timeValue = new Date('2000', '01', '01');
            timeValue.setMinutes(time.innerText);
            scaleHeight = 300 / (time.innerText * 60);
            scale.style.height = scaleHeight + "px";
        }

        timer = setTimeout(startTimer, 1000);
    }

    function startTimer() {
        timeValue = new Date(timeValue - 1000);
        var minutes = timeValue.getMinutes() > 9 ? timeValue.getMinutes() : "0" + timeValue.getMinutes(),
            second = timeValue.getSeconds() > 9 ? timeValue.getSeconds() : "0" + timeValue.getSeconds();

        time.innerText = timeValue.getHours() > 0 ? timeValue.getHours() + ":" + minutes + ":" + second : minutes + ":" + second;
        scale.style.height = parseFloat(scale.style.height) + scaleHeight + "px";
        if (timeValue.valueOf() == new Date('2000', '01', '01').valueOf()) {
            clearTimeout(timer);
            clockBlock.removeEventListener("click", pauseTimer);
            changeProcess();
            return;
        }

        timer = setTimeout(startTimer, 1000);
    }

    function pauseTimer() {
        clearTimeout(timer);
        timer = null;
        clockBlock.removeEventListener("click", pauseTimer);
        clockBlock.addEventListener("click", processes);
    }

    function changeProcess() {
        scale.classList.toggle("pomodoro__scale--red");
        currentProcess = currentProcess == "session-block" ? "break-block" : "session-block";
        document.querySelector('.pomodoro__current-process').innerText = currentProcess == "session-block" ? "Session" : "Break!";
        time.innerText = document.getElementById(currentProcess).innerText;
        timeValue = null;
        processes();
    }

    function changeValue(e) {
        if (e.target.tagName == "BUTTON" && timer == null) {
            var action = e.target.getAttribute("data-act"),
                idBlock = e.target.parentElement.getAttribute("data-attch"),
                valueField = document.getElementById(idBlock),
                value = parseInt(valueField.innerText);
            if (!(action == "-" && value == 1)) {

                value = action == "-" ? value - 1 : value + 1;
                valueField.innerText = value;
                if (idBlock == currentProcess) {
                    time.innerText = value;
                    timeValue = null;
                }
            }
        }
    }
}
pomodoro(document.getElementById("pomodoro"));