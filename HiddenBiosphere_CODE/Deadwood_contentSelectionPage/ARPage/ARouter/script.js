
/*전역 DOM 요소와 상태*/
let sceneRoot;

/*간단 설명창*/
let infoPanel;
let infoCloseButton;
let infoCategory;
let infoTitle;
let infoDescription;

/*가이드*/
let touchGuide;

/*도감*/
let encyclopediaButton;
let encyclopediaModal;
let encyclopediaCloseButton;
let encyclopediaSubtitle;
let encyclopediaTitle;
let encyclopediaGrid;
let encyclopediaPagination;

/*개별 생물 상세*/
let speciesModal;
let speciesCloseButton;
let speciesImage;
let speciesCategory;
let speciesName;
let speciesScientificName;
let speciesDescription;

/*현재 선택 상태*/
let selectedPart = null;
let encyclopediaPage = 0;

/*두 손가락 제스처 상태*/
let gestureActive = false;
let blockObjectClick = false;
let blockClickTimer = null;
let startDistance = 0;
let startCenter = { x: 0, y: 0 };
let startScale = 40;
let startPosition = {
  x: 200,
  y: -40,
  z: -100
};

/*AR.js 로딩 화면*/
function hideLoader() {
  const loader = document.querySelector(".arjs-loader");
  if (loader) {
    loader.style.display = "none";
  }
}

window.addEventListener("arjs-nft-loaded", hideLoader);
setTimeout(hideLoader, 10000);

/*모바일 AR 터치 Raycaster*/
AFRAME.registerComponent("ar-touch-raycaster", {
  init: function () {
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.onTouchStart = this.onTouchStart.bind(this);
    window.addEventListener("touchstart", this.onTouchStart, {
      passive: false
    });
  },

  onTouchStart: function (event) {
    const target = event.target;

    /*HTML UI를 누른 경우 AR 터치 차단*/
    if (
      target &&
      target.closest &&
      target.closest(
        ".back, " +
        ".info-panel, " +
        ".encyclopedia-button, " +
        ".encyclopedia-modal, " +
        ".species-modal"
      )
    ) {
      return;
    }

    if (
      infoPanel &&
      infoPanel.classList.contains("is-open")
    ) {
      return;
    }

    if (
      event.touches.length !== 1 ||
      gestureActive ||
      blockObjectClick
    ) {
      return;
    }

    const sceneElement = this.el.sceneEl;
    if (!sceneElement) return;

    const camera = sceneElement.camera;
    const canvas = sceneElement.canvas;
    if (!camera || !canvas) return;

    const touch = event.touches[0];
    const rect = canvas.getBoundingClientRect();

    if (rect.width === 0 || rect.height === 0) {
      return;
    }

    /*터치 좌표 변환*/
    this.pointer.x =
      ((touch.clientX - rect.left) / rect.width) * 2 - 1;

    this.pointer.y =
      -((touch.clientY - rect.top) / rect.height) * 2 + 1;

    camera.updateMatrixWorld(true);
    this.raycaster.setFromCamera(this.pointer, camera);

    const clickableElements = Array.from(
      document.querySelectorAll(".clickable")
    );

    const objectsToIntersect = [];

    /*각 히트박스와 자식 메쉬에 data-part 저장*/
    clickableElements.forEach((element) => {
      if (!element.object3D) return;

      const part =
        element.dataset.part ||
        element.getAttribute("data-part");

      element.object3D.updateMatrixWorld(true);

      element.object3D.traverse((child) => {
        child.userData.arPart = part;
        child.userData.arClickableElement = element;

        if (child.isMesh) {
          objectsToIntersect.push(child);
        }
      });
    });

    const intersections =
      this.raycaster.intersectObjects(
        objectsToIntersect,
        false
      );

    if (intersections.length === 0) {
      console.log("터치된 히트박스 없음");
      return;
    }

    /*터치된 메쉬의 part와 HTML 요소 사용*/
    const intersection = intersections[0];
    const part = intersection.object.userData.arPart;

    const clickableElement =
      intersection.object.userData.arClickableElement;

    if (!part || !clickableElement) {
      return;
    }

    console.log(
      "Touched part:",
      part,
      "distance:",
      intersection.distance
    );

    if (event.cancelable) {
      event.preventDefault();
    }

    event.stopPropagation();

    /*선택된 part 직접 전달*/
    openInfoPanel(part);
  },

  remove: function () {
    window.removeEventListener(
      "touchstart",
      this.onTouchStart
    );
  }
});

