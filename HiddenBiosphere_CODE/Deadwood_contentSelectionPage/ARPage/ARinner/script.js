/*전역 DOM 요소*/
let sceneRoot;

/* 간단 설명창 */
let infoPanel;
let infoCloseButton;
let infoCategory;
let infoTitle;
let infoDescription;

/* 가이드 */
let touchGuide;

/* 도감 */
let encyclopediaButton;
let encyclopediaModal;
let encyclopediaCloseButton;
let encyclopediaSubtitle;
let encyclopediaTitle;
let encyclopediaGrid;
let encyclopediaPagination;
let encyclopediaBugSymbol;
let encyclopediaLarvaSymbol;

/* 개별 생물 상세 */
let speciesModal;
let speciesCloseButton;
let speciesImage;
let speciesCategory;
let speciesName;
let speciesScientificName;
let speciesDescription;

/* 현재 선택 상태 */
let selectedPart = null;
let encyclopediaPage = 0;

/*두 손가락 제스처 상태*/
let gestureActive = false;
let blockObjectClick = false;
let blockClickTimer = null;
let startDistance = 0;
let startCenter = {
  x: 0,
  y: 0
};
let startScale = 40;
let startPosition = {
  x: 200,
  y: -40,
  z: -100
};

/*AR.js 로딩 화면*/
function hideLoader() {
  const loader =
    document.querySelector(
      ".arjs-loader"
    );
  if (loader) {
    loader.style.display = "none";
  }
}
window.addEventListener(
  "arjs-nft-loaded",
  hideLoader
);
/* 10초 안전장치 */
setTimeout(
  hideLoader,
  10000
);

