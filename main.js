var begun = false;
var numPlayers = 0,
    allRoles,
    numFacists = 0,
    currentPlayer = 0,
    currentPresident = 0,
    returnPresident = 0,
    numConsecFails = 0;

var policyCards = ['Facist', 'Facist', 'Facist', 'Facist', 'Facist', 'Facist',
                   'Facist', 'Facist', 'Facist', 'Facist', 'Facist',
                   'Liberal', 'Liberal', 'Liberal', 'Liberal', 'Liberal',
                   'Liberal'];
var recyclePolicyCards = [], placedPolicyCards = [];
var passedFacists = 0, passedLiberals = 0,
    hitlerTerritory = false, vetoPower = false;
var removedPlayers = [];

var cpresidentExamines = 0,
    cpresidentBullet = 0,
    cpresidentInvestigatePlayer = 0,
    cpresidentPicksPresident = 0;


function liberalsWin() {
  $("#game").fadeOut(function () {
    $("#win").text("Liberals Win! Reload to play again!").fadeIn();
  });
  return;
}

function facistsWin() {
  $("#game").fadeOut(function () {
    $("#win").text("Facists Win! Reload to play again!").fadeIn();
  });
  return;
}

function showNext3Cards() {
  $("#cards span").off("click");
  $("#cards span p").each(function(i) { // change the color back to normal
    $(this).css("background-color", "#b3b3b3");
  });
  $("#cards span").each(function(i) {
    $(this).css("background-color", "#b3b3b3");
  });
  $("#card1 p").text(policyCards[0]);
  $("#card2 p").text(policyCards[1]);
  $("#card3 p").text(policyCards[2]);
  $("#card1").show();
  $("#card2").show();
  $("#card3").show();
  $("#cards").fadeIn();

  $("#action_button").text("Continue!").fadeIn().one("click", function() {
    $("#card1").hide();
    $("#card2").hide();
    $("#card3").hide();
    $("#cards").fadeOut();
    selectPresident();
  });
}

function presidentExamines() {
  if (cpresidentExamines > 0) {
    selectPresident();
  } else {
    cpresidentExamines++;
    $("#instructions").html("The President now has the power to view the \
      next 3 cards!<br />");

    $("#action_button").text("Show cards!").fadeIn().one("click", function() {
      showNext3Cards();
    });
  }
}

function presidentBullet(veto) {
  if (cpresidentBullet > 1) {
    selectPresident();
  } else {
    cpresidentBullet++;
    vetoPower = veto;
    $("#instructions").html("The President now has the power to execute another \
      player!<br />Ask the player for their number, \
      and select that number in the menu below");

    $("#player_select").append("<select>");
    for (var i = 0; i < numPlayers; i++) {
      if (removedPlayers.indexOf(i) == -1) { // if the player is NOT removed
        $("#player_select select").append("<option value = '" + (i+1) + "'>" +
          (i+1) + "</option>");
      }
    }
    $("#player_select").append("</select>").fadeIn();

    $("#action_button").text("Execute the selected player!").fadeIn();
    $("#action_button").off("click").one("click", function() {
      var theNum=parseInt($("#player_select select").find(":selected").text())-1;
      // console.log(theNum);
      removedPlayers.push(theNum);
      if (allRoles[theNum] == 'Hitler') {
        liberalsWin(); return;
      }
      $("#player_select").empty();
      $("#action_button").fadeOut();
      selectPresident();
    });
  }
}

function revealPlayerParty(player) {
  $("#instructions").fadeOut();
  $("#secret_text").html("That player is a <span class = 'role'>"
    + getParty(allRoles[player]) + "</span>");
  latchTimer("#timer", 5, function(){
    $("#secret_text").fadeOut();
    selectPresident();
  });
}

