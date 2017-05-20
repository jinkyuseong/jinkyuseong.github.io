'use strict';

var playerCount = 0;
var bankBalance = 100;
var playerBalanceElements = [];
var lastPlayerEarned = [];
var lastPlayerSalary = [];
var lastTimeOut;
var LAST_TIMEOUT = 5000;

var moneyTypes = [10, 5, 1];

$('document').ready(onLoad);

function onLoad() {
    console.log("onLoad");
    forDev();

    createOptionMenu();
    updateScores();
}

function createOptionMenu() {
    $('#bankFrame > div').click(function() {
        applyEranings(true);
        updateScores();
    })

    $('#toggleFullScreen').click(function() {
     var isInFullScreen = (document.fullscreenElement && document.fullscreenElement !== null) ||
        (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
        (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
        (document.msFullscreenElement && document.msFullscreenElement !== null);

    var docElm = document.documentElement;
    if (!isInFullScreen) {
        if (docElm.requestFullscreen) {
            docElm.requestFullscreen();
        } else if (docElm.mozRequestFullScreen) {
            docElm.mozRequestFullScreen();
        } else if (docElm.webkitRequestFullscreen) {
            docElm.webkitRequestFullscreen();
        } else if (docElm.msRequestFullscreen) {
            docElm.msRequestFullscreen();
        }
        // exit button is necessary? 
        $('#toggleFullScreen').hide();
        $('#addPlayer').hide();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }

    });

    $('#refillBank').click(function() {
        if (bankBalance < 0)
            bankBalance = 0;
        bankBalance += 100;   
        applyEranings(true);
        updateScores();
    });

    $('#addPlayer').click(function() {
        createPlayer();
    });
}

function forDev() {
    createPlayer();
    createPlayer();
}

function createPlayer() {
    if (playerCount > 4)
        return;
    var innerPlayerTable = $('<table></table>').addClass('player').attr('id', 'player'+playerCount).append($('<tbody></tbody>'));

    var innerPlayerName = $('<tr></tr>').append($('<td></td>').text('player '+playerCount)).addClass('playerName');

    // player score fields
    var innerPlayerScore = $('<div></div>').attr('id', 'score'+playerCount);
    innerPlayerScore.attr('value', 0);
    innerPlayerScore.click(function() {
        console.log('clicked');
        applyEranings(true);
    })

    // player main earnings
    var innerPlayerEarnings = $('<span></span>').attr('id', 'earnings'+playerCount);
    innerPlayerEarnings.attr('value', 0);
    innerPlayerEarnings.addClass('scoreStyleSmall');
    innerPlayerEarnings.click(function() {
        applyEranings(true);
    })

    // player additional earnings by CFO
    var innerPlayerCFO= $('<span></span>').attr('id', 'cfo'+playerCount);
    innerPlayerCFO.attr('value', 0);
    innerPlayerCFO.addClass('scoreStyleSmall2');
    innerPlayerCFO.click(function() {
        applyEranings(true);
    })

    // salary expense
    var innerPlayerSalary = $('<span></span>').attr('id', 'slr'+playerCount);
    innerPlayerSalary.attr('value', 0);
    innerPlayerSalary.addClass('scoreStyleSmall2');
    innerPlayerSalary.click(function() {
        applyEranings(true);
    })

    var innerPlayerButtons = $('<td></td>').attr('id', 'btn_'+playerCount).addClass('playerButtons');

    // money buttons
    moneyTypes.forEach( function(money) {
        var button = $('<div></div>')
            .addClass('btnStyle')
            .text(money)
            .attr('value', money)
            .click(function(evt) {
                playerEarned(parseInt($(evt.target).parent().attr('id').substr(4)), parseInt($(evt.target).attr('value')));
            });
        innerPlayerButtons.append(button);
    });

    // salary button
    var salaryButton = $('<div></div>')
        .addClass('btnStyle')
        .addClass('btnSalaryStyle')
        .text('S')
        .attr('value', -5)
        .click(function(evt) {
            salaryExpensed(parseInt($(evt.target).parent().attr('id').substr(4)), parseInt($(evt.target).attr('value')));
        });
    innerPlayerButtons.append(salaryButton);

    // expense check box
    var checkExpense = $('<input></input>')
        .attr('type', 'checkbox')
        .attr('id', 'chk_'+playerCount)
        .click(function() {
            console.log(this.checked);
            clearTimeout(lastTimeOut);
            lastTimeOut = setTimeout(function() { applyEranings(false); }, LAST_TIMEOUT);
            updateScores();
        });

    innerPlayerButtons.append($('<div></div>', '{overflow: hidden;}').addClass('chkStyle').append($('<label>expense</label>').append(checkExpense)));

    // CFO check box
    var checkCFO = $('<input></input>')
        .attr('type', 'checkbox')
        .attr('id', 'cfo_'+playerCount)
        .click(function() {
            console.log(this.checked);
            clearTimeout(lastTimeOut);
            lastTimeOut = setTimeout(function() { applyEranings(false); }, LAST_TIMEOUT);
            updateScores();
        });

    innerPlayerButtons.append($('<div></div>', '{overflow: hidden;}').addClass('chkStyle').append($('<label>CFO</label>').append(checkCFO)));

    innerPlayerTable.append(innerPlayerName)
    innerPlayerTable
        .append($('<tr></tr>')
                    .append($('<td></td>')
                                .append($('<div></div>')
                                    .css('overflow', 'hidden')
                                    .addClass('scoreStyle')
                                    .append(innerPlayerScore)
                                    .append($('<div></div>')
                                        .append(innerPlayerEarnings)
                                        .append(innerPlayerCFO)
                                        .append(innerPlayerSalary)
                                ))));

    innerPlayerTable.append($('<tr></tr>').append(innerPlayerButtons));

    $('#playerTable > tbody > tr').append($('<td></td>').append(innerPlayerTable));

    playerBalanceElements[playerCount] = innerPlayerScore;
    lastPlayerEarned[playerCount] = lastPlayerSalary[playerCount] = 0;
    playerCount++;
    updateScores();
}

function salaryExpensed(playerIndex, amount) {
    if ($('#chk_'+playerIndex).is(':checked'))
        lastPlayerSalary[playerIndex] -= amount;
    else
        lastPlayerSalary[playerIndex] += amount;
    updateScores();
    clearTimeout(lastTimeOut);
    lastTimeOut = setTimeout(function() { applyEranings(false); }, LAST_TIMEOUT);
}

function playerEarned(playerIndex, amount) {
    console.log('pleyerEarned', playerIndex, amount)
    if ($('#chk_'+playerIndex).is(':checked'))
    {
        lastPlayerEarned[playerIndex] -= amount;
        bankBalance += amount;
    }
    else
    {
        lastPlayerEarned[playerIndex] += amount;
        bankBalance -= amount;
    }
    updateScores();
    clearTimeout(lastTimeOut);
    lastTimeOut = setTimeout(function() { applyEranings(false); }, LAST_TIMEOUT);
}

function updateScores() {
    playerBalanceElements.forEach(function(elm) {
        var id = parseInt(elm.attr('id').substr(5));
        elm.text(elm.attr('value'));
    });
    var tempLast = 0;
    for (var i = 0; i < lastPlayerEarned.length; ++i) 
    {
        if (lastPlayerEarned[i] == 0)
        {
            $('#earnings'+i).hide();
            $('#cfo'+i).hide();
        }
        else
        {
            $('#earnings'+i).show();
            $('#earnings'+i).text(lastPlayerEarned[i]);
            if ($('#cfo_'+i).is(':checked'))
            {
                $('#cfo'+i).show();
                $('#cfo'+i).text(' +' + Math.floor(lastPlayerEarned[i] * .5));
                tempLast += Math.floor(lastPlayerEarned[i] * .5);
            }
            else
                $('#cfo'+i).hide();
        }
        if (lastPlayerSalary[i] == 0)
        {
            $('#slr'+i).hide();
        }
        else
        {
            $('#slr'+i).show();
            $('#slr'+i) .text(' ' + lastPlayerSalary[i]);
            tempLast += lastPlayerSalary[i];
        }
    }
    $('#bankFrame > div').text(bankBalance - tempLast);
}

function applyEranings(force) {
    if (force)
        clearTimeout(lastTimeOut);
    for (var i = 0; i < lastPlayerEarned.length; ++i) 
    {
        var element = playerBalanceElements[i];
        var balance = parseInt(element.attr('value'));
        balance += lastPlayerEarned[i];
        if ($('#cfo_'+i).is(':checked'))
        {
            balance += Math.floor(lastPlayerEarned[i] * .5);
            bankBalance -= Math.floor(lastPlayerEarned[i] * .5);
        }
        balance += lastPlayerSalary[i];
        bankBalance -= lastPlayerSalary[i];
        element.attr('value', balance);
        lastPlayerSalary[i] = lastPlayerEarned[i] = 0;
        $('#chk_'+i).prop('checked', false);
    }
    updateScores();
}