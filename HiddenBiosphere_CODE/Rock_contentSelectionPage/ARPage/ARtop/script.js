
/*전역 DOM 요소와 상태*/
let sceneRoot;

/*간단 설명창*/
let infoPanel;
let infoCloseButton;
let infoCategory;
let infoTitle;
let infoDescription;

/*중앙 터치 가이드*/
let touchGuide;

/*도감*/
let encyclopediaButton;
let encyclopediaModal;
let encyclopediaCloseButton;
let encyclopediaSubtitle;
let encyclopediaTitle;
let encyclopediaGrid;
let encyclopediaPagination;
let encyclopediaBugSymbol;
let encyclopediaLarvaSymbol;

/*개별 생물 상세*/
let speciesModal;
let speciesCloseButton;
let speciesImage;
let speciesCategory;
let speciesName;
let speciesScientificName;
let speciesDescription;

/*선택 상태*/
let selectedPart = null;
let encyclopediaPage = 0;

/*두 손가락 제스처 상태*/
let gestureActive = false;
let blockObjectClick = false;
let blockClickTimer = null;
let startDistance = 0;
let startCenter = { x: 0, y: 0 };
let startScale = 40;
let startPosition = { x: 200, y: -40, z: -100 };

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

    /*HTML UI 터치는 AR에서 제외*/
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

    /*설명창이 열려 있으면 차단*/
    if (infoPanel && infoPanel.classList.contains("is-open")) {
      return;
    }

    /*한 손가락 터치만 사용*/
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
    if (rect.width === 0 || rect.height === 0) return;

    /*터치 좌표 변환*/
    this.pointer.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
    camera.updateMatrixWorld(true);
    this.raycaster.setFromCamera(this.pointer, camera);

    /*모든 히트박스 검색*/
    const clickableElements = Array.from(
      document.querySelectorAll(".clickable")
    );
    const objectsToIntersect = [];

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

    const intersection = intersections[0];
    const part = intersection.object.userData.arPart;
    const clickableElement =
      intersection.object.userData.arClickableElement;
    if (!part || !clickableElement) return;

    console.log("Touched part:", part, "distance:", intersection.distance);
    if (event.cancelable) {
      event.preventDefault();
    }
    event.stopPropagation();
    openInfoPanel(part);
  },
  remove: function () {
    window.removeEventListener("touchstart", this.onTouchStart);
  }
});