function presidentInvestigatePlayer() {
  if (cpresidentInvestigatePlayer > 0) {
    selectPresident();
  } else {
    cpresidentInvestigatePlayer++;
    $("#instructions").html("The President now has the power to examin a \
      player's role!<br />Ask the player for their number, \
      and select that number in the menu below");

    $("#player_select").append("<select>");
    for (var i = 0; i < numPlayers; i++) {
      if (removedPlayers.indexOf(i) == -1) { // if the player is NOT removed
        $("#player_select select").append("<option value = '" + (i+1) + "'>" +
          (i+1) + "</option>");
      }
    }
    $("#player_select").append("</select>").fadeIn();

    $("#action_button").text("Find the party of selected player!").fadeIn();
    $("#action_button").one("click", function() {
      console.log(parseInt($("#player_select select").find(":selected").text()));
      revealPlayerParty(
        parseInt($("#player_select select").find(":selected").text())-1);
      $("#player_select").empty();
    });
  }
}

function makeNextPresident(president) {
  returnPresident = president;
  selectPresident();
}

function presidentPicksPresident() {
  if (cpresidentPicksPresident > 0) {
    selectPresident();
  } else {
    cpresidentPicksPresident++;
    $("#instructions").html("The President now has the power to pick the \
      next President!<br />Ask the player for their number, \
      and select that number in the menu below");

    $("#player_select").append("<select>");
    for (var i = 0; i < numPlayers; i++) {
      if (removedPlayers.indexOf(i) == -1) { // if the player is NOT removed
        $("#player_select select").append("<option value = '" + (i+1) + "'>" +
          (i+1) + "</option>");
      }
    }
    $("#player_select").append("</select>").fadeIn();

    $("#action_button").text("Make the player the next President").fadeIn();
    $("#action_button").one("click", function() {
      console.log(parseInt($("#player_select select").find(":selected").text()));
      makeNextPresident(
        parseInt($("#player_select select").find(":selected").text())-1);
      $("#player_select").empty();
    });
  }
}

function checkForPowerup() {
  // first, recycle the card not passed
  $("#cards span").each(function(i) {
    if ($(this).css("background-color") == "rgb(179, 179, 179)" && $(this).is(":visible")) {
      console.log("removing  " + $(this).text());
      recyclePolicyCards.push($(this).text()); // recycle the card
      // console.log("hidden");
      console.log(recyclePolicyCards);
      // console.log(policyCards);
    } else if ($(this).is(":visible")) {  // passed this card
      if ($(this).text() == "Facist") {
        passedFacists++;
      } else {
        passedLiberals++;
      }
    }
  });
  $("#cards").fadeOut();

  if (passedLiberals >= 6) {
    liberalsWin(); return;
  }

  if (passedFacists == 6) {
    facistsWin(); return;
  }

  // determine if a powerup should be applied
  if (numPlayers <= 6) {
    if (passedFacists == 3) {
      presidentExamines(); return;
    } else if (passedFacists == 4) {
      hitlerTerritory = true;
      presidentBullet(false); return;
    } else if (passedFacists == 5) {
      presidentBullet(true); return;
    }
  } else if (numPlayers <= 8) {
    if (passedFacists == 2) {
      presidentInvestigatePlayer(); return;
    } else if (passedFacists == 3) {
      presidentPicksPresident(); return;
    } else if (passedFacists == 4) {
      hitlerTerritory = true;
      presidentBullet(false); return;
    } else if (passedFacists == 5) {
      presidentBullet(true); return;
    }
  } else {
    if (passedFacists == 1) {
      presidentInvestigatePlayer(); return;
    } else if (passedFacists == 2) {
      presidentInvestigatePlayer(); return;
    } else if (passedFacists == 3) {
      presidentPicksPresident(); return;
    } else if (passedFacists == 4) {
      hitlerTerritory = true;
      presidentBullet(false); return;
    } else if (passedFacists == 5) {
      presidentBullet(true); return;
    }
  }
  selectPresident();
}