/*AR 오브젝트와 도감 데이터*/
const objectInfo = {
  fungus: {
    category: "菌類",
    title: "キノコ",
    description:
      "キノコは倒木を分解し、木の中に蓄えられた栄養分が再び土や森へと循環するのを支えている。",

    encyclopedia: {
      subtitle: "広葉樹\n針葉樹",
      title: "菌類",

      species: [
        {
          name: "シイタケ",
          scientificName: "Lentinula edodes",
          latitude: "北緯約20°〜45°（亜熱帯〜冷温帯）",

/*
Sierra-Patev, S., et al. (2023).
A global phylogenomic analysis of the shiitake genus Lentinula.
Proceedings of the National Academy of Sciences.
https://pmc.ncbi.nlm.nih.gov/articles/PMC10013852/

Li, W.-J., Yang, R.-H., Guo, T., Wu, S.-J., Li, Y., & Bao, D.-P. (2025).
A Model of the Current Geographic Distribution and Predictions of Future Range Shifts of Lentinula edodes in China Under Multiple Climate Change Scenarios.
Journal of Fungi, 11(10), 730.
https://doi.org/10.3390/jof11100730

Development History, Current Situation and Trends of Global Lentinula edodes Industry. (2024).
https://www.syjxb.com/EN/10.16488/j.cnki.1005-9873.2024.03.001
*/

          image:
            "../../../assets/Deadwood/EncyclopediaPage/siitake.png",

          category: "菌類",

          description:
            "シイタケは、主に広葉樹の枯死木や倒木に発生する木材腐朽菌である。菌糸を木の内部へ広げ、硬い木の組織をゆっくりと分解する。その過程で、木に含まれていた栄養分を土へ戻し、森の循環を支える役割を持つ。"
        },

        {
          name: "ヒラタケ",
          scientificName: "Pleurotus ostreatus",
          latitude: "北緯約25°〜65°（暖温帯〜亜寒帯）",

/*
OECD. (2005).
Consensus Document on the Biology of Pleurotus spp. (Oyster Mushroom).
Series on Harmonisation of Regulatory Oversight in Biotechnology.
https://one.oecd.org/document/ENV/JM/MONO(2005)17/en/pdf

de Mattos-Shipley, K. M. J., et al. (2016).
The good, the bad and the tasty: The many roles of mushrooms.
Studies in Mycology.
https://pmc.ncbi.nlm.nih.gov/articles/PMC5220184/

Li, J., et al. (2020).
The saprotrophic Pleurotus ostreatus species complex:
late Eocene origin in East Asia, multiple dispersal, and complex speciation.
IMA Fungus, 11, Article 10.
https://doi.org/10.1186/s43008-020-00031-1
*/

          image:
            "../../../assets/Deadwood/EncyclopediaPage/hiratake.png",

          category: "菌類",

          description:
            "ヒラタケは、広葉樹の枯死木や倒木に発生する木材腐朽菌である。木の内部に菌糸を広げ、木材を分解しながら成長する。枯死木に残された栄養分を土へ戻し、森の物質循環を支える役割を持つ。"
        },

        {
          name: "スエヒロタケ",
          scientificName: "Schizophyllum commune",
          latitude: "南緯約50°〜北緯約70°（熱帯〜亜寒帯）",

/*
Schizophyllum commune: a case study for testing the potential introduction of non-native strains into New Zealand. (2013).
New Zealand Journal of Botany.
https://doi.org/10.1080/0028825X.2013.829503

The versatility of Schizophyllum commune in nature and application. (2025).
Fungal Biology Reviews, 53, 100431.
https://doi.org/10.1016/j.fbr.2025.100431

Royal Botanic Gardens, Kew.
Schizophyllum commune Fr.
https://species.data.kew.org/species/208403
*/

          image:
            "../../../assets/Deadwood/EncyclopediaPage/suehirotake.png",

          category: "菌類",

          description:
            "スエヒロタケは、枯死木や倒木、枯れ枝などに発生する木材腐朽菌である。扇形の小さな傘を広げるように成長し、木の内部に菌糸を伸ばして木材を分解する。枯死木に残された有機物を分解し、栄養分を土へ戻すことで、森の循環を支える役割を持つ"
        },

        {
          name: "キクラゲ",
          scientificName: "Auricularia auricula-judae",
          latitude: "北緯約40°〜60°（温帯〜冷温帯）",

/*
Wu, F., et al. (2021).
Global Diversity and Updated Phylogeny of Auricularia
(Auriculariales, Basidiomycota).
Journal of Fungi, 7(11), 933.
https://pmc.ncbi.nlm.nih.gov/articles/PMC8625027/

Wu, F., & Dai, Y.-C. (2015).
Notes on the nomenclature of the Auricularia auricula-judae complex.
Mycosystema, 34(4), 604–611.
https://doi.org/10.13346/j.mycosystema.150052

Whose Ear?: Proposal to conserve the name Auricularia auricula
(L.) Underw. for Auricularia auricula-judae (Bull.) Quél.
F1000Research, 12, 948 (2023).
https://pmc.ncbi.nlm.nih.gov/articles/PMC11009569/
*/

          image:
            "../../../assets/Deadwood/EncyclopediaPage/kikurage.png",

          category: "菌類",

          description:
            "キクラゲは、主に広葉樹の枯死木や倒木、枯れ枝などに発生する木材腐朽菌である。ゼリー状で耳のような形をしており、湿った環境で成長しやすい。木の内部に菌糸を広げ、木材を分解することで、枯死木に残された栄養分を土へ戻す役割を持つ。"
        },

        {
          name: "マンネンタケ",
          scientificName: "Ganoderma sichuanense",
          latitude: "北緯約8°〜45°（熱帯〜冷温帯）",

/*
Taxonomic evaluation of selected Ganoderma species and database sequence validation. (2017).
https://pmc.ncbi.nlm.nih.gov/articles/PMC5534161/

Re-Examination of the Holotype of Ganoderma sichuanense (Ganodermataceae, Polyporales) and a Clarification of the Identity of Chinese Cultivated Lingzhi. (2023).
Journal of Fungi, 9(3), 323.
https://doi.org/10.3390/jof9030323
https://pmc.ncbi.nlm.nih.gov/articles/PMC10051598/

Environmental Protection Authority, New Zealand. (2022).
APP204204: EPA Staff Assessment Report.
https://www.epa.govt.nz/assets/FileAPI/hsno-ar/APP204204/APP204204-EPA-Staff-Assessment-Report.pdf
*/

          image:
            "../../../assets/Deadwood/EncyclopediaPage/mannnenntake.png",

          category: "菌類",

          description:
            "マンネンタケは、枯死木や切り株の根元などに発生する木材腐朽菌である。硬く光沢のある傘を持ち、赤褐色から黒褐色の特徴的な見た目をしている。菌糸を木の内部へ広げ、木材をゆっくりと分解しながら、枯死木に残された栄養分を土へ戻す役割を持つ。"
        },

        {
          name: "ヤマブシタケ",
          scientificName: "Hericium erinaceus",
          latitude: "北緯約30°〜60°（暖温帯〜冷温帯）",

/*
IUCN. (2019).
Hericium erinaceus.
The IUCN Red List of Threatened Species 2019.
https://doi.org/10.2305/IUCN.UK.2019-3.RLTS.T70401627A70401637.en

Boddy, L., Crockatt, M. E., & Ainsworth, A. M. (2011).
Ecology of Hericium cirrhatum, H. coralloides and H. erinaceus in the UK.
Fungal Ecology, 4(2), 163–173.
https://doi.org/10.1016/j.funeco.2010.10.001

Koga, J., Thorn, R. G., & Langer, E. (2025).
A multilocus phylogeny of Hericium (Hericiaceae, Russulales).
Persoonia, 55, 141–157.
https://doi.org/10.3114/persoonia.2025.55.04
https://pmc.ncbi.nlm.nih.gov/articles/PMC12798842/
*/

          image:
            "../../../assets/Deadwood/EncyclopediaPage/yamabusitake.png",

          category: "菌類",

          description:
            "ヤマブシタケは、主に広葉樹の枯死木や倒木に発生する木材腐朽菌である。白く細長い針のような形をした特徴的なキノコで、木の内部に菌糸を広げながら成長する。木材を分解し、枯死木に残された栄養分を土へ戻すことで、森の循環を支える役割を持つ。"
        },

        {
          name: "ウマノケタケ",
          scientificName: "Marasmius crinisequi",
          latitude: "南緯約30°〜北緯約25°（熱帯〜亜熱帯）",

/*
Guard, F. E., Dearnaley, J. D. W., May, T. W., & Lebel, T. (2024).
Untangling horsehair fungi in Australia: Marasmius crinis-equi
(Marasmiaceae) and related taxa.
Mycological Progress, 23, Article 60.
https://doi.org/10.1007/s11557-024-01995-9

Pacific Pests, Pathogens & Weeds.
Cocoa horsehair blight (Marasmius crinis-equi).
https://apps.lucidcentral.org/pppw_v12/text/web_full/entities/cocoa_horsehair_blight_005.htm

Index Fungorum.
Marasmius crinis-equi F. Muell. ex Kalchbr.
https://www.indexfungorum.org/names/NamesRecord.asp?RecordID=356828
*/

          image:
            "../../../assets/Deadwood/EncyclopediaPage/umanoketake.png",

          category: "菌類",

          description:
            "ウマノケタケは、広葉樹の枯れ枝や落葉の上に発生する小型のキノコである。髪の毛のような黒く細い菌糸束を広げ、その上に小さな傘をつくる。枯れ枝や落葉に残された有機物を分解し、森の中の物質循環を支える役割を持つ。"
        },

        {
          name: "ブクリョウ",
          scientificName: "Wolfiporia extensa / Poria cocos",
          latitude: "北緯約20°〜45°（亜熱帯〜冷温帯）",

/*
Papp, V., & Dai, Y.-C. (2022).
What is the correct scientific name for “Fuling” medicinal mushroom?
Mycology, 13(3), 207–211.
https://doi.org/10.1080/21501203.2022.2089755

Full text:
https://pmc.ncbi.nlm.nih.gov/articles/PMC9354628/

May, T. W., et al. (2021).
Competing sexual-asexual generic names in Agaricomycotina
(Basidiomycota) with recommendations for use.
IMA Fungus.
https://doi.org/10.1186/s43008-021-00061-3

Health Canada. (2019).
Poria – Wolfiporia extensa.
Natural Health Product Monograph.
https://webprod.hc-sc.gc.ca/nhpid-bdipsn/dbImages/mono_poria-wolfiporia-extensa_en.pdf
*/

          image:
            "../../../assets/Deadwood/EncyclopediaPage/bukurixyou.png",

          category: "菌類",

          description:
            "茯苓は、主にマツ類などの針葉樹の根や切り株の周辺に発生する木材腐朽菌である。地中で菌糸が集まり、かたまり状の菌核をつくることが特徴で、一般的なキノコのように傘を広げる姿とは異なる。枯れた根や木材を分解しながら成長し、森林の物質循環に関わる役割を持つ。"
        },

        {
          name: "ハナビラタケ",
          scientificName: "Sparassis crispa",
          latitude: "北緯約35°〜65°（温帯〜亜寒帯）",

/*
Dai, Y.-C., et al. (2006).
Phylogeny and a new species of Sparassis (Polyporales, Basidiomycota):
evidence from mitochondrial atp6, nuclear rDNA and rpb2 genes.
Mycologia, 98(4), 584–592.
https://doi.org/10.3852/mycologia.98.4.584

May, T. W., et al. (2021).
Competing sexual-asexual generic names in Agaricomycotina
(Basidiomycota) with recommendations for use.
IMA Fungus.
https://doi.org/10.1186/s43008-021-00061-3

Health Canada. (2019).
Poria – Wolfiporia extensa.
Natural Health Product Monograph.
https://webprod.hc-sc.gc.ca/nhpid-bdipsn/dbImages/mono_poria-wolfiporia-extensa_en.pdf
*/

          image:
            "../../../assets/Deadwood/EncyclopediaPage/hanabiratake.png",

          category: "菌類",

          description:
            "ハナビラタケは、主にマツ類などの針葉樹の根元や切り株の周辺に発生する木材腐朽菌である。白色から淡いクリーム色の花びらのような形をしており、重なり合った波状のひだが特徴である。木の根や切り株の内部に菌糸を広げ、木材を分解しながら、森の物質循環を支える役割を持つ。"
        },

        {
          name: "マツノサルノコシカケ",
          scientificName: "Porodaedalea pini / Phellinus pini",
          latitude: "北緯約35°〜70°（温帯〜亜寒帯）",

/*
Wu, F., Dai, S.-J., Vlasák, J., Spirin, V., & Dai, Y.-C. (2019).
Phylogeny and global diversity of Porodaedalea,
a genus of gymnosperm pathogens in the Hymenochaetales.
Mycologia, 111(1), 40–53.
https://doi.org/10.1080/00275514.2018.1526618

Full text:
https://www.alpental.com/psms/ddd/Hymenochaetales/Porodaedalea%20Wu%202019.pdf

Brazee, N. J., & Lindner, D. L. (2013).
Unravelling the Phellinus pini s.l. complex in North America:
a multilocus phylogeny and differentiation analysis of Porodaedalea.
Forest Pathology, 43(2), 132–143.
https://doi.org/10.1111/efp.12008

Full text:
https://research.fs.usda.gov/download/treesearch/56263.pdf

NCBI Taxonomy.
Porodaedalea pini (Taxonomy ID: 108901).
https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=108901
*/

          image:
            "../../../assets/Deadwood/EncyclopediaPage/matunosarunokosikake.png",

          category: "菌類",

          description:
            "マツノサルノコシカケは、主にマツ類などの針葉樹に発生する硬い木材腐朽菌である。幹や枯死木に棚状の子実体をつくり、木の内部に菌糸を広げながら木材をゆっくりと分解する。枯れた木や弱った木を分解し、森の物質循環を支える役割を持つ。"
        },

        {
          name: "トンビマイタケ",
          scientificName: "Meripilus giganteus",
          latitude: "北緯約35°〜60°（暖温帯〜冷温帯）",

/*
First Nature.
Meripilus giganteus (Pers.) P. Karst. – Giant Polypore.
https://www.first-nature.com/fungi/meripilus-giganteus.php

Larsen, M. J., & Lombard, F. F. (1988).
The Status of Meripilus giganteus (Aphyllophorales,
Polyporaceae) in North America.
Mycologia, 80(5), 612–621.
https://doi.org/10.1080/00275514.1988.12025591

Full text:
https://www.fpl.fs.usda.gov/documnts/pdf1988/larse88b.pdf

Species Fungorum.
Meripilus giganteus (Pers.) P. Karst.
Index Fungorum Record ID: 414455.
https://www.speciesfungorum.org/Names/NamesRecord.asp?RecordID=414455
*/

          image:
            "../../../assets/Deadwood/EncyclopediaPage/tonnbimaitake.png",

          category: "菌類",

          description:
            "トンビマイタケは、主にブナなどの広葉樹の根元や切り株、枯死木の周辺に発生する大型の木材腐朽菌である。重なり合った扇形の傘を広げるように成長し、木の内部に菌糸を伸ばして木材を分解する。枯死木や弱った木を分解し、森の物質循環を支える役割を持つ。"
        },

        {
          name: "カイガラタケ",
          scientificName: "Lenzites betulina",
          latitude: "北緯約25°〜65°（暖温帯〜亜寒帯）",

/*
North Carolina State University.
Larry F. Grand Mycological Herbarium.
Lenzites betulina – Species Profile.
https://ncslg.cals.ncsu.edu/lenzites-betulina-fr-fr/

Government of Northwest Territories, Canada. (2019).
Lenzites betulinus (Lenzites betulina).
NWT Species Search.
https://www.gov.nt.ca/species-search/lenzites-betulinus-lenzites-betulina

Species Fungorum.
Lenzites betulinus (L.) Fr. [as 'betulina'].
Index Fungorum Record ID: 199017.
https://www.speciesfungorum.org/names/Synonymy.asp?RecordID=199017
*/

          image:
            "../../../assets/Deadwood/EncyclopediaPage/kaigaratake.png",

          category: "菌類",

          description:
            "カイガラタケは、主に広葉樹の枯れ木や枯死木に発生する木材腐朽菌である。貝殻のような半円形の傘を重ねるようにつくり、傘の裏にはヒダ状の構造が見られる。木材を白色腐朽させながら分解し、枯死木に残された有機物を土へ戻すことで、森の物質循環を支える役割を持つ。"
        }
      ]
    }
  },

  moss: {
    category: "コケ植物",
    title: "コケ",
    description:
      "倒木は湿気を保ちやすく、コケが生育する場所となる。コケはその表面の水分を保ち、小さな昆虫や微生物が活動しやすい環境をつくる。",
    hasEncyclopedia: false,

    encyclopedia: {
      subtitle: "",
      title: "コケ",
      species: [
        {
          name: "",
          scientificName: "",
          image:
            "../../../assets/Deadwood/EncyclopediaPage/.png",
          category: "",
          description: ""
        }
      ]
    }
  },

  hole: {
    category: "微小生息環境",
    title: "昆虫が出入りした痕跡",
    description:
      "倒木に残された穴やすき間は、昆虫が内部を利用した痕跡である。内部への出入り口や隠れ場所として使われ、倒木の中に多様な生物が暮らしていることを示している。",
    hasEncyclopedia: false,

    encyclopedia: {
      subtitle: "倒木の穴に暮らす",
      title: "生物",
      species: [
        {
          name: "",
          scientificName: "",
          image:
            "../../../assets/Deadwood/EncyclopediaPage/.png",
          category: "昆虫",
          description: ""
        }
      ]
    }
  }
};

