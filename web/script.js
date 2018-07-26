var MT;
(function () {
    "use strict";

    MT = (function () {
        var initialTime,
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
            settingsAreOpen = true,
            CHARACTERS_CURRENCY = ['&euro;', '&#36;', '&pound;', '&yen;', '&curren;'], // EUR, USD, GBP, YEN, CUR
            currencyIndex = 0,
            currentCurrency = CHARACTERS_CURRENCY[currencyIndex],
            valueIsHuge = false,
            timerInterval,

            updateCosts = function (elapsedTime) {
                sum = ((attendees * salary * (elapsedTime / 3600000)));
                sum = Math.round(sum * 100) / 100;
                if (sum > 9999 && valueIsHuge === false) {
                    document.querySelector('.money').className += ' money--hugevalue';
                    valueIsHuge = true;
                } else if (sum > 10) {
                    sum = parseInt(sum, 10);
                }
                moneyDomElement.innerHTML = sum.toLocaleString();
            },
            
            addLeadingZero = function(num) {
                return (num > 9) ? num.toString() : '0' + num.toString();
            },

            updateTime = function (elapsedTime) {
                var elapsedTimeSeconds = addLeadingZero(Math.floor((elapsedTime / 1000) % 60));
                var elapsedTimeMinutes = addLeadingZero(Math.floor((elapsedTime / 60000) % 60));
                var elapsedTimeHours = Math.floor((elapsedTime / 1000) / 3600);

                timeDomElement.innerHTML = elapsedTimeHours + ':' + elapsedTimeMinutes + ':' + elapsedTimeSeconds;
            },

            tick = function () {
                var currentTime = Date.parse(new Date());
                var elapsedTime = currentTime - initialTime;
                updateCosts(elapsedTime);
                updateTime(elapsedTime);
            },

            initTimer = function () {
                timerDomElement.style.display = 'block';
                initialTime = Date.parse(new Date());
                timerInterval = window.setInterval(MT.tick, 1000);
            },

            cacheDomElements = function () {
                timerDomElement = document.getElementById('timer');
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
                settingsIconDomElement.addEventListener('click', MT.handleClickOnSettingsIcon, false);
                for (var i = 0; i < inputCurrencyDomElement.length; i++) {
                    inputCurrencyDomElement.item(i).addEventListener('click', MT.handleClickOnCurrency, false);
                }
                inputSubmitDomElement.addEventListener('click', MT.handleClickOnSubmit, false);
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
        };
    }());
    MT.init();
}());