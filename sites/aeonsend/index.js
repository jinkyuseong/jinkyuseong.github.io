var CARDS = {};
const gems_original = {
  2: ['옥'],
  3: ['브리스우드 호박', '체로 거른 진주', '흡혈 마노'],
  4: ['금강석 집괴', '달아오른 루비'],
  5: ['이글거리는 오팔', '밀어내는 토파즈'],
  6: ['탁한 사파이어'],
};
const artifacts_original = {
  2: ['굽은 단검'],
  3: ['병 속의 소용돌이', '불안정한 분광기'],
  4: ['폭파 지팡이', '형상 변형체', '집중의 구체', '활력 생성기'],
  5: ['마법사의 부적', '용해의 망치'],
  7: ['시간의 나선', '용해의 망치'],
};
const spells_original = {
  3: ['불사조의 화염', '스펙트럼 투영'],
  4: ['형상 증강', '용암 촉수', '발화', '불길', '공허의 결속'],
  5: ['날뛰는 번개', '검은 불꽃', '망각 증대', '정수 절취', '연소'],
  6: ['예지의 번개', '차원 통찰', '불길에 잠식되다', '혼돈의 전호', '집어삼키는 그림자', '들불 채찍'],
  7: ['현자의 낙인', '모조리 삼키는 공허', '비술 교차점', '분해하는 낫'],
  8: ['괴물 같은 염화', '찬란한 빛'],
};

CARDS.a = {};
CARDS.s = {};
CARDS.g = {};

function appendCards(cards, kind) {
  for (let index in cards) {
    if (!CARDS[kind][index])
      CARDS[kind][index] = [];
    CARDS[kind][index] = CARDS[kind][index].concat(cards[index]);
  }
}
appendCards(artifacts_original, 'a');
appendCards(spells_original, 's');
appendCards(gems_original, 'g');

const RANDOMS = {
  1: {
    g: [[1, 2, 3], [4], []],
    a: [[], []],
    s: [
      [1, 2, 3, 4],
      [1, 2, 3, 4],
      [6, 7, 8],
      [6, 7, 8],
    ],
  },
  2: {
    g: [
      [4, 5, 6, 7, 8],
      [4, 5, 6, 7, 8],
      [4, 5, 6, 7, 8],
    ],
    a: [[5, 6, 7, 8], []],
    s: [
      [1, 2, 3, 4, 5],
      [1, 2, 3, 4, 5],
      [1, 2, 3, 4, 5],
      [7, 8],
    ],
  },
  3: {
    g: [
      [1, 2, 3],
      [4, 5],
      [4, 5],
    ],
    a: [[]],
    s: [[3], [4], [1, 2, 3, 4], [6, 7, 8], [6, 7, 8]],
  },
  4: {
    g: [[5, 6, 7, 8], [], []],
    a: [[1, 2, 3], [5, 6, 7, 8], []],
    s: [[1, 2, 3, 4], [6, 7, 8], []],
  },
  5: {
    g: [[2], [3], [4], [5]],
    a: [[]],
    s: [[4], [5], [6], [7, 8]],
  },
  6: {
    g: [[3], [4]],
    a: [[1, 2, 3], [5, 6, 7, 8], []],
    s: [
      [3, 4],
      [5, 6],
      [5, 6],
      [7, 8],
    ],
  },
};

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

var randomR = 1;
var chosen = [];

function run() {
  chosen = [];
  //console.log(randomR);
  let random = RANDOMS[randomR];
  let copies = JSON.parse(JSON.stringify(CARDS));
  let result = '';
  for (let kind in random) {
    for (let cardsIndex in random[kind]) {
      // [3], [4]
      let price = 0;
      let errorcount = 0;
      while(price == 0) {
        if (random[kind][cardsIndex].length == 1) {
            price = random[kind][cardsIndex][0];
        } else {
          let max = random[kind][cardsIndex].length;
          if (max == 0) {
            max = 8;
            random[kind][cardsIndex] = [1,2,3,4,5,6,7,8];
          }
          price = random[kind][cardsIndex][getRandomInt(max)];
        }
        //console.log( `${cardsIndex}: `, random[kind][cardsIndex], price, copies[kind][price]);
        if (!copies[kind][price]) {
          //console.log('before:', random[kind][cardsIndex]);
          random[kind][cardsIndex].splice(random[kind][cardsIndex].indexOf(price), 1)
          //console.log('after:', random[kind][cardsIndex]);
          price = 0;
          // errorcount += 1;
          // if (errorcount > 3)
          //   throw 'error!';
          continue;
        } else {
          if (!price) {
            throw 'error: price == 0';
          }
        }
        if (!copies[kind][price] || copies[kind][price].length == 0) {
            price = 0;
        } else {
            // console.log( kind, price, 'before', copies[kind][price]);
            result = copies[kind][price].splice(getRandomInt(copies[kind][price].length), 1)[0];
            //console.log( result, copies[kind][price]);
        }
      }
      chosen.push( { kind, price, result });
      result = '';
    }
  }
  printResult();
}
//-----------------------------------------------------------------------------------

function printResult() {
  let result = document.getElementById('result');
  result.innerHTML = '';

  for (let item of chosen) {
    let span = document.createElement('span');
    span.innerText = `[${item.price}] ${item.result}`;
    span.setAttribute('class', item.kind)
    result.appendChild(span);
    result.appendChild(document.createElement('br'));
  }

  console.log(`random-${randomR}`);
  console.log(chosen, '\n');
}

window.onload = () => {
  let radios = document.getElementById('radios');
  for (let id = 1; id < 7; id++) {
    let radio = document.createElement("input");
    radio.setAttribute("type", "radio");
    radio.setAttribute("name", "random_number");
    radio.setAttribute("id", `radio${id}`);
    radio.setAttribute("value", id);
    radio.addEventListener('change', function() { randomR = this.value; });
    radios.appendChild(radio);

    let label = document.createElement("label");
    label.setAttribute("for", `radio${id}`);
    label.innerText = `random-${id}`;
    radios.appendChild(label);

    radios.appendChild(document.createElement("br"));
  }
}