/*한 페이지에 표시할 카드 수*/
const SPECIES_PER_PAGE = 4;

/*DOM 준비*/
document.addEventListener("DOMContentLoaded", () => {
  sceneRoot = document.querySelector("#scene-root");

  infoPanel = document.querySelector("#info-panel");
  infoCloseButton = document.querySelector("#info-close");
  infoCategory = document.querySelector("#info-category");
  infoTitle = document.querySelector("#info-title");
  infoDescription = document.querySelector("#info-description");

  encyclopediaButton =
    document.querySelector("#encyclopedia-button");

  encyclopediaModal =
    document.querySelector("#encyclopedia-modal");

  encyclopediaCloseButton =
    document.querySelector("#encyclopedia-close");

  encyclopediaSubtitle =
    document.querySelector("#encyclopedia-subtitle");

  encyclopediaTitle =
    document.querySelector("#encyclopedia-title");

  encyclopediaGrid =
    document.querySelector("#encyclopedia-grid");

  encyclopediaPagination =
    document.querySelector("#encyclopedia-pagination");

  speciesModal = document.querySelector("#species-modal");
  speciesCloseButton = document.querySelector("#species-close");
  speciesImage = document.querySelector("#species-image");
  speciesCategory = document.querySelector("#species-category");
  speciesName = document.querySelector("#species-name");

  speciesScientificName =
    document.querySelector("#species-scientific-name");

  speciesDescription =
    document.querySelector("#species-description");

  touchGuide = document.querySelector(".touch-guide");

  /*설명창 닫기*/
  if (infoCloseButton) {
    infoCloseButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      closeInfoPanel();
    });
  }

  /*설명창 배경 터치*/
  if (infoPanel) {
    infoPanel.addEventListener("click", (event) => {
      if (event.target === infoPanel) {
        closeInfoPanel();
      }
    });
  }

  /*도감 아이콘*/
  if (encyclopediaButton) {
    encyclopediaButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      openEncyclopedia();
    });
  }

  /*도감 닫기*/
  if (encyclopediaCloseButton) {
    encyclopediaCloseButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      closeEncyclopedia();
    });
  }

  /*도감 배경 터치*/
  if (encyclopediaModal) {
    encyclopediaModal.addEventListener("click", (event) => {
      if (event.target === encyclopediaModal) {
        closeEncyclopedia();
      }
    });
  }

  /*생물 상세 닫기*/
  if (speciesCloseButton) {
    speciesCloseButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      closeSpeciesModal();
    });
  }

  /*생물 상세 배경 터치*/
  if (speciesModal) {
    speciesModal.addEventListener("click", (event) => {
      if (event.target === speciesModal) {
        closeSpeciesModal();
      }
    });
  }

  bindClickEvents();
});