/*모바일 AR 터치 Raycaster*/
AFRAME.registerComponent(
  "ar-touch-raycaster",
  {
    init: function () {
      this.raycaster =
        new THREE.Raycaster();
      this.pointer =
        new THREE.Vector2();
      this.onTouchStart =
        this.onTouchStart.bind(this);
      window.addEventListener(
        "touchstart",
        this.onTouchStart,
        {
          passive: false
        }
      );
    },

    onTouchStart: function (event) {
      const target =
        event.target;

      /* HTML UI 터치는 AR에서 제외 */
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

      /* 설명창이 열려 있으면 차단 */
      if (
        infoPanel &&
        infoPanel.classList.contains(
          "is-open"
        )
      ) {
        return;
      }

      /* 한 손가락 터치만 사용 */
      if (
        event.touches.length !== 1 ||
        gestureActive ||
        blockObjectClick
      ) {
        return;
      }

      const sceneElement =
        this.el.sceneEl;
      if (!sceneElement) {
        return;
      }

      const camera =
        sceneElement.camera;
      const canvas =
        sceneElement.canvas;

      if (
        !camera ||
        !canvas
      ) {
        return;
      }

      const touch =
        event.touches[0];
      const rect =
        canvas.getBoundingClientRect();

      if (
        rect.width === 0 ||
        rect.height === 0
      ) {
        return;
      }

      /* 터치 좌표 변환 */
      this.pointer.x =
        (
          (
            touch.clientX -
            rect.left
          ) /
          rect.width
        ) * 2 - 1;

      this.pointer.y =
        -(
          (
            touch.clientY -
            rect.top
          ) /
          rect.height
        ) * 2 + 1;

      camera.updateMatrixWorld(
        true
      );

      this.raycaster.setFromCamera(
        this.pointer,
        camera
      );

      const clickableElements =
        Array.from(
          document.querySelectorAll(
            ".clickable"
          )
        );

      const objectsToIntersect = [];

      clickableElements.forEach(
        (element) => {
          if (!element.object3D) {
            return;
          }

          const part =
            element.dataset.part ||
            element.getAttribute(
              "data-part"
            );

          element.object3D
            .updateMatrixWorld(
              true
            );

          element.object3D.traverse(
            (child) => {
              child.userData.arPart =
                part;
              child.userData
                .arClickableElement =
                element;

              if (child.isMesh) {
                objectsToIntersect.push(
                  child
                );
              }
            }
          );
        }
      );

      const intersections =
        this.raycaster
          .intersectObjects(
            objectsToIntersect,
            false
          );

      if (
        intersections.length === 0
      ) {
        console.log(
          "터치된 히트박스 없음"
        );
        return;
      }
      const intersection =
        intersections[0];
      const part =
        intersection.object
          .userData.arPart;
      const clickableElement =
        intersection.object
          .userData
          .arClickableElement;

      if (
        !part ||
        !clickableElement
      ) {
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
      openInfoPanel(
        part
      );
    },
    remove: function () {
      window.removeEventListener(
        "touchstart",
        this.onTouchStart
      );
    }
  }
);

/*유충 공통 도감
바구미류 유충
비단벌레류 유충
방아벌레류 유충*/
const larvaEncyclopedia = {
  subtitle:
    "倒木の中\n微小生態系",
  title:
    "幼虫",
  species: [
    {
      name:
        "ゾウムシ類の幼虫",
      scientificName:
        "Weevil larva",
      latitude: "南緯約55°〜北緯約82°（熱帯〜寒帯）",
      image:
        "../../../assets/Deadwood/EncyclopediaPage/zoumusiruinoyouchixyuu.png",
/*Oberprieler, R. G. (2014).
Curculionoidea Latreille, 1802: Introduction, Phylogeny.
Handbook of Zoology: Coleoptera, Beetles, Volume 3.
https://www.researchgate.net/publication/309456766_Curculionoidea_Latreille_1802_introduction_phylogeny

Oberprieler, R. G., Marvaldi, A. E., & Anderson, R. S. (2007).
Weevils, weevils, weevils everywhere.
Zootaxa, 1668(1), 491–520.
https://doi.org/10.11646/zootaxa.1668.1.24
*/
      category:
        "昆虫・幼虫",
      description:
        "ゾウムシ類の幼虫の中には、枯死木や弱った木の内部で成長するものがいる。幼虫は木の組織を利用しながら成長し、その活動によって木の内部に通路や食痕が残る。"
    },
    {
      name:
        "タマムシ類の幼虫",
      scientificName:
        "Jewel beetle larva / Flatheaded wood borer larva",
      latitude: "南緯約50°〜北緯約65°（熱帯〜亜寒帯）",
/*Levey, B. (1977).
Coleoptera: Buprestidae.
Handbooks for the Identification of British Insects, 5(1b).
Royal Entomological Society.
https://www.royensoc.co.uk/wp-content/uploads/2021/12/Vol05_Part01b.pdf

Ruzzier, E., Haack, R. A., Curletti, G., Roques, A.,
Volkovitsh, M. G., & Battisti, A. (2023).
Jewels on the go: exotic buprestids around the world
(Coleoptera, Buprestidae).
NeoBiota, 84, 107–135.
https://doi.org/10.3897/neobiota.84.90829

Jendek, E., & Grebennikov, V. V. (2023).
Summary of native geographic distribution of all 3,341 species
of the most speciose animal genus Agrilus (Coleoptera: Buprestidae).
Journal of Insect Biodiversity, 39(2), 32–78.
https://doi.org/10.12976/jib/2023.39.2.1
*/
      image:
        "../../../assets/Deadwood/EncyclopediaPage/tamamusiruinoyuuchixyuu.png",
      category:
        "昆虫・幼虫",
      description:
        "タマムシ類の幼虫の多くは、樹皮の下や木材の内部で成長する。幼虫は木の組織を食べながら進み、内部に平たい通路や食痕を残す。こうした活動によって木材の内部に空間が生まれ、倒木を利用するほかの生物の生息環境にもつながっていく。"
    },
    {
      name:
        "コメツキムシ類の幼虫",
      scientificName:
        "Click beetle larva / Wireworm",
      latitude: "南緯約55°〜北緯約75°（熱帯〜寒帯）",
/*
Douglas, H. B., Etzler, F. E., Johnson, P. J., & Hammond, H. E. J. (2024).
Matrix-based key to the click beetle genera of Canada and USA with a summary of habitat use (Coleoptera, Elateridae).
ZooKeys, 1200, 75–144.
https://doi.org/10.3897/zookeys.1200.119315

Oba, Y., et al. (2015).
DNA Barcoding of Japanese Click Beetles (Coleoptera, Elateridae).
PLOS ONE, 10(1), e0116612.
https://doi.org/10.1371/journal.pone.0116612

University of Michigan.
BioKIDS: Elateridae (Click Beetles).
https://www.biokids.umich.edu/critters/Elateridae/
*/
      image:
        "../../../assets/Deadwood/EncyclopediaPage/kometukimusiruinoyuuchixyuu.png",
      category:
        "昆虫・幼虫",
      description:
        "コメツキムシ類の幼虫には、朽ちた木の内部や樹皮の下で生活するものがいる。腐朽が進んだ木材のすき間や、ほかの昆虫がつくった通路などを利用しながら生活し、倒木内部の微小な生態系を構成する生物の一つとなっている。"
    },
    {
      name:
        "大型カミキリムシ類の幼虫",
      scientificName:
        "Large longhorn beetle larva",
      latitude: "南緯約55°〜北緯約70°（熱帯〜亜寒帯）",
/*
Rossa, R., & Goczał, J. (2021).
Global diversity and distribution of longhorn beetles (Coleoptera: Cerambycidae).
The European Zoological Journal, 88(1), 289–302.
https://doi.org/10.1080/24750263.2021.1883129

Haack, R. A., Keena, M. A., & Eyre, D. (2017).
Life history and population dynamics of Cerambycidae.
In Q. Wang (Ed.), Cerambycidae of the World: Biology and Pest Management (pp. 71–103).
CRC Press.
https://research.fs.usda.gov/treesearch/54548
 */
      image:
        "../../../assets/Deadwood/EncyclopediaPage/longhornbeetlelarva.png",
      category:
        "昆虫・幼虫",
      description:
        "大型カミキリムシ類の幼虫は、枯死木や弱った木の内部で成長する。木の組織を利用しながら太い通路や食痕を残し、木材が分解されていく過程に関わっている。"
    }
  ]
};

/*AR 오브젝트와 도감 데이터 */
const objectInfo = {
  /*나무좀*/
  barkbeetle: {
    category:
      "昆虫",
    title:
      "キクイムシ",
    description:
      "キクイムシは、樹皮の下や木材の内部に入り込む小さな甲虫の仲間である。枯死木や弱った木の中に通路をつくり、幼虫はその内部で成長する。木の表面に残る小さな穴や、樹皮の下に広がる細い通路は、キクイムシが木の中を利用していた痕跡である。",
    encyclopedia: {
      subtitle:
        "倒木の中\n微小生態系",
      title:
        "昆虫",
      species: [
        {
          name:
            "ヒラタキクイムシ",
          scientificName:
            "Lyctus brunneus",
          latitude: "南緯約45°〜北緯約60°（熱帯〜冷温帯）",
/*
Natural History Museum.
Powder-post beetle (Lyctus brunneus) identification guide.
https://www.nhm.ac.uk/take-part/identify-nature/common-insect-pest-species-in-homes/powder-post-beetle-lyctus-brunneus-identification-guide.html

Australian Government, Department of Agriculture, Water and the Environment. (2021).
Final Pest Risk Analysis for Cut Flower and Foliage Imports – Part 2.
p. 135.
https://www.agriculture.gov.au/sites/default/files/documents/final-report-cut-flowers-foliage-imports-part-2.pdf

Schrader, G., & Wilstermann, A. (2019).
Express PRA for Lyctus brunneus – Interception.
Julius Kühn-Institut.
https://pflanzengesundheit.julius-kuehn.de/dokumente/upload/Lyctus-brunneus_exprPRA_191218_en.pdf
*/
          image:
            "../../../assets/Deadwood/EncyclopediaPage/hiratakikuimusi.png",
          category:
            "昆虫",
          description:
            "ヒラタキクイムシは、乾燥した広葉樹材に小さな穴をあける甲虫の仲間である。幼虫は木材の内部を食べながら成長し、成虫になると表面に小さな脱出孔をあけて外へ出る。木の表面に残る細かな木粉や小さな穴は、内部で昆虫が活動していた痕跡である。"
        },
        {
          name:
            "カキノフタトゲナガシンクイ",
          scientificName:
            "Sinoxylon japonicum",
          latitude: "北緯約20°〜45°（亜熱帯〜冷温帯）",
/*
日本産ナガシンクイムシ科のリスト
(List of Japanese Bostrichidae).
SAYABANE New Series, No. 55 (2024).
https://researchmap.jp/maruhananomi/misc/49669441/attachment_file.pdf

Zhang, Y.-F., Meng, L.-Z., & Beaver, R. A. (2022).
A review of the non-lyctine powder-post beetles of Yunnan (China)
with a new genus and new species (Coleoptera: Bostrichidae).
Zootaxa, 5091(4), 501–545.
https://doi.org/10.11646/zootaxa.5091.4.1

Species record:
https://treatment.plazi.org/GgServer/html/6D613513FFD6CB45FF03FD01FAE0B910
*/
          image:
            "../../../assets/Deadwood/EncyclopediaPage/kakinohutatogenagasinnkui.png",
          category:
            "昆虫",
          description:
            "カキノフタトゲナガシンクイは、枯死木や弱った木の内部に入り込み、木材に小さな穴や通路をつくる甲虫である。幼虫は木の内部を利用しながら成長し、表面に残る穴や木くずは、昆虫が木の中で活動していた痕跡となる。"
        },
        {
          name:
            "ニレカワノキクイムシ",
          scientificName:
            "Scolytus frontalis",
          latitude: "北緯約24°〜40°（亜熱帯〜温帯）",
/*
Bark and Ambrosia Beetles of the World.
Scolytus frontalis Blandford, 1894.
https://barkandambrosiabeetles.org/beetle/scolytus-frontalis/

Forest Experiment Station, Japan.
Bulletin of the Government Forest Experiment Station, No. 258.
https://www.ffpri.go.jp/labs/kanko/258-2.pdf

Scolytus frontalis Blandford, 1894.
Taxonomic treatment in a Korean Scolytinae study.
Seoul National University Repository.
https://s-space.snu.kr/bitstream/10371/119533/1/000000137372.pdf
*/
          image:
            "../../../assets/Deadwood/EncyclopediaPage/nirekawanokikuimusi.png",
          category:
            "昆虫",
          description:
            "ニレカワノキクイムシは、ケヤキなどの樹皮の下や木材の内部に入り込み、通路をつくる小さな甲虫である。幼虫は木の内部で成長し、表面に残る小さな穴や木くずは、昆虫が木の中で活動していた痕跡となる。"
        },
        {
          name:
            "チュウゴクツヤナガシンクイ",
          scientificName:
            "Calophagus pekinensis",
          latitude: "北緯約30°〜40°（暖温帯〜温帯）",
/*Liu, L.-Y. (2021).
Review of the genera Xylothrips Lesne, 1901 and Calophagus Lesne, 1902 (Coleoptera: Bostrichidae: Xyloperthini).
European Journal of Taxonomy, 746, 130–147.
https://www.zobodat.at/pdf/EJT_0746_0130-0147.pdf

日本産ナガシンクイムシ科のリスト
[List of Japanese Bostrichidae].
SAYABANE New Series, No. 55 (2024).
https://researchmap.jp/maruhananomi/misc/49669441/attachment_file.pdf

Park, S., Lee, S., & Hong, K.-J. (2015).
Review of the family Bostrichidae (Coleoptera) of Korea.
Journal of Asia-Pacific Biodiversity, 8(4), 298–304.
https://doi.org/10.1016/j.japb.2015.10.015
*/
          image:
            "../../../assets/Deadwood/EncyclopediaPage/chixyuugokutuyanagasinnkui.png",
          category:
            "昆虫",
          description:
            "チュウゴクツヤナガシンクイは、枯死木や弱った木の内部に入り込み、木材に小さな穴や通路をつくる甲虫である。木の表面に残る穴や木くずは、内部で昆虫が活動していた痕跡となる。"
        },
        
      ]
    }
  },

  /*바구미류 유충 3D 오브젝트*/
  weevillarva: {
    category:
      "昆虫・幼虫",
    title:
      "ゾウムシ類の幼虫",
    description:
      "ゾウムシ類の幼虫は、枯死木や弱った木の樹皮の下、柔らかくなった木材の内部などを利用して成長する昆虫の幼虫である。木の内部を食べながら移動し、小さな通路や食痕を残す。その痕跡は、枯死木の中で昆虫が活動していたことを示している。",


    /*공통 유충 도감*/
    encyclopedia:
      larvaEncyclopedia
  },

  /*하늘소류 유충 3D 오브젝트*/
  longhornbeetlelarva: {
    category:
      "昆虫・幼虫",
    title:
      "カミキリムシ類の幼虫",
    description:
      "カミキリムシ類の幼虫の多くは木の内部で成長する。枯死木の組織を食べながら太い通路を掘り、木材を細かくすることで、倒木の分解過程に関わっている。",
    encyclopedia:
      larvaEncyclopedia
  }
};

/*한 페이지에 표시할 카드 수*/
const SPECIES_PER_PAGE = 4;

/*DOM*/
document.addEventListener(
  "DOMContentLoaded",
  () => {

    sceneRoot =
      document.querySelector(
        "#scene-root"
      );

    infoPanel =
      document.querySelector(
        "#info-panel"
      );

    infoCloseButton =
      document.querySelector(
        "#info-close"
      );

    infoCategory =
      document.querySelector(
        "#info-category"
      );

    infoTitle =
      document.querySelector(
        "#info-title"
      );

    infoDescription =
      document.querySelector(
        "#info-description"
      );

    encyclopediaButton =
      document.querySelector(
        "#encyclopedia-button"
      );

    encyclopediaModal =
      document.querySelector(
        "#encyclopedia-modal"
      );

    encyclopediaCloseButton =
      document.querySelector(
        "#encyclopedia-close"
      );

    encyclopediaSubtitle =
      document.querySelector(
        "#encyclopedia-subtitle"
      );

    encyclopediaTitle =
      document.querySelector(
        "#encyclopedia-title"
      );

    encyclopediaGrid =
      document.querySelector(
        "#encyclopedia-grid"
      );

    encyclopediaPagination =
      document.querySelector(
        "#encyclopedia-pagination"
      );

    encyclopediaBugSymbol =
      document.querySelector(
        ".encyclopedia-symbol.bug"
      );

    encyclopediaLarvaSymbol =
      document.querySelector(
        ".encyclopedia-symbol.larva"
      );

    speciesModal =
      document.querySelector(
        "#species-modal"
      );

    speciesCloseButton =
      document.querySelector(
        "#species-close"
      );

    speciesImage =
      document.querySelector(
        "#species-image"
      );

    speciesCategory =
      document.querySelector(
        "#species-category"
      );

    speciesName =
      document.querySelector(
        "#species-name"
      );

    speciesScientificName =
      document.querySelector(
        "#species-scientific-name"
      );

    speciesDescription =
      document.querySelector(
        "#species-description"
      );

    touchGuide =
      document.querySelector(
        ".touch-guide"
      );

    /*설명창 닫기*/
    if (infoCloseButton) {
      infoCloseButton.addEventListener(
        "click",
        (event) => {
          event.preventDefault();
          event.stopPropagation();
          closeInfoPanel();
        }
      );
    }

    /*설명창 배경*/
    if (infoPanel) {
      infoPanel.addEventListener(
        "click",
        (event) => {
          if (
            event.target ===
            infoPanel
          ) {
            closeInfoPanel();
          }
        }
      );
    }

    /*도감 아이콘*/
    if (encyclopediaButton) {
      encyclopediaButton.addEventListener(
        "click",
        (event) => {
          event.preventDefault();
          event.stopPropagation();
          openEncyclopedia();
        }
      );
    }

    /*도감 닫기*/
    if (encyclopediaCloseButton) {
      encyclopediaCloseButton
        .addEventListener(
          "click",
          (event) => {
            event.preventDefault();
            event.stopPropagation();
            closeEncyclopedia();
          }
        );
    }

    /*도감 배경 터치*/
    if (encyclopediaModal) {
      encyclopediaModal
        .addEventListener(
          "click",
          (event) => {
            if (
              event.target ===
              encyclopediaModal
            ) {
              closeEncyclopedia();
            }
          }
        );
    }
    /*상세 팝업 닫기*/
    if (speciesCloseButton) {
      speciesCloseButton
        .addEventListener(
          "click",
          (event) => {
            event.preventDefault();
            event.stopPropagation();
            closeSpeciesModal();
          }
        );
    }

    /*상세 팝업 배경 터치*/
    if (speciesModal) {
      speciesModal.addEventListener(
        "click",
        (event) => {
          if (
            event.target ===
            speciesModal
          ) {
            closeSpeciesModal();
          }
        }
      );
    }
    bindClickEvents();
  }
);

/*설명창 열기*/
function openInfoPanel(part) {
  const info =
    objectInfo[part];
  if (
    !info ||
    !infoPanel ||
    !infoCategory ||
    !infoTitle ||
    !infoDescription
  ) {
    return;
  }

  selectedPart =
    part;

  encyclopediaPage =
    0;

  infoCategory.textContent =
    info.category;

  infoTitle.textContent =
    info.title;

  infoDescription.textContent =
    info.description;

  /* 중앙 터치 가이드 숨김 */
  if (touchGuide) {
    touchGuide.classList.add(
      "is-hidden"
    );
  }

  infoPanel.classList.add(
    "is-open"
  );

  infoPanel.setAttribute(
    "aria-hidden",
    "false"
  );

  /* 도감 버튼 표시 */
  if (encyclopediaButton) {
    const hasEncyclopedia =
      info.hasEncyclopedia !==
      false;
    encyclopediaButton
      .classList.toggle(
        "is-visible",
        hasEncyclopedia
      );
    encyclopediaButton
      .setAttribute(
        "aria-hidden",
        hasEncyclopedia
          ? "false"
          : "true"
      );
  }
}

/*설명창 닫기*/
function closeInfoPanel() {
  if (infoPanel) {
    infoPanel.classList.remove(
      "is-open"
    );
    infoPanel.setAttribute(
      "aria-hidden",
      "true"
    );
  }

  if (encyclopediaButton) {
    encyclopediaButton
      .classList.remove(
        "is-visible"
      );
    encyclopediaButton
      .setAttribute(
        "aria-hidden",
        "true"
      );
  }
  closeSpeciesModal();
  closeEncyclopedia();
  if (touchGuide) {
    touchGuide.classList.remove(
      "is-hidden"
    );
  }
  selectedPart =
    null;
  encyclopediaPage =
    0;
}

/*도감 열기*/
function openEncyclopedia() {
  if (!selectedPart) {
    return;
  }
  const encyclopedia =
    objectInfo[selectedPart]
      ?.encyclopedia;
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

  /*도감 상단 장식 전환 */
  const isLarva =
    selectedPart ===
      "weevillarva" ||
    selectedPart ===
      "longhornbeetlelarva";

  /*나무좀 도감*/
  if (encyclopediaBugSymbol) {
    encyclopediaBugSymbol
      .classList.toggle(
        "is-hidden",
        isLarva
      );
  }

  /*유충 도감*/

  if (encyclopediaLarvaSymbol) {
    encyclopediaLarvaSymbol
      .classList.toggle(
        "is-hidden",
        !isLarva
      );
  }
  encyclopediaPage =
    0;
  renderEncyclopediaPage();
  encyclopediaModal.classList.add(
    "is-open"
  );
  encyclopediaModal.setAttribute(
    "aria-hidden",
    "false"
  );
}

/*도감 닫기 */
function closeEncyclopedia() {
  if (!encyclopediaModal) {
    return;
  }

  closeSpeciesModal();

  encyclopediaModal
    .classList.remove(
      "is-open"
    );

  encyclopediaModal
    .setAttribute(
      "aria-hidden",
      "true"
    );
}

/*도감 페이지 렌더링 */
function renderEncyclopediaPage() {
  if (
    !selectedPart ||
    !encyclopediaGrid ||
    !encyclopediaPagination
  ) {
    return;
  }

  const species =
    objectInfo[selectedPart]
      ?.encyclopedia
      ?.species || [];

  const pageCount =
    Math.max(
      1,
      Math.ceil(
        species.length /
        SPECIES_PER_PAGE
      )
    );

  encyclopediaPage =
    Math.min(
      Math.max(
        encyclopediaPage,
        0
      ),
      pageCount - 1
    );
  const startIndex =
    encyclopediaPage *
    SPECIES_PER_PAGE;
  const pageSpecies =
    species.slice(
      startIndex,
      startIndex +
      SPECIES_PER_PAGE
    );
  encyclopediaGrid.innerHTML =
    "";
  pageSpecies.forEach(
    (speciesItem) => {

      const card =
        document.createElement(
          "button"
        );
      card.type =
        "button";
      card.className =
        "encyclopedia-species-card";

      /* 이미지 */
      const image =
        document.createElement(
          "img"
        );
      image.className =
        "encyclopedia-species-image";
      image.src =
        speciesItem.image;
      image.alt =
        speciesItem.name;
      /* 이름 */
      const name =
        document.createElement(
          "p"
        );
      name.className =
        "encyclopedia-species-name";
      name.textContent =
        speciesItem.name;
      /* 학명 */
      const scientificName =
        document.createElement(
          "p"
        );
      scientificName.className =
        "encyclopedia-species-scientific";
      scientificName.textContent =
        speciesItem.scientificName;
      card.append(
        image,
        name,
        scientificName
      );
      card.addEventListener(
        "click",
        (event) => {
          event.preventDefault();
          event.stopPropagation();
          openSpeciesModal(
            speciesItem
          );
        }
      );
      encyclopediaGrid.appendChild(
        card
      );
    }
  );

  /*2×2 레이아웃 유지 */
  while (
    encyclopediaGrid.children.length <
    SPECIES_PER_PAGE
  ) {
    const empty =
      document.createElement(
        "div"
      );
    empty.setAttribute(
      "aria-hidden",
      "true"
    );
    encyclopediaGrid.appendChild(
      empty
    );
  }
  renderPagination(
    pageCount
  );
}

/*페이지 점 생성 */
function renderPagination(
  pageCount
) {

  if (!encyclopediaPagination) {
    return;
  }
  encyclopediaPagination.innerHTML =
    "";

  for (
    let pageIndex = 0;
    pageIndex < pageCount;
    pageIndex += 1
  ) {

    const dot =
      document.createElement(
        "button"
      );
    dot.type =
      "button";
    dot.className =
      "encyclopedia-page-dot";
    dot.setAttribute(
      "aria-label",
      `${pageIndex + 1}ページ`
    );

    if (
      pageIndex ===
      encyclopediaPage
    ) {
      dot.classList.add(
        "is-active"
      );
      dot.setAttribute(
        "aria-current",
        "page"
      );
    }
    dot.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        event.stopPropagation();
        encyclopediaPage =
          pageIndex;
        renderEncyclopediaPage();
      }
    );
    encyclopediaPagination
      .appendChild(
        dot
      );
  }
}

