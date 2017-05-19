'use strict';

var playerCount = 0;
var bankBalance = 0;
var playerBalanceElements = [];

var moneyTypes = [100, 50, 10, 5, 1];

$('document').ready(onLoad);

function onLoad() {
    console.log("onLoad");
    forDev();

    createOptionMenu();
    updateScores();
}

function createOptionMenu() {
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
        updateScores();
    });

    $('#addPlayer').click(function() {
        createPlayer();
    });
}

function forDev() {
    /*
    var button = $('<button></button>')
        .text('AddPlayer')
        .click(function() { createPlayer(); });
    console.log(button);
    $('#bankFrame').append(button);
    console.log($('#bankFrame'));
    */
    createPlayer();
    createPlayer();
}

function createPlayer() {
    if (playerCount > 4)
        return;
    // means adding new col
    var innerPlayerTable = $('<table></table>').addClass('player').attr('id', 'player'+playerCount).append($('<tbody></tbody>'));

    var innerPlayerName = $('<tr></tr>').append($('<td></td>').text('player '+playerCount)).addClass('playerName');

    var innerPlayerScore = $('<tr></tr>').append($('<td></td>').attr('id', 'score'+playerCount));
    innerPlayerScore.attr('value', 0);
    innerPlayerScore.addClass('scoreStyle');

    var innerPlayerButtons = $('<td></td>').attr('id', 'btn_'+playerCount).addClass('playerButtons');

    moneyTypes.forEach( function(money) {
        var button = $('<button></button>')
            .addClass('moneyBtn')
            .addClass('btnStyle')
            .text(money)
            .attr('value', money)
            .click(function(evt) {
                console.log($(evt.target).parent());
                playerEarned(parseInt($(evt.target).parent().attr('id').substr(4)), parseInt(evt.target.value));
            });

        innerPlayerButtons.append(button);
    });

    var check = $('<input></input>')
        .attr('type', 'checkbox')
        .attr('id', 'chk_'+playerCount)
        .click(function() {
            console.log(this.checked);
        });

    innerPlayerButtons.append($('<div></div>').addClass('chkStyle').append($('<label>expense</label>').append(check)));

    innerPlayerTable.append(innerPlayerName).append(innerPlayerScore).append($('<tr></tr>').append(innerPlayerButtons));
    $('#playerTable > tbody > tr').append($('<td></td>').append(innerPlayerTable));

    playerBalanceElements[playerCount] = innerPlayerScore;
    playerCount++;
    updateScores();
}

function playerEarned(playerIndex, amount) {
    console.log('pleyerEarned', playerIndex, amount)
    var element = playerBalanceElements[playerIndex];
    var balance = parseInt(element.attr('value'));

    if ($('#chk_'+playerIndex).is(':checked'))
    {
        balance -= amount;
        bankBalance += amount;
    }
    else
    {
        balance += amount;
        bankBalance -= amount;
    }
    element.attr('value', balance);
    /*
    if (bankBalance < 0 )
        bankBalance = 0;
    */
    updateScores();
}

function updateScores() {
    playerBalanceElements.forEach(function(elm) {
        elm.text(elm.attr('value'));
    });
    $('#bankFrame > div').text(bankBalance);
}