function flipTheTopCard() { // if 3 unsuccessful elections in a row
  $("#instructions").text("Country in chaos!! The card below should be added \
    to the board at this time!");
  $("#card2").hide();
  $("#card3").hide();
  $("#card1 p").text(policyCards.shift()).show();
  $("#cards").fadeIn();
  if ($("#card1 p").text() == "Facist") {
    passedFacists++;
  } else {
    passedLiberals++;
  }
  latchTimer("#timer", 15, function(){ numConsecFails = 0;
    $("#cards").fadeOut() ;selectPresident(); });
}

function chancellorPresentCards() {
  $("#action_button").text("Select the card you placed");
  $("#cards").fadeIn();
  $("#instructions").html("Chancellor, place tile on the board for the card \
    you choose to pass (<span class='role'>must be one of the 2 cards you \
    see below</span>).<br />Select the card you placed on the board, and then \
    press Continue!");

  if (vetoPower) {
    $("#instructions").append("<br />Veto power is enabled. If you don't want\
      to pass these actions, ask the President to veto the action. If they \
      agree, you may press the Veto! button below and not pass any actions.");
    $("action_button2").text("Veto!").one("click", function() {
      numConsecFails++;
      // TODO anything more?
    }).fadeIn();
  }

  $("#cards span").click(function() {
    // console.log($(event.target).css("background-color"));
    if ($(event.target).css("background-color") != "rgb(179, 179, 179)") {
      $("#" + event.target.id).css("background-color", "#b3b3b3");
      $("#" + event.target.id + " p").css("background-color", "#b3b3b3");
    } else {
      $("#" + event.target.id).css("background-color", "#cccccc");
      $("#" + event.target.id + " p").css("background-color", "#cccccc");
    }
    var q = 0;
    $("#cards span p").each(function(i) {
      if ($(this).css("background-color") != "rgb(179, 179, 179)") {
        q++;  // increment if the card IS selected
      }
    });
    // console.log(q);
    if (q != 1) {
      $("#action_button").text("Select the card you placed");
      $("#action_button").off("click");
    } else {
      $("#action_button").text("Continue!");
      $("#action_button").off("click").one(
        "click", function() { checkForPowerup(); });
    }
  });
}

function cardsSelected() {
  $("#cards span").off("click");
  $("#cards span").each(function(i) { // hide the card not selected
    if ($(this).css("background-color") == "rgb(179, 179, 179)") {
      $(this).hide();
      console.log("removing  " + $(this).text());
      recyclePolicyCards.push($(this).text()); // recycle the card
      // console.log("hidden");
      // console.log(recyclePolicyCards);
      // console.log(policyCards);
    }
  });
  $("#cards span p").each(function(i) { // change the color back to normal
    $(this).css("background-color", "#b3b3b3");
  });
  $("#cards span").each(function(i) {
    $(this).css("background-color", "#b3b3b3");
  });
  $("#action_button").fadeOut();
  $("#cards").fadeOut();
  $("#instructions").html("Pass the phone to your Chancellor.<br />Chancellor, \
    click Continue! when you are ready to see the cards.<br /><span class = '\
    role'>Keep these cards hidden!</span>");
  $("#action_button").text("Continue!").fadeIn();
  $("#action_button").one("click", function() { chancellorPresentCards(); });
}