/*AR 오브젝트와 도감 데이터*/
const objectInfo = {
  /*이끼*/
  moss: {
    category: "蘚類",
    title: "コケ類",
    description: "コケ類は、岩の表面や地面など、さまざまな環境に生育する植物である。密集して成長することで水分が保たれやすい場所をつくり、小さな生物が利用できる微小な環境を形成することがある。",
    encyclopedia: {
      subtitle: "岩の表面\n微小生態系",
      title: "コケ類",
      species: [
        {
          category: "蘚類",
          name: "エゾスナゴケ",
          scientificName: "Niphotrichum japonicum",
          latitude: "南緯約32°〜北緯約55°（亜熱帯〜亜寒帯）",
/*
New national and regional bryophyte records, 59. (2019).
Journal of Bryology.
https://doi.org/10.1080/03736687.2019.1613112

Microhabitat Analysis on the Genus Racomitrium from East Asia. (2025).
Korean Journal of Plant Research, 38(6), 811–825.
https://www.kjpr.kr/articles/xml/bYqR/

National Museum of Nature and Science, Japan.
Science Museum Net – Racomitrium japonicum.
Akita Prefectural Museum, Specimen No. 23310.
https://science-net.kahaku.go.jp/search/detail?cls=collect11&pkey=23310
*/
          description: "エゾスナゴケは、日当たりの良い岩の表面や砂地などに生育するコケ植物である。\n乾燥した環境にも適応しており、水分の状態によって葉の広がり方や外見が変化する。乾燥時には葉が縮んで白っぽく見えることがあり、水分を吸収すると葉が広がり、緑色が目立つようになる。\n岩や土の表面に集まって生育し、小さな植物体が重なることで、周囲とは異なる微小な環境をつくり出している。",
          image: "../../../assets/Rock/EncyclopediaPage/RacomitriumJaponicum.png"
        },
        {
          category: "蘚類",
          name: "ケギボウシゴケ",
          scientificName: "Grimmia pilifera",
          latitude: "北緯約20°〜55°（亜熱帯〜冷温帯）",
/*
Missouri Botanical Garden.
Moss Flora of China.
Grimmia pilifera P. Beauv.
https://www.mobot.org/MOBOT/Moss/China/sample.shtml

Flora of North America Editorial Committee. (2007).
Grimmia pilifera.
Flora of North America North of Mexico,
Vol. 27: Bryophyta, Mosses, Part 1, p. 734.
Oxford University Press.
https://efloras.org/florataxon.aspx?flora_id=1&taxon_id=200001285

National Museum of Nature and Science, Japan.
Science Museum Net.
Grimmia pilifera P. Beauv. (ケギボウシゴケ).
Kanagawa Prefectural Museum of Natural History.
Specimen ID: 1580022.
Collection date: 1974-08-21.
Latitude: 35.697093°N.
https://science-net.kahaku.go.jp/search/detail?cls=collect11&pkey=1580022
*/
          description: "ケギボウシゴケは、乾燥した岩の表面や石垣などに生育するコケ植物である。\n濃い緑色から黒緑色の小さな塊を形成し、葉の先端には透明な毛のような部分が見られる。\n乾燥すると葉が茎に密着し、水分を吸収すると再び広がる。このような変化は、乾燥しやすい岩の表面で生活する本種の特徴の一つである。",
          image: "../../../assets/Rock/EncyclopediaPage/GrimmiaPilifera.png"
        },
        {
          category: "蘚類",
          name: "ハイゴケ",
          scientificName: "Hypnum plumaeforme",
          latitude: "北緯約5°〜55°（熱帯〜亜寒帯）",
/*
National Taiwan Museum.
Hypnum plumaeforme Wils., 1848.
Natural History Image Archive.
Source: Taiwan Encyclopedia of Life.
https://ntm-naturearchive.openmuseum.tw/pages/34354?from=moss

Lishui Municipal Administration, Zhejiang Province. (2023).
DB3311/T 276—2023.
大灰藓人工栽培技术规程.
Appendix A: 大灰藓特征介绍.
https://zjjcmspublic.oss-cn-hangzhou-zwynet-d01-a.internet.cloud.zj.gov.cn/jcms_files/jcms1/web3707/site/attach/0/2006a9c802bc4bfc8040d72f9a7530d7.pdf

National Museum of Nature and Science, Japan.
Science Museum Net.
Hypnum plumaeforme Wilson (ハイゴケ).
Akita Prefectural Museum, Specimen No. 6311.
Collection date: 1977-10-29.
Latitude: 39.92916667°N.
https://science-net.kahaku.go.jp/search/detail?cls=collect11&pkey=28609
*/
          description: "ハイゴケは、地面や岩の表面、木の根元、草地など、さまざまな場所に生育するコケ植物である。\n茎が地面を這うように横へ広がり、羽毛のように枝分かれしながら、黄緑色の柔らかいマット状の群落を形成する。\n群落は水分や小さな有機物を保持し、トビムシなどの小さな生物が利用できる微小な環境を形成することがある。",
          image: "../../../assets/Rock/EncyclopediaPage/HypnumPlumaeforme.png"
        },
        {
          category: "蘚類",
          name: "ヒジキゴケ",
          scientificName: "Hedwigia ciliata",
          latitude: "南緯約45°〜北緯約70°（熱帯〜寒帯）",
/*
Stebel, A., Staniaszek-Kik, M., Rosadziński, S.,
Wierzgoń, M., Fojcik, B., Smoczyk, M., & Vončina, G. (2021).
An Unusual Epiphytic Habitat for Hedwigia ciliata
(Bryophyta: Hedwigiaceae) in Poland (Central Europe).
Acta Societatis Botanicorum Poloniae, 90, Article 903.
https://doi.org/10.5586/asbp.903

Full text:
https://pbsociety.org.pl/journals/index.php/asbp/article/download/asbp.903/8091

World Flora Online.
Hedwigia ciliata (Hedw.) Boucher.
https://www.worldfloraonline.org/taxon/wfo-0001174527

British Bryological Society.
Hedwigia ciliata – Species Finder.
https://www.britishbryologicalsociety.org.uk/learning/species-finder/hedwigia-ciliata/

岡山県自然保護センター.
種名と配列に関わる解説等（コケ植物）.
ヒジキゴケ — Hedwigia ciliata.
https://okayama-shizenhogo-c.jp/media/pdf/save/catalog/a66862895941956341a027dd23a26276.pdf
*/
          description: "ヒジキゴケは、日当たりの良い岩の表面や石垣などに生育するコケ植物である。\n葉の先端には透明で白っぽい部分があり、集まって生育すると全体が灰緑色に見えることがある。\n乾燥すると葉が茎に密着し、水分を吸収すると再び広がる。岩の表面に小さな群落を形成し、水分の状態によってその外見を変化させる。",
          image: "../../../assets/Rock/EncyclopediaPage/HedwigiaCiliata.png"
        }
      ]
    }
  },
  /*달팽이*/
  snail: {
    category: "陸産貝類",
    title: "カタツムリ・ナメクジ",
    description: "カタツムリやナメクジなどの陸産貝類は、湿った岩の表面や隙間に生息している。藻類や菌類、植物の残骸などを食べ、微小生態系の物質循環に関わっている。",
    encyclopedia: {
      subtitle: "岩の表面\n微小生態系",
      title: "陸産貝類",
      species: [
        {
          category: "陸産貝類",
          name: "オオケマイマイ",
          scientificName: "Aegista vulgivaga",
          latitude: "北緯約33°〜38°（暖温帯〜冷温帯）",
/*
川瀬ほか. (2020).
名古屋市に棲息するオオケマイマイ Aegista vulgivaga の
COI遺伝子からみた分子系統学的位置付け.
なごやの生物多様性.
https://www.city.nagoya.jp/_res/projects/default_project/_page_/001/034/801/nagoyanoseibutsutayousei_7.pdf

National Museum of Nature and Science, Japan.
Science Museum Net.
Aegista vulgivaga vulgivaga (オオケマイマイ).
Gifu Prefectural Museum.
Specimen No. 13000-5808.
Collection date: 1991-04-29.
Locality: Ise, Mie Prefecture, Japan.
Latitude: 34.48725°N.
https://science-net.kahaku.go.jp/search/detail?cls=collect11&pkey=2675472

Ehime Prefecture.
愛媛県レッドデータブック2014.
オオケマイマイ（Aegista vulgivaga vulgivaga）.
https://www.pref.ehime.jp/reddatabook2014/detail/07_06_003410_0.html
*/
          description: "オオケマイマイは、平たく広がった殻を持つ日本の陸生巻貝である。\n殻の外側には細かな毛のような構造があり、特に殻の縁に沿って見られる。この構造は成長や摩耗によって目立たなくなることもある。\n森林の地面や落ち葉の間などに生息し、湿り気のある小さな空間を利用して生活している。",
          image: "../../../assets/Rock/EncyclopediaPage/AegistaVulgivaga.png"
        },
        {
          category: "陸産貝類",
          name: "ニシキマイマイ",
          scientificName: "Euhadra sandai",
          latitude: "北緯約33°〜37°（暖温帯〜冷温帯）",
/*
京都府. (2015).
京都府レッドデータブック2015.
ニシキマイマイおよびナミマイマイ
（Euhadra sandai sandai / Euhadra sandai communis）.
https://www.pref.kyoto.jp/kankyo/rdb/bio/db/gshel0039.html

微小貝データベース.
ニシキマイマイ（Euhadra sandai）.
https://bishogai.com/pic_book/data14/r001353.html

国立科学博物館.
サイエンスミュージアムネット.
Euhadra sandai（ニシキマイマイ）.
富山市科学博物館所蔵標本, Catalog No. 66931.
採集地：滋賀県伊吹町.
採集日：1980年10月19日.
https://science-net.kahaku.go.jp/search/detail?cls=collect11&pkey=2047194
*/
          description: "ニシキマイマイは、主に近畿地方の森林に生息する陸生の巻貝である。\n丸みのある殻には褐色の模様や色帯が見られ、その色や形には個体差や地域差がある。\n森林の地面には、落ち葉や植物によって湿り気が保たれる場所がある。ニシキマイマイは、そのような環境を生活の場として利用している。",
          image: "../../../assets/Rock/EncyclopediaPage/EuhadraSandai.png"
        },
        {
          category: "陸産貝類",
          name: "ニッポンマイマイ",
          scientificName: "Satsuma japonica",
          latitude: "北緯約33°〜39°（暖温帯〜冷温帯）",
/*
微小貝データベース. (2023).
ニッポンマイマイ Satsuma japonica (Pfeiffer, 1847).
https://bishogai.com/pic_book/data28/r002705.html

大阪市立自然史博物館.
デジタル大阪ミュージアムズ.
ニッポンマイマイ（Satsuma japonica）.
Catalog No. 34534.
採集日：2003年9月4日.
採集地：和歌山県和歌山市友ヶ島.
https://dom.ocm.osaka/database/omnh/74533

環境省.
生物多様性センター.
種の多様性調査（動物分布調査）対象種一覧.
Satsuma japonica（ニッポンマイマイ）.
https://www.biodic.go.jp/kiso/do05/01_ka.pdf
*/
          description: "ニッポンマイマイは、日本に生息する陸生の巻貝である。\n殻を背負いながら地表を移動するカタツムリの仲間であり、国内の複数の地域で生息が記録されている。\n陸上で生活する巻貝にとって、体の乾燥を防ぐことは重要である。森林の地面には落ち葉や石などによって周囲とは異なる湿度の環境が生まれ、陸生巻貝が利用できる場所となる。",
          image: "../../../assets/Rock/EncyclopediaPage/SatsumaJaponica.png"
        },
        {
          category: "陸産貝類",
          name: "ゴマオカタニシ",
          scientificName: "Georissa japonica",
          latitude: "北緯約24°〜36°（亜熱帯〜暖温帯）",
/*
京都府. (2015).
京都府レッドデータブック2015.
ゴマオカタニシ（Georissa japonica）.
https://www.pref.kyoto.jp/kankyo/rdb/bio/db/gshel0021.html

愛知県. (2009).
レッドデータブックあいち2009.
ゴマオカタニシ（Georissa japonica）.
https://kankyojoho.pref.aichi.jp/DownLoad/DownLoad/ANIMALS11_2.pdf

福岡県. (2024).
福岡県レッドデータブック2024.
ゴマオカタニシ（Georissa japonica）.
https://biodiversity.pref.fukuoka.lg.jp/rdb/rdbs/detail/202401664
*/
          description: "ゴマオカタニシは、殻の大きさが約2mmしかない、非常に小さな陸生巻貝である。\n殻には細かな凹凸があり、入口を閉じるためのふたを持っている。\n石灰岩の表面などで見られることがあり、小さな体で岩の表面にある微細な空間を利用して生活している。普段は見過ごしてしまうような場所にも、生物の世界が広がっていることを感じさせる存在である。",
          image: "../../../assets/Rock/EncyclopediaPage/GeorissaJaponica.png"
        },
        {
          category: "陸産貝類",
          name: "ヤマナメクジ",
          scientificName: "Meghimatium fruhstorferi",
          latitude: "北緯約27°〜45°（亜熱帯〜冷温帯）",
/*
西宮市貝類館. (2024).
ヤマナメクジ（Meghimatium fruhstorferi）.
西宮市.
https://www.nishi.or.jp/bunka/bunka/kairuikan/nishinomiyanokai/82yamanamekuzi.html

徳之島世界遺産センター.
ヤマナメクジ（Meghimatium fruhstorferi）.
https://tokunoshima-whcc.com/discover-world-heritage-wildlife/animals/b1-a-41/

국립생물자원관. (2014).
국가 생물종 목록집: 연체동물.
Meghimatium fruhstorferi (Collinge, 1901) — 산민달팽이.
p. 71.
https://www.nibr.go.kr/aiibook/catImage/33/Additional%202014.pdf

下関市. (2021).
下関市菊川町の陸産・淡水産貝類.
下関市立しものせき水族館 研究報告書 第13号.
https://www.city.shimonoseki.lg.jp/uploaded/attachment/16916.pdf
*/
          description: "ヤマナメクジは、日本の森林に生息する大型のナメクジである。\n褐色の体には不規則な模様があり、落ち葉や朽木が集まる場所などで見られる。\nこうした場所は乾燥を避けるための隠れ場所となり、キノコなどの食べ物を見つける場所にもなる。ヤマナメクジは、森林に存在するさまざまな有機物を利用しながら生活している。",
          image: "../../../assets/Rock/EncyclopediaPage/MeghimatiumFruhstorferi.png"
        },
        {
          category: "陸産貝類",
          name: "マダラコウラナメクジ",
          scientificName: "Limax maximus",
          latitude: "南緯約45°〜北緯約60°（温帯を中心に広く分布）",
/*
北海道大学. (2017).
Native leech preys on invasive slug?
https://www.global.hokudai.ac.jp/blog/native-leech-preys-on-invasive-slug/

University of Michigan.
BioKIDS: Limax maximus — Spotted Garden Slug.
https://www.biokids.umich.edu/critters/Limax_maximus/index.html

Komatsu, W., Ikezawa, H., & Saeki, I. (2026).
An assessment of the habitats and trophic level
of the introduced slug Limax maximus in Japan.
Biological Invasions, 28, Article 71.
https://doi.org/10.1007/s10530-026-03775-w

環境省.
生態系被害防止外来種リスト 関連資料.
マダラコウラナメクジ（Limax maximus）.
https://www.env.go.jp/nature/intro/2outline/iaslist/gairailist/byseitailist5/shiryou3-1-1.pdf
*/
          description: "マダラコウラナメクジは、ヨーロッパから日本に持ち込まれた大型のナメクジである。\n体には黒い斑点や縞模様があり、個体によって模様の現れ方が異なる。湿り気のある場所を利用して活動し、キノコを中心に、さまざまなものを食べる。\n日本では外来種として確認されており、在来の生物との関係についても注意が必要な存在である。",
          image: "../../../assets/Rock/EncyclopediaPage/LimaxMaximus.png"
        },
        {
          category: "陸産貝類",
          name: "チャコウラナメクジ",
          scientificName: "Ambigolimax valentianus",
          latitude: "南緯約45°〜北緯約55°（温帯を中心に広く分布）",
/*
国立環境研究所.
侵入生物データベース.
チャコウラナメクジ（Lehmannia valentiana）.
https://www.nies.go.jp/biodiversity/invasive/DB/detail/70390.html

西宮市貝類館. (2024).
チャコウラナメクジ（Ambigolimax valentianus）.
https://www.nishi.or.jp/bunka/bunka/kairuikan/nishinomiyanokai/83tyakouranamekuzi.html

Carnegie Museum of Natural History.
Ambigolimax valentianus — Threeband Gardenslug.
https://carnegiemnh.org/mollusks/ambigolimax-valentianus/

きしわだ自然資料館. (2023).
きしわだ自然資料館研究報告 第8号.
https://www.city.kishiwada.osaka.jp/uploaded/attachment/128576.pdf
*/
          description: "チャコウラナメクジは、ヨーロッパ原産のナメクジであり、日本でも身近な場所で見られる外来種である。\n淡い褐色の体には、背中に沿って伸びる2本の暗い線がある。\n乾燥しやすい日中は石の下や物陰などに身を隠し、湿度が高くなると活動する。植物を食べるため、人間が育てている野菜や草花に影響を与えることもある。",
          image: "../../../assets/Rock/EncyclopediaPage/AmbigolimaxValentianus.png"
        }
      ]
    }
  },
  /*톡토기*/
  toktok: {
    category: "トビムシ類",
    title: "トビムシ類",
    description: "トビムシ類は、湿った岩の表面やコケの間などに生息する小さな節足動物である。菌類や微細な有機物などを食べ、微小生態系の分解過程に関わっている。",
    encyclopedia: {
      subtitle: "岩の表面\n微小生態系",
      title: "トビムシ類",
      species: [
        {
          category: "トビムシ類",
          name: "トビムシ類",
          scientificName: "Orchesella cincta",
          latitude: "北緯約35°〜65°（温帯〜亜寒帯）",
/*
Thermal acclimation and adaptation across populations
in a broadly distributed soil arthropod.
Functional Ecology. (2019).
https://doi.org/10.1111/1365-2435.13291

Grujić, N. Z., Winkler, D., & Daghighi, E. (2023).
An annotated checklist of springtails
(Hexapoda, Collembola) from Vojvodina province,
Republic of Serbia.
Journal of Insect Biodiversity and Systematics, 9(4), 727–759.
https://doi.org/10.61186/jibs.9.4.727
https://zenodo.org/records/17025319

BugGuide.
Species Orchesella cincta.
Iowa State University Department of Plant Pathology,
Entomology and Microbiology.
https://www.bugguide.net/node/view/61617

Global Biodiversity Information Facility (GBIF).
Orchesella cincta (Linnaeus, 1758).
https://www.gbif.org/taxon/6T5DQ
*/
          description: "Orchesella cincta は、森林の落ち葉やコケ、樹皮の周辺など、さまざまな場所で見られるトビムシの一種である。\n細長い体と長い触角を持ち、腹部には濃淡のある帯状の模様が見られる。\n菌類や藻類などを食べながら生活し、危険を感じると腹部の下にある跳躍器を使って素早く跳びはねる。\nコケが広がる場所も、この小さな生物が利用する生活環境の一つである。",
          image: "../../../assets/Rock/EncyclopediaPage/OrchesellaCincta.png",
          note: "※ 一般的に使用されている和名は確認できていません。"
        },
        {
          category: "トビムシ類",
          name: "トゲトビムシ科",
          scientificName: "Tomocerus minor",
          latitude: "北緯約25°〜70°（亜熱帯〜亜寒帯）",
/*
Mayvan, M. M., Greenslade, P., & Sadeghi-Namaghi, H. (2023).
An annotated checklist of the Collembola (Hexapoda) from Iran.
Zootaxa, 5275(1), 1–101.
https://doi.org/10.11646/zootaxa.5275.1.1

Tomocerus minor 종별 기록:
https://doi.org/10.5281/zenodo.7899582

NatureSpot.
Tomocerus minor — Species Account.
Leicestershire and Rutland Environmental Records Centre.
https://www.naturespot.org/species/tomocerus-minor

Natural History Museum, London.
Species Dictionary.
Tomocerus minor (Lubbock, 1862).
https://www.nhm.ac.uk/our-science/data/uk-species/taxon?tvk=NBNSYS0100000606

New Zealand Organisms Register (NZOR).
Tomocerus minor (Lubbock, 1862).
https://www.nzor.org.nz/names/664ee8d4-a2ab-49fc-a15d-dacc586e6580/providers
*/
          description: "Tomocerus minor は、森林の落ち葉やコケの間など、湿り気のある環境で見られるトビムシの一種である。\n細長い体と長い触角を持ち、腹部の下には発達した跳躍器がある。\nコケが密集する場所には、小さな隙間や湿り気の保たれた空間が存在する。このような環境を利用しながら生活しており、周囲の刺激に反応して跳びはねることができる。",
          image: "../../../assets/Rock/EncyclopediaPage/TomocerusMinor.png",
          note: "※ 一般的に使用されている和名は確認できていません。"
        },
        {
          category: "トビムシ類",
          name: "トビムシ類",
          scientificName: "Dicyrtomina ornata",
          latitude: "北緯約35°〜65°（温帯〜亜寒帯）",
/*
Global Biodiversity Information Facility (GBIF).
Dicyrtomina ornata (Nicolet, 1842).
https://www.gbif.org/taxon/6CSXG

NatureSpot.
Dicyrtomina ornata — Species Account.
https://naturespot.opacedev.com/node/132553

Asturnatura. (2024).
Dicyrtomina ornata (Nicolet, 1842).
https://www.asturnatura.com/en/nature/species/dicyrtomina-ornata

BugGuide.
Dicyrtomina minuta forma ornata.
Iowa State University.
https://www.bugguide.net/node/view/479321

*/
          description: "Dicyrtomina ornata は、丸みを帯びた体を持つトビムシの一種である。\n体には黄色や緑色を基調とした模様があり、暗い色の斑紋が見られる。\n湿った落ち葉の間や地表付近などに生息し、腹部の下にある跳躍器を使って移動する。\nコケや落ち葉が集まる場所には、周囲とは異なる湿度や小さな空間が生まれる。こうした環境は、小さなトビムシ類が生活する場所にもなっている。",
          image: "../../../assets/Rock/EncyclopediaPage/DicyrtominaOrnata.png",
          note: "※ 一般的に使用されている和名は確認できていません。"
        },
        {
          category: "トビムシ類",
          name: "トビムシ類",
          scientificName: "Allacma fusca",
          latitude: "南緯約40°〜北緯約70°（温帯〜亜寒帯を中心に分布）",
/*
The genome sequence of the springtail Allacma fusca
(Linnaeus, 1758). (2023).
Wellcome Open Research.
https://pmc.ncbi.nlm.nih.gov/articles/PMC10427803/

Allozyme variation in the springtails Allacma fusca
and A. gallica (Collembola, Sminthuridae). (2008).
Pedobiologia.
https://www.sciencedirect.com/science/article/abs/pii/S003140560800067X

Asturnatura.
Distribución de Allacma fusca.
https://www.asturnatura.com/distribucion/allacma-fusca.html

Global Biodiversity Information Facility (GBIF).
Allacma fusca (Linnaeus, 1758).
https://www.gbif.org/taxon/65VFB
*/
          description: "Allacma fusca は、丸みを帯びた褐色の体を持つトビムシの一種である。\n森林では、木の幹や枝の表面などで見られ、樹皮に付着した藻類を食べることが知られている。\nコケや藻類が生育する場所には、肉眼では見落としやすい小さな生物の生活空間が広がっている。\nこの種は、森林の地面だけでなく、樹木の表面も小さな生物にとって重要な生活環境となることを示している。",
          image: "../../../assets/Rock/EncyclopediaPage/AllacmaFusca.png",
          note: "※ 一般的に使用されている和名は確認できていません。"
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

  /*간단 설명창*/
  infoPanel = document.querySelector("#info-panel");
  infoCloseButton = document.querySelector("#info-close");
  infoCategory = document.querySelector("#info-category");
  infoTitle = document.querySelector("#info-title");
  infoDescription = document.querySelector("#info-description");

  /*도감*/
  encyclopediaButton = document.querySelector("#encyclopedia-button");
  encyclopediaModal = document.querySelector("#encyclopedia-modal");
  encyclopediaCloseButton = document.querySelector("#encyclopedia-close");
  encyclopediaSubtitle = document.querySelector("#encyclopedia-subtitle");
  encyclopediaTitle = document.querySelector("#encyclopedia-title");
  encyclopediaGrid = document.querySelector("#encyclopedia-grid");
  encyclopediaPagination = document.querySelector("#encyclopedia-pagination");

  /*기존 고사목 장식 요소*/
  encyclopediaBugSymbol = document.querySelector(".encyclopedia-symbol.bug");
  encyclopediaLarvaSymbol = document.querySelector(".encyclopedia-symbol.larva");

  /*개별 생물 상세*/
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

  /*도감 버튼*/
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

  /*상세 팝업 닫기*/
  if (speciesCloseButton) {
    speciesCloseButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      closeSpeciesModal();
    });
  }

  /*상세 팝업 배경 터치*/
  if (speciesModal) {
    speciesModal.addEventListener("click", (event) => {
      if (event.target === speciesModal) {
        closeSpeciesModal();
      }
    });
  }

  /*히트박스 클릭 이벤트*/
  bindClickEvents();
});

/*설명창 열기*/
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

  /*중앙 터치 가이드 숨김*/
  if (touchGuide) {
    touchGuide.classList.add("is-hidden");
  }
  infoPanel.classList.add("is-open");
  infoPanel.setAttribute("aria-hidden", "false");

  /*도감 버튼 표시*/
  if (encyclopediaButton) {
    const hasEncyclopedia =
      info.hasEncyclopedia !== false && !!info.encyclopedia;
    encyclopediaButton.classList.toggle("is-visible", hasEncyclopedia);
    encyclopediaButton.setAttribute(
      "aria-hidden",
      hasEncyclopedia ? "false" : "true"
    );
  }
}

