// Create global variables and constants

const listOfCards = document.querySelectorAll('.card');
const deck = document.querySelector('.deck');
const timer = document.querySelector('.timer');
const stars = document.querySelectorAll('.fa-star');

let counter = 0;
let time = 0;
let starRating = 3;
let openCards = [];
let countOpenCards;
let countMatchedCards;

// "shuffle" method provided in advance

function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//  Create deck with shuffled cards + basic functionality

function createDeck(){

    let newDeck = shuffle(Array.from(listOfCards));

    newDeck.forEach(function(card){
        document.querySelector('.deck').appendChild(card);
    });

    deck.addEventListener('click', clickHappened);
    startTimer();
}

createDeck();

// Create restart button logic
function restartGame() {
    stopTimer();
    createDeck();
    resetStats();
    resetDeck();
}

// Create event listener on restart button
document.querySelector('.restart').addEventListener('click', restartGame);

// Behavior for when card is clicked
function clickHappened(e){

    if (e.target.classList.contains('card') && e.target.classList.contains('open') === false){
        incrementCounter();
        e.target.classList.toggle('show');
        e.target.classList.toggle('open');
        updateOpenCards();

// Check if there are two open cards
        if (countOpenCards === 2) {

// Check if open cards match
            if (openCards[0].innerHTML === openCards[1].innerHTML) {
                cardsMatch();

// Check if all cards have been matched
                if (countMatchedCards === 16) {
                    congratulations();
                }

// Basic functionality if two open cards don't match
            } else {
                cardsDontMatch();
            }
        }
    }
}

//  Count matched cards
function updateMatchedCards(){
    countMatchedCards = document.querySelectorAll('li.match').length;
}

// Count open cards
function updateOpenCards(){
    openCards = document.querySelectorAll('li.show');
    countOpenCards = openCards.length;
}

// Functions for each possible outcome of open cards

function turnToMatch(card){
    card.classList.toggle('match');
    card.classList.toggle('show');
    updateMatchedCards();
}

function cardsMatch(){
    turnToMatch(openCards[0]);
    turnToMatch(openCards[1]);
}

function turnToClose(card){
    card.classList.remove('open');
    card.classList.remove('show');
    card.classList.remove('wrong');
    card.classList.remove('match');
}

function resetCards(){
    turnToClose(openCards[0]);
    turnToClose(openCards[1]);
}

function turnToWrong(card){
    card.classList.toggle('wrong');
    card.classList.toggle('show');
}

function resetDeck(){
    listOfCards.forEach(turnToClose);
}

// Behavior for when cards don't match

function cardsDontMatch(){
    turnToWrong(openCards[0]);
    turnToWrong(openCards[1]);

// Make it impossible to click card that has been opened (wrong cards)
    deck.removeEventListener('click', clickHappened);

// Set delay for user feedback on wrong match
    setTimeout(function(){
        deck.addEventListener('click', clickHappened);
        resetCards();
        openCards = [];
    }, 500);
}

// Count number of moves
function incrementCounter(){
    counter++;
    document.querySelector('.moves').innerText = counter;

// Make number of stars dinamic according to number of moves. Logic = each "turn" around the deck costs one star
    function updateStars(){
        if (counter === 17) {
            stars[0].style.display = 'none';
            starRating--;
        } else if (counter === 33) {
            stars[1].style.display = 'none';
            starRating--;
        } 
    }

    updateStars();
}

// Congratulations modal
function congratulations() {
    toggleModal();
    resetDeck();
    stopTimer();

// Stats in congratulations modal
    document.querySelector('.modal__time').innerHTML = "Time: " + timer.innerHTML;
    document.querySelector('.modal__stars').innerHTML = "Stars: " + starRating;
    document.querySelector('.modal__moves').innerHTML = "Moves: " + counter;

// Buttons in congratulations modal
    document.querySelector('.modal__replay').addEventListener('click', replayGame);
    document.querySelector('.modal__reset').addEventListener('click', resetGame);
}

// Function for modal to appear
function toggleModal(){
    document.querySelector('.modal__background').classList.toggle('hide');
}

// Create logic for reset button on modal
function resetGame() {
    createDeck();
    resetStats();
    toggleModal();
}

// Create logic for replay button on modal
function replayGame(){
    resetStats();
    toggleModal();
    startTimer();
}

// Function to reset game stats
function resetStats(){
    counter = 0;
    document.querySelector('.moves').innerText = counter;
    stars[0].style.display = 'block';
    stars[1].style.display = 'block';
    stars[2].style.display = 'block';
}

// Functions to support timer Behavior (start & stop)

function startTimer() {
    time = 0;
    timerId = setInterval(function() {
        time++;
        let mins = Math.floor(time / 60);
        let secs = time % 60;
        timer.innerHTML = mins + ":" + ('0' + secs).slice(-2);
    }, 1000);
}

function stopTimer() {
    clearInterval(timerId);
}
