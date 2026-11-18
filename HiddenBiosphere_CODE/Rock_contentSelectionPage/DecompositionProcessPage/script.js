const weatheringBoxes = document.querySelectorAll(".weathering-box");

const modal = document.querySelector("#weathering-modal");
const modalOverview = document.querySelector("#modal-overview");
const modalPanel = document.querySelector(".modal-panel");
const modalOverlay = document.querySelector(".modal-overlay");
const modalClose = document.querySelector(".modal-close");

const modalTitle = document.querySelector("#modal-title");
const modalImage = document.querySelector("#modal-image");
const modalStep = document.querySelector("#modal-step");
const modalStepTitle = document.querySelector("#modal-step-title");
const modalDescription = document.querySelector("#modal-description");
const modalDots = document.querySelector("#modal-dots");

const modalPrev = document.querySelector("#modal-prev");
const modalNext = document.querySelector("#modal-next");

const dummyImage = "../../assets/dummy1.png";


// 풍화 작용 데이터
const weatheringData = {
  
  // 물리적 풍화
  "freeze-thaw": {
    title: "凍結融解による風化",
    description:
      "岩石の亀裂に入り込んだ水が凍結し、氷の成長によって亀裂が広がる現象です。凍結と融解が繰り返され、条件が整うと岩石が割れることがあります。",
    steps: [
      [
        "亀裂への水の浸入",
        "岩石の表面にある亀裂に、雨水や雪解け水が入り込む。"
      ],
      [
        "水の凍結と氷の成長",
        "気温が下がると亀裂内の水が凍結する。氷の形成や水分の供給によって氷が成長し、亀裂の壁に圧力が加わることがある。"
      ],
      [
        "融解と凍結の繰り返し",
        "気温が上がると氷が融解する。水分の供給と凍結が繰り返されることで、亀裂が徐々に広がる場合がある。"
      ],
      [
        "岩石の破砕",
        "亀裂が十分に広がると、岩石の一部が割れ、破片として分離することがある。"
      ]
    ]
  },

  "salt": {
    title: "塩類風化",
    description:
      "岩石の隙間に入り込んだ塩類を含む水から結晶が形成され、その成長などによって岩石に圧力が加わる現象です。水分の変化が繰り返されることで、表面の剥離や破砕につながることがあります。",
    steps: [
      [
        "塩類を含む水の浸入",
        "塩類を溶かした水が岩石の細孔や亀裂に入り込む。"
      ],
      [
        "水分の蒸発と濃縮",
        "水分が蒸発すると、岩石内部に残った塩類の濃度が高まる。"
      ],
      [
        "塩の結晶成長",
        "塩類が細孔内で結晶化し、成長することで周囲の岩石に圧力が加わる場合がある。"
      ],
      [
        "表面の剥離と破砕",
        "結晶化や水分変化が繰り返されると、岩石の表面が剥がれたり、細かな破片が生じたりすることがある。"
      ]
    ]
  },

  "thermal": {
    title: "温度変化による風化",
    description:
      "日射や気温の変化によって岩石が加熱・冷却され、膨張と収縮が生じる現象です。鉱物ごとの熱的性質の違いなどによって応力が生じ、条件によっては亀裂や表面の剥離につながります。",
    steps: [
      [
        "岩石の加熱",
        "日射などによって岩石の表面温度が上昇する。"
      ],
      [
        "熱膨張と応力の発生",
        "岩石を構成する鉱物が膨張する。鉱物の種類や温度分布の違いによって、内部に応力が生じることがある。"
      ],
      [
        "冷却と収縮",
        "気温や日射条件が変わると岩石が冷却され、収縮する。加熱と冷却による応力の変化が繰り返される。"
      ],
      [
        "亀裂や剥離の発生",
        "応力が岩石の強度を超えると、微細な亀裂が形成・拡大し、表面の剥離などにつながる場合がある。"
      ]
    ]
  },

  "unloading": {
    title: "除荷による剥離",
    description:
      "岩石の上部にあった地層などが侵食によって取り除かれ、岩石にかかる圧力が減少することで内部の応力状態が変化する現象です。条件によっては地表にほぼ平行な亀裂が生じ、岩石が層状に剥がれることがあります。",
    steps: [
      [
        "上部の地層による圧力",
        "地下の岩石は、上部に重なる地層や岩石の重さによる圧力を受けている。"
      ],
      [
        "上部の岩石の侵食",
        "長い時間をかけて上部の地層が侵食され、下にあった岩石が地表付近に現れる。"
      ],
      [
        "圧力の減少と応力の変化",
        "上部の荷重が減少すると、岩石内部の応力状態が変化し、亀裂が形成される場合がある。"
      ],
      [
        "岩石の層状剥離",
        "地表にほぼ平行な亀裂に沿って、岩石の表層が板状に分離することがある。"
      ]
    ]
  },

  "wet-dry": {
    title: "乾湿風化",
    description:
      "岩石が湿潤と乾燥を繰り返すことで、膨張や収縮などの変化が生じる現象です。特に膨張性の粘土鉱物を含む岩石などでは、繰り返される体積変化によって亀裂や崩壊が進むことがあります。",
    steps: [
      [
        "岩石への水分の浸入",
        "雨水などが岩石の表面や細孔に入り込み、岩石が湿潤状態になる。"
      ],
      [
        "水分吸収による膨張",
        "膨張性の粘土鉱物を含む場合などには、水分の吸収によって岩石の一部が膨張する。"
      ],
      [
        "乾燥による収縮",
        "水分が失われると、膨張した部分が収縮することがある。"
      ],
      [
        "亀裂の発達と崩壊",
        "湿潤と乾燥による体積変化が繰り返され、条件によっては亀裂の発達や岩石の細粒化につながる。"
      ]
    ]
  },


  // 화학적 풍화
  "oxidation": {
    title: "酸化",
    description:
      "岩石に含まれる鉄などの元素が酸素と反応し、酸化状態が変化する現象です。鉄を含む鉱物の変質によって、岩石の表面などが赤褐色や黄褐色に変化することがあります。",
    steps: [
      [
        "鉄を含む鉱物",
        "岩石には、鉄を含む鉱物が存在することがある。"
      ],
      [
        "水や酸素との接触",
        "岩石の表面や亀裂を通じて、水や酸素が鉄を含む鉱物に接触する。"
      ],
      [
        "鉄の酸化反応",
        "鉱物に含まれる二価の鉄（Fe²⁺）が電子を失い、三価の鉄（Fe³⁺）へと酸化される。これに伴い、鉄酸化物や水酸化物などが形成されることがある。"
      ],
      [
        "鉱物の変質と変色",
        "酸化反応に伴う鉱物の変質によって、岩石の一部が赤褐色や黄褐色を帯びることがある。"
      ]
    ]
  },

  "reduction": {
    title: "還元",
    description:
      "酸素が少ない環境などで、鉄などの元素が電子を受け取り、酸化状態が変化する反応です。水分の多い土壌や岩石中では、鉄を含む鉱物の変質や鉄の移動に関わることがあります。",
    steps: [
      [
        "水分の多い環境",
        "岩石や土壌の細孔が水で満たされると、酸素の供給が制限されることがある。"
      ],
      [
        "還元的な環境の形成",
        "酸素が消費され、供給が少ない状態が続くと、微生物の活動などによって還元的な環境が形成される場合がある。"
      ],
      [
        "鉄の酸化状態の変化",
        "還元的な環境では、三価の鉄（Fe³⁺）が電子を受け取り、二価の鉄（Fe²⁺）へと還元されることがある。"
      ],
      [
        "鉄の移動と鉱物の変質",
        "還元によって鉄を含む鉱物が変質したり、溶解した鉄が水とともに移動したりすることがある。"
      ]
    ]
  },

  "hydrolysis": {
    title: "加水分解",
    description:
      "水が鉱物と化学反応を起こし、鉱物の構造や組成が変化する作用です。例えば、長石などのケイ酸塩鉱物が変質し、粘土鉱物が形成されることがあります。",
    steps: [
      [
        "水と鉱物の接触",
        "雨水や地下水が岩石の表面や亀裂に入り込み、鉱物と接触する。"
      ],
      [
        "鉱物との化学反応",
        "水に含まれる水素イオンなどが鉱物と反応し、構成元素の一部が溶け出す。"
      ],
      [
        "鉱物構造の変化",
        "長石などのケイ酸塩鉱物が化学的に変質し、元の結晶構造が変化していく。"
      ],
      [
        "二次鉱物の形成",
        "反応条件によっては、カオリナイトなどの粘土鉱物が形成される。"
      ]
    ]
  },

  "dissolution": {
    title: "溶解",
    description:
      "岩石を構成する鉱物の成分が水に溶け出す作用です。鉱物の種類や水の化学的性質によって溶けやすさは異なり、成分が失われることで岩石の表面や内部が変化することがあります。",
    steps: [
      [
        "水と鉱物の接触",
        "水が岩石の表面や亀裂に接触する。"
      ],
      [
        "鉱物成分の溶解",
        "水の性質や鉱物の種類に応じて、鉱物を構成する成分が水中に溶け出す。"
      ],
      [
        "溶解した成分の移動",
        "水に溶けた成分が、水の流れによって岩石の外へ運ばれることがある。"
      ],
      [
        "岩石表面や内部の変化",
        "鉱物が水に溶けて失われると、その部分に空隙が生じることがある。溶解が進むことで、岩石の表面や内部の形状が変化する。"
      ]
    ]
  },

  "hydration": {
    title: "水和",
    description:
      "鉱物が水分子を取り込み、水を含む鉱物へと変化する化学反応です。鉱物の種類や反応条件によっては、結晶構造や体積などが変化することがあります。",
    steps: [
      [
        "鉱物と水の接触",
        "水和反応を起こし得る鉱物が、水と接触する。"
      ],
      [
        "水分子の取り込み",
        "鉱物が水分子を取り込み、化学的な水和反応が進む。"
      ],
      [
        "水和鉱物への変化",
        "水を含む新たな鉱物相が形成され、結晶構造が変化することがある。"
      ],
      [
        "鉱物の性質の変化",
        "水和によって体積や物理的性質が変化し、条件によっては岩石の劣化に関わる。"
      ]
    ]
  },

  "carbonation": {
    title: "炭酸による溶解",
    description:
      "大気や土壌中の二酸化炭素が水に溶け込むことで生じる弱酸性の水が、石灰岩などに含まれる炭酸塩鉱物を溶かす作用です。これは化学的風化における溶解の代表的な例です。",
    steps: [
      [
        "二酸化炭素の溶解",
        "大気や土壌中の二酸化炭素が雨水や地下水に溶け込む。"
      ],
      [
        "弱酸性の水の形成",
        "溶け込んだ二酸化炭素の一部が水と反応し、炭酸を含む弱酸性の水となる。"
      ],
      [
        "炭酸塩鉱物の溶解",
        "弱酸性の水が石灰岩などに含まれる方解石と反応し、カルシウムイオンや炭酸水素イオンなどが水中に溶け出す。"
      ],
      [
        "岩石の形状の変化",
        "溶解が進むと、岩石の表面や亀裂が変化し、条件によっては空隙が拡大する。"
      ]
    ]
  },


  // 생물학적 풍화
  "roots": {
    title: "植物の根による風化",
    description:
      "植物の根が岩石の亀裂に入り込み、成長することで亀裂を押し広げる作用です。根の成長による物理的な力に加え、根の周囲で起こる化学的な変化も岩石の風化に関わることがあります。",
    steps: [
      [
        "亀裂への根の侵入",
        "植物の根が、岩石にすでに存在する亀裂や隙間に入り込む。"
      ],
      [
        "根の成長",
        "根が水分や養分を吸収しながら成長し、太くなる。"
      ],
      [
        "亀裂への圧力",
        "成長した根が亀裂の壁に力を加え、条件によっては亀裂を押し広げる。"
      ],
      [
        "岩石の分離",
        "亀裂が拡大すると、岩石の一部が割れたり、破片として分離したりすることがある。"
      ]
    ]
  },

  "lichen": {
    title: "地衣類による風化",
    description:
      "岩石の表面に生育する地衣類は、菌糸の侵入や有機酸などの作用によって、岩石の物理的・化学的な風化に関わることがあります。ただし、その影響は地衣類の種類や岩石、環境条件によって異なります。",
    steps: [
      [
        "岩石表面への定着",
        "地衣類が岩石の表面や微細な隙間に定着し、生育する。"
      ],
      [
        "菌糸による物理的作用",
        "地衣類を構成する菌類の菌糸が、鉱物の粒子間や微細な隙間に入り込むことがある。"
      ],
      [
        "有機酸などの化学的作用",
        "地衣類がつくる有機酸などの物質が、岩石表面の鉱物と反応する場合がある。"
      ],
      [
        "鉱物表面の変化",
        "菌糸による物理的な作用や有機酸などによる化学的な作用によって、鉱物が変質・溶解することがある。溶解によって成分が失われた部分には、微細な空隙が生じる場合もある。"
      ]
    ]
  },

  "microbes": {
    title: "微生物による風化",
    description:
      "岩石の表面や内部に生息する細菌や菌類などの微生物は、代謝活動によって周囲の化学環境を変化させ、鉱物の溶解や変質に関わることがあります。その作用は微生物の種類や環境条件によって異なります。",
    steps: [
      [
        "岩石表面への生息",
        "細菌や菌類などの微生物が、岩石の表面や細孔などに生息する。"
      ],
      [
        "微生物の代謝活動",
        "微生物が周囲の物質を利用して活動し、有機酸などを生成したり、酸化還元反応に関わったりする。"
      ],
      [
        "周囲の化学環境の変化",
        "微生物の活動によって、鉱物表面付近の酸性度や元素の化学的状態が変化する場合がある。"
      ],
      [
        "鉱物の溶解や変質",
        "微生物の代謝活動によって周囲の化学環境が変化し、鉱物の溶解や変質が促進される場合がある。鉱物成分が溶け出すと、微細な空隙が生じることもある。"
      ]
    ]
  },

  "animals": {
    title: "動物の活動による風化",
    description:
      "地中に穴を掘る動物などの活動によって、土壌や岩石の破片が移動し、新しい岩石の表面が露出することがあります。こうした活動は、水や空気との接触を変化させ、間接的に風化を促進する場合があります。",
    steps: [
      [
        "地中での動物の活動",
        "地中に穴を掘る動物などが、土壌や風化した岩石の周辺で活動する。"
      ],
      [
        "土壌や岩石片の移動",
        "掘削や移動によって、土壌や小さな岩石片がかき混ぜられたり、移動したりする。"
      ],
      [
        "新しい岩石表面の露出",
        "それまで土壌などに覆われていた岩石の表面が露出することがある。"
      ],
      [
        "風化条件の変化",
        "水や空気との接触条件が変化し、岩石の物理的・化学的風化が進みやすくなる場合がある。"
      ]
    ]
  }
};