function presentCards() {
  // assign card values
  if (policyCards.length < 3) {
    for (var i = 0; i < policyCards.length; i++) {
      recyclePolicyCards.push(policyCards.shift());
    }
    policyCards = randomizeCards(recyclePolicyCards);
    recyclePolicyCards = [];
    console.log("shuffled cards");
    console.log(policyCards);
    console.log(recyclePolicyCards);
  }
  $("#card1 p").text(policyCards.shift());
  $("#card2 p").text(policyCards.shift());
  $("#card3 p").text(policyCards.shift());

  $("#card1").show();
  $("#card2").show();
  $("#card3").show();

  $("#action_button").fadeOut(function() {
    $("#action_button").text("Select 2 cards").fadeIn(function() {
      $("#cards").fadeIn();
    });
  });
  $("#cards span").click(function() {
    // console.log($(event.target).css("background-color"));
    if ($(event.target).css("background-color") != "rgb(179, 179, 179)") {
      $("#" + event.target.id).css("background-color", "#b3b3b3");
      $("#" + event.target.id + " p").css("background-color", "#b3b3b3");
    } else {
      $("#" + event.target.id).css("background-color", "#cccccc");
      $("#" + event.target.id + " p").css("background-color", "#cccccc");
    }
    var q = 0;
    $("#cards span p").each(function(i) {
      if ($(this).css("background-color") != "rgb(179, 179, 179)") {
        q++;  // increment if the card IS selected
      }
    });
    // console.log(q);
    if (q != 2) {
      $("#action_button").text("Select 2 cards");
      $("#action_button").off("click");
    } else {
      $("#action_button").text("Use these 2 cards");
      $("#action_button").one("click", function() { cardsSelected(); });
    }
  });

}

function cardInstructions() {
  $("#action_button2").fadeOut();
  $("#action_button").text("Show the cards!").fadeIn();
  $("#cards span p").each(function(i) {
    $(this).css("background-color", "#b3b3b3").off("click");
  });
  $("#cards span").each(function(i) {
    $(this).css("background-color", "#b3b3b3").off("click");
  });
  $("#instructions").html("<span class = 'role'>Ensure the President has \
    the phone!</span><br />You will now be presented with 3 cards. Chose 2 of \
    the cards to pass to your Chancellor.<br /><span class='role'>This should \
    all be done in secret! Do not reveal the card you did not select!</span>");
  $("#action_button").off("click").one("click", function() { presentCards(); });
}

function isHitler() {
  if (hitlerTerritory) {
    $("#instructions").text("Is the Chancellor elect Hitler?");
    $("#action_button").text("Yes").fadeIn();
    $("#action_button2").text("No").fadeIn();
    $("#action_button").one("click", function() { facistsWin(); return; });
    $("#action_button2").one("click", function() { cardInstructions(); });
  } else {
    cardInstructions();
  }
}

function voteChancellor() {
  $("#instructions").html("The public must now vote on the nomination.<br /> \
    After deliberation, vote with your thumbs up (yay!) or down (nay!) on the \
    count of 3.<br /><br />Once the vote has been tallied, click Continue! if \
    the nomination was approved, and Veto! if the nomination was struck down.");
  $("#action_button").text("Approve!").fadeIn();
  $("#action_button2").text("Veto!").fadeIn();
  $("#action_button").one("click", function() {
    $("#action_button2").off('click').fadeOut();
    numConsecFails = 0;
    isHitler();
  });
  $("#action_button2").one("click", function() { //veto
    $("#action_button").off('click').fadeOut();
    $("#action_button2").fadeOut(function() {
      selectPresident(); numConsecFails++;
      if (numConsecFails >= 3) {
        flipTheTopCard();
      }
    });
  });
}

function election() {
  $("#instructions").html("The President must now nominate a Chancellor. \
    Be sure the player is eligible (not the last elected).\
    <br />Once a Chancellor has been nominated, press Continue!");
  $("#action_button").text("Continue!").fadeIn();
  $("#action_button").one("click", function() { $("#action_button").fadeOut(
    function () { voteChancellor(); }); });
}

function selectPresident() {
  $("#action_button").fadeOut();
  if (returnPresident > 0) {
    var tmp = currentPresident;
    currentPresident = returnPresident-1;
    returnPresident = -tmp;
  } else if (returnPresident < 0) {
    currentPresident = -returnPresident;
    returnPresident = 0;
  }
  if (currentPresident >= numPlayers-1) {
    currentPresident = 0;
  } else {
    currentPresident++;
  }
  if (removedPlayers.indexOf(currentPresident) != -1) { // if the player is gone
    selectPresident();  // recurse, get it to increment again
  }
  $("#instructions").html("Player " + (currentPresident+1) + " is President!\
    <br />Pass them the phone now.").fadeIn();
  latchTimer("#timer", 10, function() { election() });
}

