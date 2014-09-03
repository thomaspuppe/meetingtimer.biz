var MT;
(function () {
    "use strict";

    MT = (function () {
        var initialTime,
            currentTime,
            elapsedTime,
            elapsedTimeHours,
            elapsedTimeMinutes,
            elapsedTimeSeconds,
            timerIsRunning = false,
            attendees = 0,
            salary = 0,
            sum = 0,
            timerDomElement,
            timeDomElement,
            moneyDomElement,
            settingsIconDomElement,
            settingsDomElement,
            inputAttendeesDomElement,
            inputSalaryDomElement,
            inputCurrencyDomElement,
            inputSubmitDomElement,
            settingsAreOpen = false,
            CHARACTERS_CURRENCY = ['&euro;', '&#36;', '&#163;', '&#165'], // EUR, USD, GBP, YEN,
            currencyIndex = 0,
            currentCurrency = CHARACTERS_CURRENCY[currencyIndex],
            timerInterval,


            updateCosts = function () {
                sum = ((attendees * salary * (elapsedTime / 3600000))).toFixed(2);
                moneyDomElement.innerHTML = sum + ' ' + currentCurrency;
            },

            updateTime = function () {
                elapsedTimeSeconds = Math.floor((elapsedTime / 1000) % 60);
                elapsedTimeMinutes = Math.floor((elapsedTime / 60000) % 60);
                elapsedTimeHours = Math.floor((elapsedTime / 1000) / 3600);

                elapsedTimeSeconds = (elapsedTimeSeconds > 9) ? elapsedTimeSeconds : '0' + elapsedTimeSeconds.toString();
                elapsedTimeMinutes = (elapsedTimeMinutes > 9) ? elapsedTimeMinutes : '0' + elapsedTimeMinutes.toString();

                timeDomElement.innerHTML = elapsedTimeHours + ':' + elapsedTimeMinutes + ':' + elapsedTimeSeconds;
            },

            tick = function () {
                currentTime = Date.parse(new Date());
                elapsedTime = currentTime - initialTime;
                updateCosts();
                updateTime();
            },

            initTimer = function () {
                clearInterval(initialTime); // DEBUG
                initialTime = Date.parse(new Date());
                timerInterval = window.setInterval(MT.tick, 1000);
            },

            cacheDomElements = function () {
                timerDomElement = document.getElementById('timer');
                timeDomElement = document.getElementById('time');
                moneyDomElement = document.getElementById('money');
                settingsIconDomElement = document.getElementById('settingsIcon');
                settingsDomElement = document.getElementById('settings');
                inputCurrencyDomElement = document.getElementById('inputCurrency');
                inputAttendeesDomElement = document.getElementById('inputAttendees');
                inputSalaryDomElement = document.getElementById('inputSalary');
                inputSubmitDomElement = document.getElementById('inputSubmit');
            },

            openSettings = function () {
                settingsAreOpen = true;
                settingsDomElement.className = 'active';
                settingsIconDomElement.className = 'active';
            },

            closeSettings = function () {
                settingsAreOpen = false;
                settingsDomElement.className = '';
                settingsIconDomElement.className = '';
            },

            handleClickOnSettingsIcon = function () {
                if (settingsAreOpen) {
                    closeSettings();
                } else {
                    openSettings();
                }
            },

            handleClickOnCurrency = function () {
                currencyIndex++;
                currencyIndex = currencyIndex % CHARACTERS_CURRENCY.length;
                currentCurrency = CHARACTERS_CURRENCY[currencyIndex];
                inputCurrencyDomElement.innerHTML = currentCurrency;
            },

            handleClickOnSubmit = function () {
                attendees = parseInt(inputAttendeesDomElement.value, 10);
                salary = parseInt(inputSalaryDomElement.value, 10);

                inputAttendeesDomElement.value = attendees;
                inputSalaryDomElement.value = salary;

                if (attendees > 0 && salary > 0) {
                    initTimer();
                    closeSettings();
                }


            },

            registerClickEvents = function () {
                settingsIconDomElement.addEventListener('click', MT.handleClickOnSettingsIcon, false);
                //inputCurrencyDomElement.addEventListener('click', MT.handleClickOnCurrency, false);
                //inputSubmitDomElement.addEventListener('click', MT.handleClickOnSubmit, false);
            },

            debugSetBack = function (seconds) {
                initialTime -= seconds * 1000;
            },

            init = function () {
                cacheDomElements();
                registerClickEvents();
            }; // end of var

        return {
            init: init,
            tick: tick,
            handleClickOnSettingsIcon: handleClickOnSettingsIcon,
            handleClickOnCurrency: handleClickOnCurrency,
            handleClickOnSubmit: handleClickOnSubmit
            //,debugSetBack: debugSetBack
        };
    }());
    MT.init();
}());