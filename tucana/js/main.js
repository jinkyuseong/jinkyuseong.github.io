const CONTENT = 'tucana';

class CardList {
  constructor() {
    this.cards = {};
    this.cardsLength = 0;
    this.order = [];
  }

  add(cardInfo) {
    let card = {
      'fileName': cardInfo.fileName,
    }
    card.used = false;
    this.cards[this.cardsLength] = card;
    this.order.push(this.cardsLength);
    this.cardsLength++;
  }

  getCards(pivot, count) {
    let ret = [];
    for (let i = 0;i < count; i++) {
      if (this.cards[this.order[pivot]]) {
        ret.push(this.cards[this.order[pivot]] );
      }
      pivot++;
    }
    return ret;
  }

  setUsed(id) {
    this.cards[id].used = true;
  }

  getUsed(id) {
    return this.cards[id].used;
  }

  // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  shuffle(){
    console.log('before:', this.order);
    var count = this.order.length,
       randomnumber,
       temp;
    while( count ){
    randomnumber = Math.random() * count-- | 0;
    temp = this.order[count];
    this.order[count] = this.order[randomnumber];
    this.order[randomnumber] = temp
    }
    console.log('after:', this.order);
  }
}

class Card {
  constructor(props) {
    this.id = props.id;
  }
}

const cardList = new CardList();
var manifest;
var current = 0;
let allCount;

function loadManifest(content) {
  let manifestPath = `${content}/manifest.json`;
  fetch(manifestPath)
    .then(response => response.json())
    .then(json => startMain(json));
}

function startMain(manifestIn) {
  manifest = manifestIn;
  allCount = manifest.countY * manifest.countX;
  buildCards(manifest);
  cardList.shuffle();
  updateTable();
}

function buildCards(manifest) {
  let cardsType = manifest.cardsType;
  let imageExt = manifest.imageExt;

  switch (cardsType) {
    case "specific":
      // "name" * num
      let cards = manifest.cards;

      for (let card of cards) {
        for (let name in card) {
          let count = card[name];
          for (let i = 0; i < count; i++) {
            cardList.add( { fileName: `${CONTENT}/img/${name}.${imageExt}` } );
          }
        }
      }
      break;
    case "sequential":
      // img-1 * num, img-2 * num
      break;
  }

  console.log(cardList);
}

function updateTable() {
  let table = $("#mainTable");
  let tr;

  let td;
  let img;

  let cards = cardList.getCards(current, allCount);
  console.log(cards);
  if (cards.length < allCount )
    return false;

  table.empty();

  let piv = 0;
  for (let y = 0; y < manifest.countY; y++) {
    tr = $("<tr></tr>");
    table.append(tr);
    for (let x = 0; x < manifest.countX; x++) {
      td = $("<td></td>");
      img = $(`<img src="${cards[piv].fileName}"></img>`);
      td.append(img);
      tr.append(td);
      piv++;
    }
  }
  return true;
}

function next() {
  current = current + allCount;
  if (updateTable() === false) {
    current = current - allCount;
  }
}


function prev() {
  current = current - allCount;
  if (updateTable() === false) {
    current = current + allCount;
  }
}

loadManifest(CONTENT);