/*설명창*/
function openInfoPanel(part) {
  const info = objectInfo[part];

  if (
    !info ||
    !infoPanel ||
    !infoCategory ||
    !infoTitle ||
    !infoDescription
  ) {
    return;
  }

  selectedPart = part;
  encyclopediaPage = 0;

  infoCategory.textContent = info.category;
  infoTitle.textContent = info.title;
  infoDescription.textContent = info.description;

  if (touchGuide) {
    touchGuide.classList.add("is-hidden");
  }

  infoPanel.classList.add("is-open");
  infoPanel.setAttribute("aria-hidden", "false");

  /*도감 버튼 표시 여부*/
  if (encyclopediaButton) {
    const hasEncyclopedia =
      info.hasEncyclopedia !== false;

    encyclopediaButton.classList.toggle(
      "is-visible",
      hasEncyclopedia
    );

    encyclopediaButton.setAttribute(
      "aria-hidden",
      hasEncyclopedia ? "false" : "true"
    );
  }
}

function closeInfoPanel() {
  if (infoPanel) {
    infoPanel.classList.remove("is-open");
    infoPanel.setAttribute("aria-hidden", "true");
  }

  if (encyclopediaButton) {
    encyclopediaButton.classList.remove("is-visible");
    encyclopediaButton.setAttribute("aria-hidden", "true");
  }

  closeSpeciesModal();
  closeEncyclopedia();

  if (touchGuide) {
    touchGuide.classList.remove("is-hidden");
  }

  selectedPart = null;
  encyclopediaPage = 0;
}

