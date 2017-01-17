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
            //playpauseDomElement,
            settingsIconDomElement,
            settingsDomElement,
            inputAttendeesDomElement,
            inputSalaryDomElement,
            inputCurrencyDomElement,
            inputSubmitDomElement,
            settingsAreOpen = true,
            CHARACTERS_CURRENCY = ['&euro;', '&#36;', '&pound;', '&yen;', '&curren;'], // EUR, USD, GBP, YEN, CUR
            currencyIndex = 0,
            currentCurrency = CHARACTERS_CURRENCY[currencyIndex],
            timerInterval,
            valueIsHuge = false,


            updateCosts = function () {
                sum = ((attendees * salary * (elapsedTime / 3600000)))
                sum = Math.round(sum * 100) / 100;
                if (sum > 9999 && valueIsHuge === false) {
                    document.querySelector('.money').className += ' money--hugevalue';
                    valueIsHuge = true;
                } else if (sum > 10) {
                    sum = parseInt(sum, 10)
                }
                moneyDomElement.innerHTML = sum.toLocaleString();
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
                timerDomElement.style.display = 'block';
                //playpauseDomElement.className = 'running';
                //clearInterval(initialTime); // DEBUG
                initialTime = Date.parse(new Date());
                timerInterval = window.setInterval(MT.tick, 1000);
            },

            cacheDomElements = function () {
                timerDomElement = document.getElementById('timer');
                //playpauseDomElement = document.getElementById('playpause');
                timeDomElement = document.getElementById('time');
                moneyDomElement = document.getElementById('value');
                settingsIconDomElement = document.getElementById('settingsIcon');
                settingsDomElement = document.getElementById('settings');
                inputCurrencyDomElement = document.getElementsByClassName('currency');
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

            /*handleClickOnPlaypause = function () {
                if (playpauseDomElement.className === 'running') {
                    playpauseDomElement.className = ''
                } else {
                    playpauseDomElement.className = 'running';
                }
            },*/

            handleClickOnCurrency = function () {
                currencyIndex++;
                currencyIndex = currencyIndex % CHARACTERS_CURRENCY.length;
                currentCurrency = CHARACTERS_CURRENCY[currencyIndex];
                for (var i = 0; i < inputCurrencyDomElement.length; i++) {
                    inputCurrencyDomElement.item(i).innerHTML = currentCurrency;
                }        
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
                //playpauseDomElement.addEventListener('click', MT.handleClickOnPlaypause, false);
                settingsIconDomElement.addEventListener('click', MT.handleClickOnSettingsIcon, false);
                for (var i = 0; i < inputCurrencyDomElement.length; i++) {
                    inputCurrencyDomElement.item(i).addEventListener('click', MT.handleClickOnCurrency, false);
                }
                inputSubmitDomElement.addEventListener('click', MT.handleClickOnSubmit, false);
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
            //handleClickOnPlaypause: handleClickOnPlaypause,
            handleClickOnSubmit: handleClickOnSubmit
            //,debugSetBack: debugSetBack
        };
    }());
    MT.init();
}());