/*설명창 닫기*/
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

/*Rock Top 도감 열기*/
function openEncyclopedia() {
  if (!selectedPart) return;

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

  /*선택한 생물에 해당하는 도감 장식 표시*/
  document.querySelectorAll(".encyclopedia-symbol").forEach((symbol) => {
    symbol.classList.toggle(
      "is-hidden",
      !symbol.classList.contains(selectedPart)
    );
  });

  encyclopediaPage = 0;
  renderEncyclopediaPage();
  encyclopediaModal.classList.add("is-open");
  encyclopediaModal.setAttribute("aria-hidden", "false");
}

/*도감 닫기*/
function closeEncyclopedia() {
  if (!encyclopediaModal) return;
  closeSpeciesModal();
  encyclopediaModal.classList.remove("is-open");
  encyclopediaModal.setAttribute("aria-hidden", "true");
}

/*도감 페이지 렌더링*/
function renderEncyclopediaPage() {
  if (!selectedPart || !encyclopediaGrid || !encyclopediaPagination) {
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
    /*카드*/
    const card = document.createElement("button");
    card.type = "button";
    card.className = "encyclopedia-species-card";

    /*이미지*/
    const image = document.createElement("img");
    image.className = "encyclopedia-species-image";
    if (speciesItem.image) {
      image.src = speciesItem.image;
    } else {
      image.removeAttribute("src");
      image.style.visibility = "hidden";
    }
    image.alt = speciesItem.name;

    /*생물 이름*/
    const name = document.createElement("p");
    name.className = "encyclopedia-species-name";
    name.textContent = speciesItem.name;

    /*학명*/
    const scientificName = document.createElement("p");
    scientificName.className = "encyclopedia-species-scientific";
    scientificName.textContent = speciesItem.scientificName;

    card.append(image, name, scientificName);

    /*카드 선택*/
    card.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      openSpeciesModal(speciesItem);
    });
    encyclopediaGrid.appendChild(card);
  });

  /*2×2 레이아웃 유지*/
  while (encyclopediaGrid.children.length < SPECIES_PER_PAGE) {
    const empty = document.createElement("div");
    empty.setAttribute("aria-hidden", "true");
    encyclopediaGrid.appendChild(empty);
  }
  renderPagination(pageCount);
}

