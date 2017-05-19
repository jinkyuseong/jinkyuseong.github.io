'use strict';

var playerCount = 0;
var bankBalance = 600;
var playerBalanceElements = [];

var moneyTypes = [100, 50, 10, 5, 1];

$('document').ready(onLoad);

function onLoad() {
    console.log("onLoad");
    forDev();

    updateScores();
}

function forDev() {
    var button = $('<button></button>')
        .text('AddPlayer')
        .click(function() { createPlayer(); });
    console.log(button);
    $('#bankFrame').append(button);
    console.log($('#bankFrame'));
    createPlayer();
    createPlayer();
}

function createPlayer() {
    // means adding new col
    var innerPlayerTable = $('<table></table>').addClass('player').attr('id', 'player'+playerCount).append($('<tbody></tbody>'));

    var innerPlayerName = $('<tr></tr>').append($('<td></td>').text('player '+playerCount));

    var innerPlayerScore = $('<tr></tr>').append($('<td></td>').attr('id', 'score'+playerCount));
    innerPlayerScore.attr('value', 0);
    innerPlayerScore.addClass('scoreStyle');

    var innerPlayerButtons = $('<td></td>').addClass('btn_'+playerCount).addClass('playerButtons');

    moneyTypes.forEach( function(money) {
        var button = $('<button></button>')
            .addClass('moneyBtn')
            .addClass('btnStyle')
            .text(money)
            .attr('value', money)
            .click(function(evt) {
                console.log($(evt.target).parent());
                playerEarned(parseInt($(evt.target).parent().attr('class').substr(4)), parseInt(evt.target.value));
            });

        innerPlayerButtons.append(button);
    });

    var check = $('<input></input>')
        .attr('type', 'checkbox')
        .attr('id', 'expenseChk')
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
    element.attr('value', balance + amount);

    bankBalance -= amount;
    if (bankBalance < 0 )
        bankBalance = 0;
    updateScores();
}

function updateScores() {
    playerBalanceElements.forEach(function(elm) {
        elm.text(elm.attr('value'));
    });
    $('#bankFrame > div').text(bankBalance);
}