/*도감 열기·닫기*/
function openEncyclopedia() {
  if (!selectedPart) {
    return;
  }

  const encyclopedia =
    objectInfo[selectedPart]?.encyclopedia;

  if (
    !encyclopedia ||
    !encyclopediaModal ||
    !encyclopediaSubtitle ||
    !encyclopediaTitle
  ) {
    return;
  }

  encyclopediaSubtitle.textContent =
    encyclopedia.subtitle;

  encyclopediaTitle.textContent =
    encyclopedia.title;

  encyclopediaPage = 0;

  renderEncyclopediaPage();

  encyclopediaModal.classList.add("is-open");
  encyclopediaModal.setAttribute("aria-hidden", "false");
}

function closeEncyclopedia() {
  if (!encyclopediaModal) {
    return;
  }

  closeSpeciesModal();

  encyclopediaModal.classList.remove("is-open");
  encyclopediaModal.setAttribute("aria-hidden", "true");
}

/*도감 페이지 렌더링*/
function renderEncyclopediaPage() {
  if (
    !selectedPart ||
    !encyclopediaGrid ||
    !encyclopediaPagination
  ) {
    return;
  }

  const species =
    objectInfo[selectedPart]?.encyclopedia?.species || [];

  const pageCount = Math.max(
    1,
    Math.ceil(species.length / SPECIES_PER_PAGE)
  );

  encyclopediaPage = Math.min(
    Math.max(encyclopediaPage, 0),
    pageCount - 1
  );

  const startIndex =
    encyclopediaPage * SPECIES_PER_PAGE;

  const pageSpecies = species.slice(
    startIndex,
    startIndex + SPECIES_PER_PAGE
  );

  encyclopediaGrid.innerHTML = "";

  pageSpecies.forEach((speciesItem) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "encyclopedia-species-card";

    const image = document.createElement("img");
    image.className = "encyclopedia-species-image";
    image.src = speciesItem.image;
    image.alt = speciesItem.name;

    const name = document.createElement("p");
    name.className = "encyclopedia-species-name";
    name.textContent = speciesItem.name;

    const scientificName = document.createElement("p");
    scientificName.className =
      "encyclopedia-species-scientific";

    scientificName.textContent =
      speciesItem.scientificName;

    card.append(image, name, scientificName);

    /*도감 카드 클릭 시 상세 팝업 호출*/
    card.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      openSpeciesModal(speciesItem);
    });

    encyclopediaGrid.appendChild(card);
  });

  /*마지막 페이지에서도 2×2 레이아웃 유지*/
  while (
    encyclopediaGrid.children.length < SPECIES_PER_PAGE
  ) {
    const empty = document.createElement("div");
    empty.setAttribute("aria-hidden", "true");
    encyclopediaGrid.appendChild(empty);
  }

  renderPagination(pageCount);
}