/*페이지 점 생성*/
function renderPagination(pageCount) {
  if (!encyclopediaPagination) return;

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

/*개별 생물 상세 팝업*/
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

  /*이미지*/
  if (speciesItem.image) {
    speciesImage.src = speciesItem.image;
    speciesImage.style.visibility = "visible";
  } else {
    speciesImage.removeAttribute("src");
    speciesImage.style.visibility = "hidden";
  }
  speciesImage.alt = speciesItem.name;

  /*텍스트*/
  speciesCategory.textContent = speciesItem.category;
  speciesName.textContent = speciesItem.name;
  speciesScientificName.textContent = speciesItem.scientificName;

  /*위도 표시*/
  const oldLatitude = document.querySelector("#species-latitude");

  if (oldLatitude) {
    oldLatitude.remove();
  }

  const latitude = document.createElement("p");
  latitude.id = "species-latitude";
  latitude.className = "species-latitude";

  latitude.textContent = speciesItem.latitude
    ? `生息緯度：${speciesItem.latitude}`
    : "生息緯度：資料未登録";

  speciesScientificName.insertAdjacentElement(
    "afterend",
    latitude
  );

  speciesDescription.textContent = speciesItem.description;
  speciesModal.classList.add("is-open");
  speciesModal.setAttribute("aria-hidden", "false");
}

