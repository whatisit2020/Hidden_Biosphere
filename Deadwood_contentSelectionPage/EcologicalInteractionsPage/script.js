const relationshipMap = document.querySelector(".relationship-map");

/* call out */
const deadwood = document.querySelector(".deadwood");
const funguses = document.querySelector(".funguses");
const insects = document.querySelector(".insects");
const bryophyte = document.querySelector(".bryophyte");
const microorganisms = document.querySelector(".microorganisms");

const svg = document.querySelector(".relationship-lines");

/* connect */
const fungusLine = document.querySelector("#deadwood-to-funguses");
const insectLine = document.querySelector("#deadwood-to-insects");
const bryophyteLine = document.querySelector("#deadwood-to-bryophyte");
const microorganismLine = document.querySelector("#deadwood-to-microorganisms");

/* popup */
const infoPopup = document.querySelector("#info-popup");
const infoPopupClose = document.querySelector("#info-popup-close");
const infoPopupKana = document.querySelector("#info-popup-kana");
const infoPopupTitle = document.querySelector("#info-popup-title");
const infoPopupDescription = document.querySelector("#info-popup-description");

/* information */
const objectInfo = {
  deadwood: {
    kana: "とうぼく",
    title: "倒木",
    description:
      "倒木は、菌類や昆虫、蘚苔類、微生物など、さまざまな生物の生息場所となる。分解が進むにつれて木の状態が変化し、多様な生物が関わる小さな生態系が形成される。"
  },
  funguses: {
    kana: "きんるい",
    title: "菌類",
    description:
      "菌類は倒木の組織を分解し、木に含まれる有機物を利用する。木材の分解を進めることで、他の生物が利用できる環境の形成にも関わっている。"
  },
  insects: {
    kana: "こんちゅう",
    title: "昆虫",
    description:
      "倒木にはさまざまな昆虫が生息する。木を食べるものや、木の内部に穴を掘って成長するものなどが存在し、その活動によって倒木内部の環境も変化していく。"
  },
  bryophyte: {
    kana: "せんたいるい",
    title: "蘚苔類",
    description:
      "蘚苔類は倒木の表面などに生育し、水分を保持することで湿った環境をつくる。こうした環境は、倒木を利用する他の小さな生物にも影響を与える。"
  },
  microorganisms: {
    kana: "びせいぶつ",
    title: "微生物",
    description:
      "微生物は倒木の内部や表面に存在し、有機物の分解に関わっている。菌類などとともに分解を進め、倒木に含まれる物質が再び環境へ戻る過程を支えている。"
  }
};

/* calculate positions */
function getElementCenter(element) {
  const mapRect = relationshipMap.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();
  return {
    x: elementRect.left - mapRect.left + elementRect.width / 2,
    y: elementRect.top - mapRect.top + elementRect.height / 2
  };
}

function connect(from, to, line) {
  const fromCenter = getElementCenter(from);
  const toCenter = getElementCenter(to);

  line.setAttribute("x1", fromCenter.x);
  line.setAttribute("y1", fromCenter.y);
  line.setAttribute("x2", toCenter.x);
  line.setAttribute("y2", toCenter.y);
}

/* draw relationship line */
function drawRelationshipLine() {
  if (!relationshipMap || !svg) return;

  const mapWidth = relationshipMap.clientWidth;
  const mapHeight = relationshipMap.clientHeight;

  svg.setAttribute(
    "viewBox",
    `0 0 ${mapWidth} ${mapHeight}`
  );

  connect(deadwood, funguses, fungusLine);
  connect(deadwood, insects, insectLine);
  connect(deadwood, bryophyte, bryophyteLine);
  connect(deadwood, microorganisms, microorganismLine);
}

/* popup */
function openInfoPopup(type) {
  const info = objectInfo[type];

  if (!info || !infoPopup) return;

  infoPopupKana.textContent = info.kana;
  infoPopupTitle.textContent = info.title;
  infoPopupDescription.textContent = info.description;

  infoPopup.classList.add("is-open");
  infoPopup.setAttribute("aria-hidden", "false");
}

function closeInfoPopup() {
  if (!infoPopup) return;

  infoPopup.classList.remove("is-open");
  infoPopup.setAttribute("aria-hidden", "true");
}

/* thumbnail click / touch */
deadwood.addEventListener("click", () => {
  openInfoPopup("deadwood");
});
funguses.addEventListener("click", () => {
  openInfoPopup("funguses");
});
insects.addEventListener("click", () => {
  openInfoPopup("insects");
});
bryophyte.addEventListener("click", () => {
  openInfoPopup("bryophyte");
});
microorganisms.addEventListener("click", () => {
  openInfoPopup("microorganisms");
});

/* close button */
infoPopupClose.addEventListener("click", closeInfoPopup);

/* tap background to close */
infoPopup.addEventListener("click", (event) => {
  if (event.target === infoPopup) {
    closeInfoPopup();
  }
});

/* ESC to close */
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeInfoPopup();
  }
});

/* start to draw after loading */
window.addEventListener("load", drawRelationshipLine);

/* recalculate positions on window resize */
window.addEventListener("resize", drawRelationshipLine);