/*페이지 점 생성*/
function renderPagination(pageCount) {
  if (!encyclopediaPagination) {
    return;
  }

  encyclopediaPagination.innerHTML = "";

  for (
    let pageIndex = 0;
    pageIndex < pageCount;
    pageIndex += 1
  ) {
    const dot = document.createElement("button");

    dot.type = "button";
    dot.className = "encyclopedia-page-dot";

    dot.setAttribute(
      "aria-label",
      `${pageIndex + 1}ページ`
    );

    if (pageIndex === encyclopediaPage) {
      dot.classList.add("is-active");
      dot.setAttribute("aria-current", "page");
    }

    dot.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      encyclopediaPage = pageIndex;
      renderEncyclopediaPage();
    });

    encyclopediaPagination.appendChild(dot);
  }
}

/*개별 생물 상세*/
function openSpeciesModal(speciesItem) {
  if (
    !speciesItem ||
    !speciesModal ||
    !speciesImage ||
    !speciesCategory ||
    !speciesName ||
    !speciesScientificName ||
    !speciesDescription
  ) {
    return;
  }

  /*기존 생물 상세 정보*/
  speciesImage.src = speciesItem.image;
  speciesImage.alt = speciesItem.name;

  speciesCategory.textContent = speciesItem.category;
  speciesName.textContent = speciesItem.name;

  speciesScientificName.textContent =
    speciesItem.scientificName;

  speciesDescription.textContent =
    speciesItem.description;

  /*기존 위도 요소 제거*/
  const oldLatitude =
    document.getElementById("species-latitude");

  if (oldLatitude) {
    oldLatitude.remove();
  }

  /*위도 요소 생성*/
  const latitudeElement =
    document.createElement("p");

  latitudeElement.id = "species-latitude";
  latitudeElement.className = "species-latitude";

  latitudeElement.textContent = speciesItem.latitude
    ? `生息緯度：${speciesItem.latitude}`
    : "生息緯度：資料未登録";

  /*학명 바로 아래에 위도 삽입*/
  speciesScientificName.insertAdjacentElement(
    "afterend",
    latitudeElement
  );

  /*상세 팝업 열기*/
  speciesModal.classList.add("is-open");

  speciesModal.setAttribute(
    "aria-hidden",
    "false"
  );
}