/*개별 생물 상세 닫기*/
function closeSpeciesModal() {
  if (!speciesModal) return;
  speciesModal.classList.remove("is-open");
  speciesModal.setAttribute("aria-hidden", "true");
}

/*AR 히트박스 클릭 이벤트*/
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
  if (!part) return;

  console.log("Clicked:", part);
  openInfoPanel(part);
}

/*두 손가락 거리 계산*/
function getTouchDistance(touch1, touch2) {
  const deltaX = touch2.clientX - touch1.clientX;
  const deltaY = touch2.clientY - touch1.clientY;
  return Math.hypot(deltaX, deltaY);
}

/*두 손가락 중심 계산*/
function getTouchCenter(touch1, touch2) {
  return {
    x: (touch1.clientX + touch2.clientX) / 2,
    y: (touch1.clientY + touch2.clientY) / 2
  };
}

/*두 손가락 제스처 시작*/
document.addEventListener(
  "touchstart",
  (event) => {
    /*설명창이 열려 있으면 차단*/
    if (infoPanel && infoPanel.classList.contains("is-open")) {
      return;
    }

    /*도감이 열려 있으면 차단*/
    if (
      encyclopediaModal &&
      encyclopediaModal.classList.contains("is-open")
    ) {
      return;
    }

    /*상세 팝업이 열려 있으면 차단*/
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

/*두 손가락 확대 + 이동*/
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

/*제스처 종료*/
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

/*제스처 취소*/
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