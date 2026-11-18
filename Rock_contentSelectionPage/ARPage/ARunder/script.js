
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
    window.addEventListener("touchstart", this.onTouchStart, { passive: false });
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
    if (infoPanel && infoPanel.classList.contains("is-open")) {
      return;
    }
    if (event.touches.length !== 1 || gestureActive || blockObjectClick) {
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
    this.pointer.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
    camera.updateMatrixWorld(true);
    this.raycaster.setFromCamera(this.pointer, camera);

    const clickableElements = Array.from(
      document.querySelectorAll(".clickable")
    );
    const objectsToIntersect = [];

    /*각 히트박스와 자식 메쉬에 data-part 저장*/
    clickableElements.forEach((element) => {
      if (!element.object3D) return;
      const part = element.dataset.part || element.getAttribute("data-part");
      element.object3D.updateMatrixWorld(true);
      element.object3D.traverse((child) => {
        child.userData.arPart = part;
        child.userData.arClickableElement = element;
        if (child.isMesh) {
          objectsToIntersect.push(child);
        }
      });
    });

    const intersections = this.raycaster.intersectObjects(
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
    window.removeEventListener("touchstart", this.onTouchStart);
  }
});

/*AR 오브젝트와 도감 데이터*/
const objectInfo = {
  noraegi: {
    category: "倍脚綱",
    title: "ヤスデ類",
    description: "ヤスデ類は、森林の落ち葉や腐植土、石や倒木の周辺など、湿り気のある場所に生息する節足動物である。多くの種は落ち葉や腐りかけた植物などを食べ、有機物を細かくすることで分解過程に関わっている。体は多数の節からなり、胴体の多くの節に2対の脚を持つ。危険を感じると体を丸めたり、防御物質を分泌したりする種類もいる。",
    encyclopedia: {
      subtitle: "岩の下\n微小生態系",
      title: "ヤスデ類",
      species: [
        {
          category: "ヤスデ類",
          name: "ヤケヤスデ",
          scientificName: "Oxidus gracilis",
          latitude: "南緯約40°〜北緯約55°（熱帯〜温帯を中心に広く分布）",
/*
Nguyen, A. D., Korsós, Z., Jang, K.-H., & Hwang, U.-W. (2017).
A revision and phylogenetic analysis of the millipede genus
Oxidus Cook, 1911 (Polydesmida, Paradoxosomatidae).
European Journal of Taxonomy, 293, 1–22.
https://doi.org/10.5852/ejt.2017.293

British Myriapod and Isopod Group.
Oxidus gracilis (C. L. Koch, 1847).
https://bmig.org.uk/species/oxidus-gracilis

Asano, M. et al. (2019).
Japanese Journal of Environmental Entomology and Zoology,
30(2), 39–49.
https://www.jstage.jst.go.jp/article/jjeez/30/2/30_39/_pdf

Iniesta, L. F. M. et al. (2021).
A preliminary survey and range extension of millipedes
species introduced in Brazil (Myriapoda, Diplopoda).
Papéis Avulsos de Zoologia, 61, e20216188.
https://www.scielo.br/j/paz/a/hFkVKv6B9DNKWMxbrC6fnWf/?format=html
*/
          image: "../../../assets/Rock/EncyclopediaPage/OxidusGracilis.png",
          description: "ヤケヤスデは、落ち葉や石の下、庭や畑などの湿った場所に生息するヤスデの一種である。\n体長は約2cmで、赤褐色から黒褐色の細長い体を持ち、多数の脚を使って移動する。\n落ち葉や腐りかけた植物などを食べ、有機物の分解に関わっている。また、危険を感じると防御物質を分泌して身を守る。"
        },
        {
          category: "ヤスデ類",
          name: "オビババヤスデ/キシャヤスデ",
          scientificName: "Parafontaria laminata",
          latitude: "北緯約34°〜38°（温帯〜冷温帯）",
/*
Shinohara, K. (1989).
Synonymy of Parafontaria laminata and Its Relative Species
(Diplopoda: Xystodesmidae).
Proceedings of the Japanese Society of Systematic Zoology, 40.
https://www.jstage.jst.go.jp/article/pjssz/40/0/40_KJ00003876393/_pdf

新島渓子・篠原圭三郎. (1988).
キシャヤスデ類の大発生.
日本生態学会誌, 38(3), 257–268.
https://doi.org/10.18960/seitai.38.3_257
https://www.jstage.jst.go.jp/article/seitai/38/3/38_KJ00001776293/_article/-char/ja/

Niijima, K., et al. (2021).
Eight-year periodical outbreaks of the train millipede.
https://pmc.ncbi.nlm.nih.gov/articles/PMC7890500/

Virginia Museum of Natural History.
Research and Collections, Special Publication 17.
Parafontaria laminata (Attems, 1909).
https://www.vmnh.net/content/vmnh/uploads/PDFs/research_and_collections/special_publications/vmnhspecialpub17.pdf
*/
          image: "../../../assets/Rock/EncyclopediaPage/ParafontariaLaminata.png",
          description: "オビババヤスデは、森林の落ち葉の間や倒木の下などに生息するヤスデの一種である。\n体長は約3〜4cmで、黄色から橙色を帯びた体に黒い帯状の模様があり、多数の脚を使って移動する。\n落ち葉や腐植質を食べ、森林の有機物の分解に関わっている。"
        },
        {
          category: "ヤスデ類",
          name: "タマヤスデ属の仲間",
          scientificName: "Hyleoglomeris spp.",
          latitude: "南緯約5°〜北緯約45°（熱帯〜冷温帯）",
/*
Diversity, distribution patterns, and fauno-genesis
of the millipedes (Diplopoda) of mainland China. (2020).
https://pmc.ncbi.nlm.nih.gov/articles/PMC7200884/

Nakama, N., Nakamura, Y., Tatsuta, H., & Korsós, Z. (2022).
A new pill millipede species of the genus Hyleoglomeris
Verhoeff 1910 (Glomerida: Glomeridae)
from the Ryukyu Archipelago, Japan.
Acta Arachnologica, 71(1), 5–12.
https://www.jstage.jst.go.jp/article/asjaa/71/1/71_5/_pdf

Kuroda, M., Susukida, M., Sakamoto, K.,
Tsukamoto, S., Nguyen, A. D., Oguri, E., & Eguchi, K. (2022).
A new species of the genus Hyleoglomeris Verhoeff 1910
from Central Japan (Diplopoda: Glomerida: Glomeridae).
Acta Arachnologica, 71(2), 115–124.
https://doi.org/10.2476/asjaa.71.115

Global Biodiversity Information Facility (GBIF).
Hyleoglomeris Verhoeff, 1910.
https://www.gbif.org/taxon/7PL2P
*/
          image: "../../../assets/Rock/EncyclopediaPage/HyleoglomerisSpp.png",
          description: "タマヤスデ属の仲間は、森林の落ち葉の間や朽木の下など、湿った場所に生息するヤスデ類である。\n丸みのある小さな体を持ち、外見はダンゴムシに似ているが、より多くの脚を持つ。\n落ち葉や腐りかけた植物などを食べ、有機物の分解に関わっている。危険を感じると体を球状に丸め、頭部や脚を内側に隠して身を守る。"
        },
      ]
    }
  },
  woodLouse: {
    category: "等脚類",
    title: "陸生等脚類",
    description: "ワラジムシ・ダンゴムシ類は、落ち葉の間や石、倒木の下などに生息する陸生の甲殻類である。多くの種は落ち葉や腐りかけた植物を食べ、有機物の分解に関わっている。体は複数の節からなり、7対の脚を持つ。危険を感じると体を丸める種類もいる。",
    encyclopedia: {
      subtitle: "岩の下\n微小生態系",
      title: "等脚類",
      species: [
        {
          category: "等脚類",
          name: "ワラジムシ",
          scientificName: "Porcellio scaber",
          latitude: "南緯約47°〜北緯約65°（温帯〜亜寒帯を中心に広く分布）",
/*
Riggio, C.
Porcellio scaber.
Animal Diversity Web.
University of Michigan.
https://animaldiversity.org/accounts/Porcellio_scaber/

Slabber, S., & Chown, S. L. (2002).
The first record of a terrestrial crustacean,
Porcellio scaber (Isopoda, Porcellionidae),
from sub-Antarctic Marion Island.
https://research.monash.edu/en/publications/the-first-record-of-a-terrestrial-crustacean-porcellio-scaber-iso/

Gregory, S. (2009).
Woodlice and Waterlice (Isopoda: Oniscidea & Asellota)
in Britain and Ireland.
British Myriapod and Isopod Group.
Porcellio scaber — Species Account.
https://bmig.org.uk/species/porcellio-scaber

Japan Agency for Marine-Earth Science and Technology (JAMSTEC).
Biological Information System for Marine Life.
Porcellio scaber Latreille, 1804.
https://www.godac.jamstec.go.jp/bismal/e/view/9004236
*/
          image: "../../../assets/Rock/EncyclopediaPage/PorcellioScaber.png",
          description: "ワラジムシは、落ち葉の間や石、倒木の下など、湿った場所に生息する陸生の甲殻類である。\n灰褐色の平たい体を持ち、表面には細かな凹凸がある。ダンゴムシに似ているが、体を球状に丸めることはできない。\n主に落ち葉や腐りかけた植物などを食べ、有機物の分解に関わっている。"
        },
        {
          category: "等脚類",
          name: "オカダンゴムシ",
          scientificName: "Armadillidium vulgare",
          latitude: "南緯約45°〜北緯約60°（温帯を中心に世界各地に分布）",
/*
Holland, A. (2013).
Armadillidium vulgare.
Animal Diversity Web.
University of Michigan.
https://animaldiversity.org/accounts/Armadillidium_vulgare/

University of Florida, IFAS Extension.
Pillbug, Roly-Poly, Woodlouse:
Armadillidium vulgare (Latreille).
https://ask.ifas.ufl.edu/publication/IN1099

British Myriapod and Isopod Group.
Armadillidium vulgare — Species Account.
https://bmig.org.uk/index.php/species/armadillidium-vulgare

Japan Agency for Marine-Earth Science and Technology (JAMSTEC).
Biological Information System for Marine Life.
Armadillidium vulgare (Latreille, 1804).
https://www.godac.jamstec.go.jp/bismal/e/view/9004240

Global Biodiversity Information Facility (GBIF).
Armadillidium vulgare (Latreille, 1804).
https://www.gbif.org/taxon/GRLD
*/
          image: "../../../assets/Rock/EncyclopediaPage/ArmadillidiumVulgare.png",
          description: "オカダンゴムシは、落ち葉の間や石、倒木の下など、湿った場所に生息する陸生の甲殻類である。\n体長は約1〜2cmで、灰色から黒褐色の硬い体を持つ。危険を感じると体を球状に丸め、身を守る。\n主に落ち葉や腐りかけた植物などを食べ、有機物の分解に関わっている。"
        },
        {
          category: "等脚類",
          name: "ニホンヒメフナムシ",
          scientificName: "Ligidium japonicum",
          latitude: "北緯約33°〜45°（暖温帯〜冷温帯）",
/*
Nunomura, N. (2015).
Isopod Crustaceans (Arthropoda) from Shikoku, Western Japan.
Kuroshio Biosphere.
https://kuroshio.or.jp/wp-content/uploads/2019/06/Nunomura_2015_p1-4010pls.pdf

Nunomura, N.
Taxonomic Study of the Terrestrial Isopod Crustaceans
in Japan.
https://tsm.repo.nii.ac.jp/record/2000045/files/5_23-68.pdf

奈良教育大学.
ニホンヒメフナムシ（Ligidium japonicum）.
https://jhs.nara-edu.ac.jp/cnee/Narakyou-InsectAndSoil_folder/Narakyou-InsectAndSoil/INSECT%20PAGES/Nihonhimefunamushi.html

Integrated Taxonomic Information System (ITIS).
Ligidium japonicum Verhoeff, 1918.
Taxonomic Serial Number: 595567.
https://itis.gov/servlet/SingleRpt/SingleRpt?search_topic=TSN&search_value=595567
*/
          image: "../../../assets/Rock/EncyclopediaPage/LigidiumJaponicum.png",
          description: "ニホンヒメフナムシは、森林の落ち葉の間や倒木の下など、湿り気の多い場所に生息する陸生の甲殻類である。\n体長は約1cmで、褐色の細長い体と長い触角を持ち、体の後端には細長い尾肢が伸びている。\n落ち葉などを食べ、湿った林床を素早く移動しながら生活している。"
        },
        {
          category: "等脚類",
          name: "ホソワラジムシ",
          scientificName: "Porcellionides pruinosus",
          latitude: "南緯約40°〜北緯約60°（熱帯〜温帯を中心に世界各地に分布）",
/*
名古屋市.
ワラジムシ・ダンゴムシ類.
ホソワラジムシ（Porcellionides pruinosus）.
https://www.city.nagoya.jp/kenkofukushi/eisei/1015269/1034848/1015298/1034491/1015373.html

Gobierno de Canarias.
Banco de Datos de Biodiversidad de Canarias.
Porcellionides pruinosus (Brandt, 1833).
https://www.biodiversidadcanarias.es/exos/especie/A06074/informe

新潟市水族館 マリンピア日本海.
生物図鑑：ホソワラジムシ.
https://www.marinepia.or.jp/picturebook/invertebrate/entry-11824.html

Segura-Zarzosa, I. E., et al. (2020).
New records of exotic species of Oniscidea
(Crustacea: Isopoda) from northern Mexico.
Revista Mexicana de Biodiversidad, 91.
https://doi.org/10.22201/ib.20078706e.2020.91.3098

国立科学博物館.
標本・資料統合データベース.
ホソワラジムシ（Porcellionides pruinosus）.
標本番号：NSMT-Cr 21178.
https://db.kahaku.go.jp/webmuseum/col_a2_10/NSMT-Cr_21178
*/
          image: "../../../assets/Rock/EncyclopediaPage/PorcellionidesPruinosus.png",
          description: "ホソワラジムシは、落ち葉の間や石の下、庭や草地などに生息する陸生の甲殻類である。\n体長は約1cmで、灰色から灰紫色の細長い体を持ち、背面には白い粉をまとったように見えることがある。\n主に落ち葉などの植物質を食べ、有機物の分解に関わっている。"
        }
      ]
    }
  },
  ddak: {
    category: "甲虫類",
    title: "甲虫類",
    description: "甲虫類は、森林の落ち葉や土の中、朽木や岩の周辺など、さまざまな環境に生息する昆虫の仲間である。硬い前翅で体を保護しており、植物や菌類を食べるものから、ほかの小さな生物を捕食するものまでいる。幼虫と成虫では姿や生活場所が異なる種類も多く、それぞれの環境で多様な役割を担っている。",
    encyclopedia: {
      subtitle: "岩の下\n微小生態系",
      title: "甲虫類",
      species: [
        {
          category: "甲虫類",
          name: "オオゴモクムシ",
          scientificName: "Harpalus capito",
          latitude: "北緯約24°〜50°（亜熱帯〜冷温帯）",
/*
滋賀県立琵琶湖博物館.
里山のゴミムシ：オオゴモクムシ
（Harpalus capito）.
https://www.biwahaku.jp/study/gomimushi/oogomokumushi.html

Kataev, B. M., & Liang, H. (2015).
Taxonomic review of Chinese species of ground beetles
of the subgenus Pseudoophonus (genus Harpalus)
(Coleoptera: Carabidae).
Zootaxa, 3920(1), 1–39.
https://doi.org/10.11646/zootaxa.3920.1.1
Species account:
https://zenodo.org/records/6114240

Classification of the Genus Harpalus
(Coleoptera, Carabidae) of the World
Based on Imaginal Morphology. (2023).
Diversity, 15(9), 971.
https://www.mdpi.com/1424-2818/15/9/971

森林総合研究所 九州支所.
立田山昆虫目録（採集日・備考付き）.
https://www.ffpri.go.jp/kys/business/tatuta/konchu/entlist2.html
*/
          image: "../../../assets/Rock/EncyclopediaPage/HarpalusCapito.png",
          description: "オオゴモクムシは、草地や畑、河原、森林の周辺など、さまざまな環境に生息する甲虫である。\n体長は約17〜24mmで、大きな頭部と黒褐色の体を持ち、胸部や上翅には細かな毛が生えている。\n主に地表を歩いて活動し、河原の石の下や朽木の下などでも見られる。"
        },
        {
          category: "甲虫類",
          name: "オオヒラタゴミムシ",
          scientificName: "Platynus magnus",
          latitude: "北緯約29°〜45°（亜熱帯〜冷温帯）",
/*
九州大学総合研究博物館.
佐々治寛之コレクション.
Platynus magnus (Bates, 1873).
標本番号：SH017262.
https://db.museum.kyushu-u.ac.jp/entomology/?cl=31&it=17262&wb=det

滋賀県立琵琶湖博物館.
里山のゴミムシ：オオヒラタゴミムシ
（Platynus magnus）.
https://www.biwahaku.jp/study/gomimushi/oohiratagomimushi.html

虫ナビ.
オオヒラタゴミムシ（Platynus magnus）.
https://mushinavi.com/navi-insect/data-gomimusi_hirata_oo.htm

昆虫エクスプローラ.
オオヒラタゴミムシ.
https://www.insects.jp/kon-gomioohirata.htm

Morita, S. (2019).
Notes on Carabidae of Japan II.
Elytra, New Series.
https://coleoptera.sakura.ne.jp/ElytraNS/199-202_K1_Morita.pdf
*/
          image: "../../../assets/Rock/EncyclopediaPage/PlatynusMagnus.png",
          description: "オオヒラタゴミムシは、水田や河川敷、森林など、湿り気のある場所を中心に生息する甲虫である。\n体長は約12〜16mmで、黒く光沢のある細長い体を持ち、頭部には暗赤色の斑紋が見られる。\n主に夜間に活動し、地表を歩き回りながら昆虫の幼虫などの小さな生物を捕食する。"
        },
        {
          category: "甲虫類",
          name: "アオオサムシ",
          scientificName: "Carabus insulicola",
          latitude: "北緯約34°〜42°（暖温帯〜冷温帯）",
/*
環境省.
指標種の生態情報（アオオサムシ・対象地域：東京）.
https://www.env.go.jp/content/000118143.pdf

滋賀県立琵琶湖博物館.
里山のゴミムシ：アオオサムシ
（Carabus insulicola Chaudoir, 1869）.
https://www.biwahaku.jp/study/gomimushi/aoosamushi.html

Interspecific difference and frequency dependence
in habitat use of coexisting Ohomopterus ground beetle
species under reproductive interference. (2024).
Ecological Research.
https://doi.org/10.1002/1438-390X.12194

TAKAO 599 MUSEUM.
Carabus insulicola.
Treasures of Mt. Takao.
https://www.takao599museum.jp/treasures/selected/2986/?lang=en
*/
          image: "../../../assets/Rock/EncyclopediaPage/CarabusInsulicola.png",
          description: "アオオサムシは、森林や林縁、草地などの地表に生息する甲虫の一種である。\n体長は約22〜33mmで、緑色や赤銅色などの金属光沢を持ち、地域によって体色が異なる。\n主に夜間に地表を歩き回り、ミミズなどの小動物を捕食する。後翅が退化しているため飛ぶことができず、成虫は土や朽木の中などで冬を越す。"
        },
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
  encyclopediaButton = document.querySelector("#encyclopedia-button");
  encyclopediaModal = document.querySelector("#encyclopedia-modal");
  encyclopediaCloseButton = document.querySelector("#encyclopedia-close");
  encyclopediaSubtitle = document.querySelector("#encyclopedia-subtitle");
  encyclopediaTitle = document.querySelector("#encyclopedia-title");
  encyclopediaGrid = document.querySelector("#encyclopedia-grid");
  encyclopediaPagination = document.querySelector("#encyclopedia-pagination");
  speciesModal = document.querySelector("#species-modal");
  speciesCloseButton = document.querySelector("#species-close");
  speciesImage = document.querySelector("#species-image");
  speciesCategory = document.querySelector("#species-category");
  speciesName = document.querySelector("#species-name");
  speciesScientificName = document.querySelector("#species-scientific-name");
  speciesDescription = document.querySelector("#species-description");
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
    const hasEncyclopedia = info.hasEncyclopedia !== false;
    encyclopediaButton.classList.toggle("is-visible", hasEncyclopedia);
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
  const encyclopedia = objectInfo[selectedPart]?.encyclopedia;
  if (
    !encyclopedia ||
    !encyclopediaModal ||
    !encyclopediaSubtitle ||
    !encyclopediaTitle
  ) {
    return;
  }

  encyclopediaSubtitle.textContent = encyclopedia.subtitle;
  encyclopediaTitle.textContent = encyclopedia.title;
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

  const species = objectInfo[selectedPart]?.encyclopedia?.species || [];
  const pageCount = Math.max(
    1,
    Math.ceil(species.length / SPECIES_PER_PAGE)
  );
  encyclopediaPage = Math.min(
    Math.max(encyclopediaPage, 0),
    pageCount - 1
  );

  const startIndex = encyclopediaPage * SPECIES_PER_PAGE;
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
    scientificName.className = "encyclopedia-species-scientific";
    scientificName.textContent = speciesItem.scientificName;

    card.append(image, name, scientificName);
    card.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      openSpeciesModal(speciesItem);
    });
    encyclopediaGrid.appendChild(card);
  });

  /*마지막 페이지에서도 2×2 레이아웃 유지*/
  while (encyclopediaGrid.children.length < SPECIES_PER_PAGE) {
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

  for (let pageIndex = 0; pageIndex < pageCount; pageIndex += 1) {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "encyclopedia-page-dot";
    dot.setAttribute("aria-label", `${pageIndex + 1}ページ`);

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

  speciesImage.src = speciesItem.image;
  speciesImage.alt = speciesItem.name;
  speciesCategory.textContent = speciesItem.category;
  speciesName.textContent = speciesItem.name;
  speciesScientificName.textContent = speciesItem.scientificName;
  speciesDescription.textContent = speciesItem.description;
  speciesModal.classList.add("is-open");
  speciesModal.setAttribute("aria-hidden", "false");
}

function closeSpeciesModal() {
  if (!speciesModal) {
    return;
  }
  speciesModal.classList.remove("is-open");
  speciesModal.setAttribute("aria-hidden", "true");
}

/*AR 히트박스 클릭*/
function bindClickEvents() {
  document.querySelectorAll(".clickable").forEach((object) => {
    object.removeEventListener("click", handleObjectClick);
    object.addEventListener("click", handleObjectClick);
  });
}

function handleObjectClick(event) {
  if (gestureActive || blockObjectClick) {
    event.stopPropagation?.();
    return;
  }
  if (infoPanel && infoPanel.classList.contains("is-open")) {
    return;
  }

  const object = event.currentTarget;
  const part = object.dataset.part || object.getAttribute("data-part");
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
    if (infoPanel && infoPanel.classList.contains("is-open")) {
      return;
    }
    if (
      encyclopediaModal &&
      encyclopediaModal.classList.contains("is-open")
    ) {
      return;
    }
    if (speciesModal && speciesModal.classList.contains("is-open")) {
      return;
    }
    if (event.touches.length !== 2 || !sceneRoot) {
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
    startDistance = getTouchDistance(touch1, touch2);
    startCenter = getTouchCenter(touch1, touch2);

    const currentScale = sceneRoot.getAttribute("scale");
    const currentPosition = sceneRoot.getAttribute("position");
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
    if (!gestureActive || event.touches.length !== 2 || !sceneRoot) {
      return;
    }

    event.preventDefault();
    const touch1 = event.touches[0];
    const touch2 = event.touches[1];
    const currentDistance = getTouchDistance(touch1, touch2);
    const currentCenter = getTouchCenter(touch1, touch2);

    /*확대·축소*/
    if (startDistance > 0) {
      const scaleRatio = currentDistance / startDistance;
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
    const deltaX = currentCenter.x - startCenter.x;
    const deltaY = currentCenter.y - startCenter.y;
    const moveSensitivity = 0.5;
    const newX = startPosition.x + deltaX * moveSensitivity;
    const newY = startPosition.y - deltaY * moveSensitivity;
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
    if (gestureActive && event.touches.length < 2) {
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

/*자연 분포 위도*/
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

/*위도 표시*/
/*
function updateSpeciesLatitude(speciesItem) {
  const data =
    naturalLatitudeData[speciesItem.scientificName];
  const latitude =
    data?.latitude || "緯度範囲は未確定";
  return latitude;
}
*/