/*개별 생물 상세 */
function openSpeciesModal(
  speciesItem
) {
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
  speciesImage.src =
    speciesItem.image;
  speciesImage.alt =
    speciesItem.name;
  speciesCategory.textContent =
    speciesItem.category;
  speciesName.textContent =
    speciesItem.name;
  speciesScientificName.textContent =
    speciesItem.scientificName;
  speciesDescription.textContent =
    speciesItem.description;
  speciesModal.classList.add(
    "is-open"
  );
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

  speciesModal.classList.remove(
    "is-open"
  );

  speciesModal.setAttribute(
    "aria-hidden",
    "true"
  );
}

/* AR 히트박스 클릭*/

function bindClickEvents() {
  document
    .querySelectorAll(
      ".clickable"
    )
    .forEach(
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

function handleObjectClick(
  event
) {
  if (
    gestureActive ||
    blockObjectClick
  ) {
    event.stopPropagation?.();
    return;
  }

  if (
    infoPanel &&
    infoPanel
      .classList
      .contains(
        "is-open"
      )
  ) 
  {
    return;
  }

  const object =
    event.currentTarget;
  const part =
    object.dataset.part ||
    object.getAttribute(
      "data-part"
    );

  if (!part) {
    return;
  }
  console.log(
    "Clicked:",
    part
  );
  openInfoPanel(
    part
  );
}

/*두 손가락 거리 계산*/
function getTouchDistance(
  touch1,
  touch2
) {
  const deltaX =
    touch2.clientX -
    touch1.clientX;
  const deltaY =
    touch2.clientY -
    touch1.clientY;
  return Math.hypot(
    deltaX,
    deltaY
  );
}

/*두 손가락 중심 계산*/
function getTouchCenter(
  touch1,
  touch2
) {
  return {
    x:
      (
        touch1.clientX +
        touch2.clientX
      ) / 2,
    y:
      (
        touch1.clientY +
        touch2.clientY
      ) / 2
  };
}

/*두 손가락 제스처 시작*/
document.addEventListener(
  "touchstart",
  (event) => {
    if (
      infoPanel &&
      infoPanel
        .classList
        .contains(
          "is-open"
        )
    )
    {
      return;
    }

    if (
      encyclopediaModal &&
      encyclopediaModal
        .classList
        .contains(
          "is-open"
        )
    ) 
    {
      return;
    }

    if (
      speciesModal &&

      speciesModal
        .classList
        .contains(
          "is-open"
        )
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
    gestureActive =
      true;
    blockObjectClick =
      true;

    if (blockClickTimer) {
      clearTimeout(
        blockClickTimer
      );
      blockClickTimer =
        null;
    }

    const touch1 =
      event.touches[0];
    const touch2 =
      event.touches[1];
    startDistance =
      getTouchDistance(
        touch1,
        touch2
      );
    startCenter =
      getTouchCenter(
        touch1,
        touch2
      );
    const currentScale =
      sceneRoot.getAttribute(
        "scale"
      );
    const currentPosition =
      sceneRoot.getAttribute(
        "position"
      );
    if (currentScale) {
      startScale =
        currentScale.x;
    }

    if (currentPosition) {
      startPosition = {
        x:
          currentPosition.x,
        y:
          currentPosition.y,
        z:
          currentPosition.z
      };
    }
  },
  {
    passive: false
  }
);

/*두 손가락 확대 + 이동*/
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
    const touch1 =
      event.touches[0];
    const touch2 =
      event.touches[1];
    const currentDistance =
      getTouchDistance(
        touch1,
        touch2
      );
    const currentCenter =
      getTouchCenter(
        touch1,
        touch2
      );

    /* 확대·축소 */
    if (startDistance > 0) {
      const scaleRatio =
        currentDistance /
        startDistance;
      const newScale =
        Math.min(
          Math.max(
            startScale *
            scaleRatio,
            15
          ),
          100
        );
      sceneRoot.setAttribute(
        "scale",
        `${newScale} ${newScale} ${newScale}`
      );
    }

    /* 이동 */
    const deltaX =
      currentCenter.x -
      startCenter.x;
    const deltaY =
      currentCenter.y -
      startCenter.y;
    const moveSensitivity =
      0.5;
    const newX =
      startPosition.x +
      deltaX *
      moveSensitivity;
    const newY =
      startPosition.y -
      deltaY *
      moveSensitivity;
    sceneRoot.setAttribute(
      "position",
      `${newX} ${newY} ${startPosition.z}`
    );
  },
  {
    passive: false
  }
);

/*제스처 종료*/

document.addEventListener(
  "touchend",
  (event) => {
    if (
      gestureActive &&
      event.touches.length < 2
    ) {
      gestureActive =
        false;
      blockClickTimer =
        setTimeout(
          () => {
            blockObjectClick =
              false;
            blockClickTimer =
              null;
          },
          350
        );
    }
  },
  {
    passive: false
  }
);

/*제스처 취소*/
document.addEventListener(
  "touchcancel",
  () => {
    gestureActive =
      false;
    blockClickTimer =
      setTimeout(
        () => {
          blockObjectClick =
            false;
          blockClickTimer =
            null;
        },
        350
      );
  },
  {
    passive: false
  }
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

function updateSpeciesLatitude(speciesItem) {
  const data =
    naturalLatitudeData[speciesItem.scientificName];
  const latitude =
    data?.latitude || "緯度範囲は未確定";
  return latitude;
}
*/