// 메인 화면 설명문 갱신

weatheringBoxes.forEach(box => {
  const id = box.dataset.weathering;
  const data = weatheringData[id];
  if (!data) return;
  const heading = box.querySelector("h3");
  const paragraph = box.querySelector("p");
  if (heading) heading.textContent = data.title;
  if (paragraph) paragraph.textContent = data.description;
});


// 단계별 이미지 설정

const weatheringImageBase =
  "../../assets/Rock/DecompositionProcessPage/weathering/";

const weatheringImageNames = {
  // 물리적 풍화
  "freeze-thaw": "freeze-thaw",
  "salt": "salt",
  "thermal": "thermal",
  "unloading": "unloading",
  "wet-dry": "wet-dry",
  // 화학적 풍화
  "oxidation": "oxidation",
  "reduction": "reduction",
  "hydrolysis": "hydrolysis",
  "dissolution": "dissolution",
  "hydration": "hydration",
  "carbonation": "carbonicAcidDissolution",
  // 생물적 풍화
  "roots": "rootWedging",
  "lichen": "lichenWeathering",
  "microbes": "microbialWeathering",
  "animals": "animal-inducedWeathering"
};

Object.entries(weatheringData).forEach(([id, item]) => {
  const imageName = weatheringImageNames[id];

  item.steps = item.steps.map(([title, description], index) => ({
    title,
    description,
    image: imageName
      ? `${weatheringImageBase}${imageName}${index + 1}.svg`
      : dummyImage,
    alt: `${item.title}：${title}`
  }));
});


