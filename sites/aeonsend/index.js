var CARDS = {};
// original

const ALLCARDS = {};
ALLCARDS['original'] = {
  gems: {
    2: ['옥'],
    3: ['브리스우드 호박', '체로 거른 진주', '흡혈 마노'],
    4: ['금강석 집괴', '달아오른 루비'],
    5: ['이글거리는 오팔', '밀어내는 토파즈'],
    6: ['탁한 사파이어'],
  },
  relics: {
    2: ['굽은 단검'],
    3: ['병 속의 소용돌이', '불안정한 분광기'],
    4: ['폭파 지팡이', '형상 변형체', '집중의 구체', '활력 생성기'],
    5: ['마법사의 부적', '용해의 망치'],
    7: ['시간의 나선'],
  },
  spells: {
    3: ['불사조의 화염', '스펙트럼 투영'],
    4: ['형상 증강', '용암 촉수', '발화', '불길', '공허의 결속'],
    5: ['날뛰는 번개', '검은 불꽃', '망각 증대', '정수 절취', '연소'],
    6: ['예지의 번개', '차원 통찰', '불길에 잠식되다', '혼돈의 전호', '집어삼키는 그림자', '들불 채찍'],
    7: ['현자의 낙인', '모조리 삼키는 공허', '비술 교차점', '분해하는 낫'],
    8: ['괴물 같은 염화', '찬란한 빛'],
  },
};
ALLCARDS['war_eternal'] = {
  gems: {
    3: ['불길한 베릴라이트', '풍뎅이 화석', '공포스러운 금강석', '동결된 마그나이트', '화산 유리'],
    4: ['화산재 슬래그', '외계 물질', '균열 광석'],
    5: ['괴의한 주괴'],
    6: ['고통의 돌', '혈석 보석'],
  },
  relics: {
    2: ['마법사의 토템'],
    3: ['악마 포획기', '수수께끼 구체', '콘클라베의 두루마리', '영원의 부적'],
    4: ['길잡이 나침반', '원시적 숭배물'],
    5: ['별의 입방체'],
    6: ['소용돌이 건틀렛'],
    8: ['차원 열쇠'],
  },
  spells: {
    2: ['내면의 불길'],
    3: ['사역마 구현', '대화재'],
    4: ['염화 쇄도', '불꽃 촉발', '굽이치는 번개', '탄화', '고열 화살'],
    5: ['태우기', '반응성 오라', '몰아치는 불덩이', '대류장 제어', '창공의 첨탑', '서광', '격렬한 폭발'],
    6: ['전투 촉매', '신성 연마', '잃은 것 소환', '공명'],
    7: ['화염술', '지하의 전송로', '재로 돌리기', '평형'],
    8: ['경질화', '소각'],
  },
};
// war eternal

function appendCards(wave) {
  for (let kind in wave) {
    for (let index in wave[kind]) {
      //console.log(kind, index, wave[kind][index]);
      if (!CARDS[kind][index]) CARDS[kind][index] = [];
      CARDS[kind][index] = CARDS[kind][index].concat(wave[kind][index]);
    }
  }
}

var gWave = {};
function buildCards() {
  CARDS = {};
  CARDS.gems = {};
  CARDS.relics = {};
  CARDS.spells = {};

  for (let w in gWave) {
    if (!!gWave[w]) {
      appendCards(ALLCARDS[w])
    }
  }
}

const RANDOMS = {
  1: {
    gems: [[1, 2, 3], [4], []],
    relics: [[], []],
    spells: [
      [1, 2, 3, 4],
      [1, 2, 3, 4],
      [6, 7, 8],
      [6, 7, 8],
    ],
    titles: {
      gems: ['<4', '4', '?'],
      relics: ['?', '?'],
      spells: ['<5', '<5', '>5', '>5'],
    },
  },
  2: {
    gems: [
      [4, 5, 6, 7, 8],
      [4, 5, 6, 7, 8],
      [4, 5, 6, 7, 8],
    ],
    relics: [[5, 6, 7, 8], []],
    spells: [
      [1, 2, 3, 4, 5],
      [1, 2, 3, 4, 5],
      [1, 2, 3, 4, 5],
      [7, 8],
    ],
    titles: {
      gems: ['>3', '>3', '>3'],
      relics: ['>4', '?'],
      spells: ['<6', '<6', '<6', '>6'],
    },
  },
  3: {
    gems: [
      [1, 2, 3],
      [4, 5],
      [4, 5],
    ],
    relics: [[]],
    spells: [[3], [4], [1, 2, 3, 4], [6, 7, 8], [6, 7, 8]],
    titles: {
      gems: ['<4', '4/5', '4/5'],
      relics: ['?'],
      spells: ['3', '4', '<5', '>5', '>5'],
    },
  },
  4: {
    gems: [[5, 6, 7, 8], [], []],
    relics: [[1, 2, 3], [5, 6, 7, 8], []],
    spells: [[1, 2, 3, 4], [6, 7, 8], []],
    titles: {
      gems: ['>4', '?', '?'],
      relics: ['<4', '>4', '?'],
      spells: ['<5', '>5', '?'],
    },
  },
  5: {
    gems: [[2], [3], [4], [5]],
    relics: [[]],
    spells: [[4], [5], [6], [7, 8]],
    titles: {
      gems: ['2', '3', '4', '5'],
      relics: ['?'],
      spells: ['4', '5', '6', '7/8'],
    },
  },
  6: {
    gems: [[3], [4]],
    relics: [[1, 2, 3], [5, 6, 7, 8], []],
    spells: [
      [3, 4],
      [5, 6],
      [5, 6],
      [7, 8],
    ],
    titles: {
      gems: ['3', '4'],
      relics: ['<4', '>4', '?'],
      spells: ['3/4', '5/6', '5/6', '7/8'],
    },
  },
};

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