/*개별 생물 상세 닫기*/
function closeSpeciesModal() {
  if (!speciesModal) {
    return;
  }

  speciesModal.classList.remove("is-open");
  speciesModal.setAttribute("aria-hidden", "true");
}

/*AR 히트박스 클릭*/
function bindClickEvents() {
  document.querySelectorAll(".clickable").forEach(
    (object) => {
      object.removeEventListener(
        "click",
        handleObjectClick
      );

      object.addEventListener(
        "click",
        handleObjectClick
      );
    }
  );
}

function handleObjectClick(event) {
  if (gestureActive || blockObjectClick) {
    event.stopPropagation?.();
    return;
  }

  if (
    infoPanel &&
    infoPanel.classList.contains("is-open")
  ) {
    return;
  }

  const object = event.currentTarget;

  const part =
    object.dataset.part ||
    object.getAttribute("data-part");

  if (!part) {
    return;
  }

  console.log("Clicked:", part);
  openInfoPanel(part);
}

/*두 손가락 제스처*/
function getTouchDistance(touch1, touch2) {
  const deltaX = touch2.clientX - touch1.clientX;
  const deltaY = touch2.clientY - touch1.clientY;

  return Math.hypot(deltaX, deltaY);
}

function getTouchCenter(touch1, touch2) {
  return {
    x: (touch1.clientX + touch2.clientX) / 2,
    y: (touch1.clientY + touch2.clientY) / 2
  };
}