// 팝업 상태 및 렌더링
let currentWeathering = null;
let currentStep = 0;
let previousFocus = null;

function renderModal() {
  if (!currentWeathering) return;

  const item = weatheringData[currentWeathering];
  const steps = item.steps;
  const step = steps[currentStep];

  modalTitle.textContent = item.title;
  modalOverview.textContent = item.description;
  modalImage.src = step.image;
  modalImage.alt = step.alt;
  modalStep.textContent = `${currentStep + 1} / ${steps.length}`;
  modalStepTitle.textContent = step.title;
  modalDescription.textContent = step.description;
  modalPrev.disabled = currentStep === 0;
  modalNext.disabled = currentStep === steps.length - 1;
}


// 팝업 열기
function openModal(id) {
  if (!weatheringData[id]) return;

  previousFocus = document.activeElement;
  currentWeathering = id;
  currentStep = 0;

  renderModal();

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");

  document.body.classList.add("modal-open");

  modalClose.focus();
}


// 팝업 닫기
function closeModal() {
  if (!modal.classList.contains("is-open")) return;

  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");

  document.body.classList.remove("modal-open");

  currentWeathering = null;
  currentStep = 0;

  if (previousFocus && previousFocus.isConnected) {
    previousFocus.focus({ preventScroll: true });
  }
}