var randomR = 1;
var chosen = [];

function run() {
  let waveSelected = false;
  for (let x in gWave) {
    waveSelected |= !!gWave[x];
  }
  if (!waveSelected) {
    return;
  }
  chosen = [];
  //console.log(randomR);
  let random = RANDOMS[randomR];
  let copies = JSON.parse(JSON.stringify(CARDS));
  let result = '';
  for (let kind in random) {
    if (kind === 'titles') continue;
    for (let cardsIndex in random[kind]) {
      // [3], [4]
      let price = 0;
      let errorcount = 0;
      while (price == 0 && errorcount < 50) {
        errorcount += 1;
        if (random[kind][cardsIndex].length == 1) {
          price = random[kind][cardsIndex][0];
        } else {
          let max = random[kind][cardsIndex].length;
          if (max == 0) {
            max = 8;
            random[kind][cardsIndex] = [1, 2, 3, 4, 5, 6, 7, 8];
          }
          price = random[kind][cardsIndex][getRandomInt(max)];
        }
        //console.log(copies, kind, price);
        if (!copies[kind][price]) {
          //console.log('before:', random[kind][cardsIndex]);
          random[kind][cardsIndex].splice(random[kind][cardsIndex].indexOf(price), 1);
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
      chosen.push({ kind, price, result });
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
    span.setAttribute('class', `${item.kind} result`);
    result.appendChild(span);
    result.appendChild(document.createElement('br'));
  }

  console.log(`random-${randomR}`);
  console.log(chosen);
}

function addWaveCheckbox(box, name, checked) {
  let checkbox = document.createElement('input');
  checkbox.setAttribute('type', 'checkbox');
  checkbox.setAttribute('name', name);
  checkbox.setAttribute('id', `wave_${name}`);
  checkbox.addEventListener('change', function () {
    if(this.checked)
      gWave[name] = 1;
    else
      gWave[name] = 0;
    console.log(this.checked, gWave);
    buildCards();
  });

  label = document.createElement('label');
  label.setAttribute('for', `wave_${name}`);
  label.innerText = name;
  box.appendChild(checkbox);
  box.appendChild(label);
  checked && checkbox.click();
}

window.onload = () => {
  // build wave menu
  let waves = document.getElementById('waves_box');
  addWaveCheckbox(waves, 'original');
  addWaveCheckbox(waves, 'war_eternal', true);

  let random_numbers = document.getElementById('random_numbers');

  radio = document.createElement('input');
  radio.setAttribute('type', 'radio');
  radio.setAttribute('name', 'random_number');
  radio.setAttribute('id', `random`);
  radio.addEventListener('change', function () {
    randomR = getRandomInt(6) + 1;
    setTimeout(() => {
      document.getElementById(`radio${randomR}`).click();
    });
  });
  random_numbers.appendChild(radio);
  label = document.createElement('label');
  label.setAttribute('for', `random`);
  label.innerText = `random`;
  random_numbers.appendChild(label);
  random_numbers.appendChild(document.createElement('br'));

  for (let id = 1; id < 7; id++) {
    let radio = document.createElement('input');
    radio.setAttribute('type', 'radio');
    radio.setAttribute('name', 'random_number');
    radio.setAttribute('id', `radio${id}`);
    radio.setAttribute('value', id);
    radio.addEventListener('change', function () {
      randomR = this.value;
    });
    random_numbers.appendChild(radio);

    // let label = document.createElement('label');
    // label.setAttribute('for', `radio${id}`);
    // label.innerText = ` [ ${id} ] `;
    // random_number.appendChild(label);

    for (let kind in RANDOMS[id]) {
      if (!!RANDOMS[id]['titles'][kind]) {
        //console.log('->', RANDOMS[id]['titles'][kind]);
        //let text = document.createElement('span');
        let text = document.createElement('label');
        text.setAttribute('for', `radio${id}`);
        let value = ' ' + RANDOMS[id]['titles'][kind].join(' ') + ' ';
        text.innerText = value;
        text.setAttribute('class', `title ${kind}`);
        random_numbers.appendChild(text);
      }
    }

    random_numbers.appendChild(document.createElement('br'));
  }
};