document.addEventListener(
  "touchstart",
  (event) => {
    if (
      infoPanel &&
      infoPanel.classList.contains("is-open")
    ) {
      return;
    }

    if (
      encyclopediaModal &&
      encyclopediaModal.classList.contains("is-open")
    ) {
      return;
    }

    if (
      speciesModal &&
      speciesModal.classList.contains("is-open")
    ) {
      return;
    }

    if (
      event.touches.length !== 2 ||
      !sceneRoot
    ) {
      return;
    }

    event.preventDefault();

    gestureActive = true;
    blockObjectClick = true;

    if (blockClickTimer) {
      clearTimeout(blockClickTimer);
      blockClickTimer = null;
    }

    const touch1 = event.touches[0];
    const touch2 = event.touches[1];

    startDistance =
      getTouchDistance(touch1, touch2);

    startCenter =
      getTouchCenter(touch1, touch2);

    const currentScale =
      sceneRoot.getAttribute("scale");

    const currentPosition =
      sceneRoot.getAttribute("position");

    if (currentScale) {
      startScale = currentScale.x;
    }

    if (currentPosition) {
      startPosition = {
        x: currentPosition.x,
        y: currentPosition.y,
        z: currentPosition.z
      };
    }
  },
  { passive: false }
);

document.addEventListener(
  "touchmove",
  (event) => {
    if (
      !gestureActive ||
      event.touches.length !== 2 ||
      !sceneRoot
    ) {
      return;
    }

    event.preventDefault();

    const touch1 = event.touches[0];
    const touch2 = event.touches[1];

    const currentDistance =
      getTouchDistance(touch1, touch2);

    const currentCenter =
      getTouchCenter(touch1, touch2);

    /*확대·축소*/
    if (startDistance > 0) {
      const scaleRatio =
        currentDistance / startDistance;

      const newScale = Math.min(
        Math.max(startScale * scaleRatio, 15),
        100
      );

      sceneRoot.setAttribute(
        "scale",
        `${newScale} ${newScale} ${newScale}`
      );
    }

    /*이동*/
    const deltaX =
      currentCenter.x - startCenter.x;

    const deltaY =
      currentCenter.y - startCenter.y;

    const moveSensitivity = 0.5;

    const newX =
      startPosition.x + deltaX * moveSensitivity;

    const newY =
      startPosition.y - deltaY * moveSensitivity;

    sceneRoot.setAttribute(
      "position",
      `${newX} ${newY} ${startPosition.z}`
    );
  },
  { passive: false }
);

document.addEventListener(
  "touchend",
  (event) => {
    if (
      gestureActive &&
      event.touches.length < 2
    ) {
      gestureActive = false;

      blockClickTimer = setTimeout(() => {
        blockObjectClick = false;
        blockClickTimer = null;
      }, 350);
    }
  },
  { passive: false }
);

document.addEventListener(
  "touchcancel",
  () => {
    gestureActive = false;

    blockClickTimer = setTimeout(() => {
      blockObjectClick = false;
      blockClickTimer = null;
    }, 350);
  },
  { passive: false }
);

/*
const naturalLatitudeData = {
  "Schizophyllum commune": {
    latitude: null,
    distribution: "南極大陸を除く世界各地"
  },
  "Carabus insulicola": {
    latitude: null,
    distribution: "日本の本州中部以北を中心に分布"
  }
};
*/

/*
function updateSpeciesLatitude(speciesItem) {
  const data =
    naturalLatitudeData[speciesItem.scientificName];

  const latitude =
    data?.latitude || "緯度範囲は未確定";

  return latitude;
}
*/