function latchTimer(el, startingTime, callback) {
  $(el).text(startingTime);
  window.setTimeout(function() { updateTime(el, callback) }, 1000);
}

function updateTime(el, callback) {
  curr_time = parseInt($(el).text());
  if (curr_time <= 0) {
    callback();
  } else {
    $(el).text(curr_time - 1);
    window.setTimeout(function() { updateTime(el, callback) }, 1000);
  }
}

function giveRoles() {
  $("#secret_text").text(" ");
  if (currentPlayer < numPlayers) {
    $("#instructions").text("Player " + (currentPlayer+1)
      + ", get readyfor your role!");
    // latchTimer("#timer", 2, function() { displayRole() });
    $("#action_button").text("Reveal your role!").fadeIn();
    $("#action_button").one("click", function() { displayRole(); });
  } else {
    $("#secret_text").text(" ");
    if (numPlayers <= 6) {
      $("#instructions").html("Place the phone in the center. \
        Everbody close your eyes.<br />\
        Player 1, instruct the Facist AND Hitler open their eyes.<br />\
        After 10 seconds, everyone should close their eyes again, and then \
        open their eyes to start the game.");
      $("#action_button").text("Begin!").fadeIn();
      $("#action_button").one("click", function() { selectPresident(); });
    } else {
      $("#instructions").text("Place the phone in the center. Everbody \
        close your eyes.<br />Player 1, instruct the Facists (but NOT Hitler) \
        to open their eyes.<br />After 10 seconds, Hitler should stick their \
        thumb up.<br/>After 10 seconds, everyone should put their thumbs away, \
        close their eyes, and then open to begin the game.");
      $("#action_button").text("Begin!").fadeIn();
      $("#action_button").one("click", function() { selectPresident(); });
    }
  }
}

function displayRole() {
  // display the secret role
  $("#action_button").fadeOut(function() {
    $("#secret_text").html("Your secret role is <span class = 'role'>" +
      allRoles[currentPlayer] + "</span><br />Your party affiliation is \
      <span class = 'role'>" + getParty(allRoles[currentPlayer]) + "</span>");
  });
  latchTimer("#timer", 5, function() { currentPlayer++; giveRoles() });
}

function getParty(role) {
  if (role == "Hitler" || role == "Facist") {
    return "Facist";
  }
  return "Liberal";
}

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function randomizeCards(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function beginGame() {
  // hide loading screen and show gameplay screen
  if (begun == false) {
    begun = true;
    numPlayers = parseInt($("#player_count").find(":selected").text());
    currentPresident = Math.floor(Math.random() * numPlayers)+1;
    // determine player allocations
      // 5/6 = 1 facist and Hitler
      // 7/8 = 2 facist and Hitler
      // 9/10 = 3 facist and Hitler
    if (numPlayers <= 6) {
      allRoles = ['Hitler', 'Facist'];
    } else if (numPlayers <= 8) {
      allRoles = ['Hitler', 'Facist', 'Facist'];
    } else {
      allRoles = ['Hitler', 'Facist', 'Facist', 'Facist'];
    }
    numFacists = allRoles.length - 1;
    for (var i = allRoles.length; i < numPlayers; i++) {
      allRoles.push("Liberal");
    }
    // console.log(allRoles);
    allRoles = randomizeCards(allRoles);
    policyCards = randomizeCards(policyCards);
    console.log(allRoles);
    console.log(policyCards);

    $("#load").fadeOut(function() {
      $("#instructions").html("The game is about to begin! There "
        + ((numFacists > 1) ? "are" : "is") + " <span class = 'role'>"
        + numFacists + " facist" + ((numFacists > 1) ? "s" : "")
        + "</span>. Please hand the phone to the first player!");
      $("#game").fadeIn();
    });
    latchTimer("#timer", 10, function() { giveRoles(); });
  }
}

$(document).ready(function() {
  $("#play_game").click(beginGame);
});