// 단계 이동
function changeStep(direction) {
  if (!currentWeathering) return;

  const total = weatheringData[currentWeathering].steps.length;

  currentStep = Math.max(
    0,
    Math.min(total - 1, currentStep + direction)
  );

  renderModal();
}


// 상자 터치 및 키보드 조작
weatheringBoxes.forEach(box => {
  const id = box.dataset.weathering;

  if (!weatheringData[id]) return;

  box.setAttribute("role", "button");
  box.setAttribute("tabindex", "0");
  box.setAttribute("aria-haspopup", "dialog");

  box.addEventListener("click", () => {
    openModal(id);
  });

  box.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openModal(id);
    }
  });
});


// 팝업 버튼
modalClose.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", closeModal);

modalPrev.addEventListener("click", () => {
  changeStep(-1);
});

modalNext.addEventListener("click", () => {
  changeStep(1);
});


// 키보드 조작
document.addEventListener("keydown", event => {
  if (!modal.classList.contains("is-open")) return;

  if (event.key === "Escape") {
    event.preventDefault();
    closeModal();
    return;
  }

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    changeStep(-1);
    return;
  }

  if (event.key === "ArrowRight") {
    event.preventDefault();
    changeStep(1);
    return;
  }

  if (event.key === "Tab") {
    const focusable = [
      ...modalPanel.querySelectorAll(
        'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
      )
    ];

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (!first || !last) return;

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});
