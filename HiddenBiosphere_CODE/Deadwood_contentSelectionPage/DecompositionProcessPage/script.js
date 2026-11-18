const slider = document.querySelector("#stage-slider");
const title = document.querySelector("#stage-title");
const time = document.querySelector("#stage-time");
const state = document.querySelector("#stage-state");
const expression = document.querySelector("#stage-expression");
const image = document.querySelector("#stage-image");

const stages = [
  {
    title: "Log Class 1｜分解初期",
    state: "状態：樹皮がほぼ完全に残っており、枝も多く残っている。枝によって幹が支えられているため、倒木の大部分は地面から離れている。",
    image: "../../assets/Deadwood/DecompositionProcess/LogClass1.png",
    alt: "LogClass1"
  },
  {
    title: "Log Class 2｜分解の進行",
    state: "状態：樹皮がはがれ始め、枝も少なくなる。幹は地面に近づくが、残った枝などによって一部が地面から浮いている。",
    image: "../../assets/Deadwood/DecompositionProcess/LogClass2.png",
    alt: "LogClass2"
  },
  {
    title: "Log Class 3｜分解中期",
    state: "状態：木部が柔らかくなり、多くの生物が利用する環境になる。",
    image: "../../assets/Deadwood/DecompositionProcess/LogClass3.png",
    alt: "LogClass3"
  },
  {
    title: "Log Class 4｜分解後期",
    state: "状態：木の形が崩れ始め、内部まで分解が進む。",
    image: "../../assets/Deadwood/DecompositionProcess/LogClass4.png",
    alt: "LogClass4"
  },
  {
    title: "Log Class 5｜分解末期",
    state: "状態：樹皮はほとんど失われ、倒木全体が地面に接している。木材は大きく分解され、地面に沈み込むように周囲の土壌と一体化していく。",
    image: "../../assets/Deadwood/DecompositionProcess/LogClass5.png",
    alt: "LogClass5"
  }
];

function updateStage() {
  const index = Number(slider.value) - 1;
  const stage = stages[index];

  title.textContent = stage.title;
  time.textContent = stage.time;
  state.textContent = stage.state;
  expression.textContent = stage.expression;
  image.src = stage.image;
  image.alt = stage.alt;
}

slider.addEventListener("input", updateStage);
updateStage();