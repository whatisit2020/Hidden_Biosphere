
"use strict";

const referenceText = `
シイタケ|
コフキサルノコシカケ（Ganoderma applanatum）|https://commons.wikimedia.org/wiki/File:Ganoderma_applanatum_2010_G1.jpg
ハイゴケ（Hypnum plumaeforme）|https://onlineshop.oomiteien.com/products/080002
大型カミキリムシ類の幼虫|https://www.yna.co.kr/view/AKR20191030196100017
ヤマブシタケ|https://mdc.mo.gov/discover-nature/field-guide/bearded-tooth
ヒラタケ|https://www.herbarium.iastate.edu/files/fungi/Pleurotus%20ostreatus%20%28Jacq.-%20Fr.%29%20Kummer.pdf
キクラゲ|https://www.ffpri.go.jp/kys/business/tatuta/kinoko/kinoko069.html
スエヒロタケ|https://www.first-nature.com/fungi/schizophyllum-commune.php
カイガラタケ|https://www.botanic.jp/plants-ka/kaigar.htm
トンビマイタケ|https://moiwakinoko.sakura.ne.jp/kinoko/index.php?id=933
ブクリョウ|https://www.pharm.or.jp/yakusou/2023/01/post-131.html
ハナビラタケ|https://www.first-nature.com/fungi/sparassis-crispa.php
マツノサルノコシカケ|https://moiwakinoko.sakura.ne.jp/kinoko/index.php?id=844
マンネンタケ|https://www.ffpri.go.jp/kys/business/tatuta/kinoko/kinoko060.html
ウマノケタケ|https://www.forest.kyushu-u.ac.jp/staff/utsumi/BioPhotoArchive/Fungus/tsuriganetake.html
コメツキムシ類の幼虫|https://www.ffpri.go.jp/fsm/research/pubs/joho/past/77.html
タマムシ類の幼虫|https://butterfly.kumano-express.com/tamamushi-no-ouchuu/
ゾウムシ類の幼虫|https://www.lwf.bayern.de/mam/cms04/service/dateien/fb28_rindenbr%C3%BCter_2021_rz_web_bf.pdf
チュウゴクツヤナガシンクイ|https://researchmap.jp/maruhananomi/misc/49669441/attachment_file.pdf
カキノフタトゲナガシンクイ|https://researchmap.jp/maruhananomi/misc/49669441/attachment_file.pdf
ヒラタキクイムシ|https://www.tobunken.go.jp/ccr/pest-search/species/Coleoptera-beetle/hirata_kikuimushi/hirata_kikuimushi_imgs.html
ニレカワノキクイムシ|https://www.inaturalist.org/taxa/53550-Scolytus
ハンノキキクイムシ（Xylosandrus germanus）|https://www.iriisphytoprotection.qc.ca/fr/insectes-et-autres-invertebres/bostryche-noir-du-japon
キバチ類の幼虫と坑道|https://commons.wikimedia.org/wiki/File:Sirec_noctilio_galleries_with_larvae.jpg
ゾウムシ類による木材の食痕|https://woodwormtreatments.co.uk/wood-boring-weevil/
アオオサムシ（Carabus insulicola）|https://commons.wikimedia.org/wiki/File:Carabus_insulicola.jpg
カタツムリ（Euhadra sandai の形態参考）|https://commons.wikimedia.org/wiki/File:Snail01.jpg
ニホンヒメフナムシ（Ligidium japonicum）|https://commons.wikimedia.org/wiki/File:Ligidium_japonicum_200606_01.JPG
トビムシの一種（Orchesella cincta）|https://commons.wikimedia.org/wiki/File:Orchesella_cincta_(6875710316).jpg
オオヒラタゴミムシ（Platynus magnus）|https://www.biwahaku.jp/study/gomimushi/oohiratagomimushi.html
トビムシの一種（Tomocerus minor）|https://www.naturespot.org/species/tomocerus-minor
オオケマイマイ（Aegista vulgivaga）|https://www.insects.jp/kon-maimaiooke.htm
トビムシの一種（Allacma fusca）|https://www.collembola.org/taxa/smi2inae.htm
ナメクジの一種（Ambigolimax valentianus）|https://www.oregon.gov/oda/Documents/Publications/IPPM/ODAGuideMolluscs2016ForWeb.pdf
オカダンゴムシ（Armadillidium vulgare）|https://bmig.org.uk/species/armadillidium-vulgare
トビムシの一種（Dicyrtomina ornata）|https://www.rosgartenmuseum.de/wp-content/uploads/2025/01/Presseunterlagen_Bodensee-Naturmuseum-2025-1.pdf
ゴマオカタニシ（Georissa japonica）|https://bishogai.com/pic_book/data108/r010729.html
オオゴモクムシ（Harpalus capito）|https://insect.minoh.city/a0170/
タマヤスデ属の一種（Hyleoglomeris sp.）|https://www.takao599museum.jp/treasures/others/タマヤスデ科/387/?lang=ja
ヤマナメクジ（Meghimatium fruhstorferi）|https://commons.wikimedia.org/wiki/
オビババヤスデ（Parafontaria laminata）|https://maruzukan.com/post/2020080412542427
ワラジムシ（Porcellio scaber）|https://www.biopix.com/porcellio-scaber_photo-52118.aspx
ワラジムシの一種（Porcellionides pruinosus）|https://nzslaters.massey.ac.nz/factsheet_Porcellionides_pruinosus.php
ニッポンマイマイ（Satsuma japonica）|https://www.insects.jp/kon-maimainippon.htm
ゴミムシ類の背面|https://dnr.illinois.gov/content/dam/soi/en/web/dnr/grants/documents/wpfgrantreports/2012016w.pdf
ワラジムシ類の背面|https://bmig.org.uk/species/porcellio-laevis
ヨシノボリ属の雑種・正面|https://tansuigyo.net/a/x-282.html
カワヨシノボリ・背面（Rhinogobius flumineus）|https://tansuigyo.net/a/x-238.html
カマツカ・頭部および側面|https://kotobank.jp/word/かまつか-1518760
カマツカ・背面|https://kalsdiary.blog.fc2.com/blog-entry-1454.html
サワガニ・白背景（Geothelphusa dehaani）|https://commons.wikimedia.org/wiki/File:Geothelphusa_dehaani.IMG_6498.jpg
サワガニ・野外（Geothelphusa dehaani）|https://www.gaia-note.com/book/geothelphusa-dehaani/
エルモンヒラタカゲロウの幼虫|https://kotobank.jp/word/えるもんひらたかげろう-3135760
カワヨシノボリ・側面（Rhinogobius flumineus）|https://zenodo.org/records/11102254
カゲロウ類の幼虫|https://museum.umic.jp/kawa/zukan/konchu/erumon-hiratakagerou.html
倒木の腐朽段階（ログクラス）|https://kids.frontiersin.org/articles/10.3389/frym.2022.683643/full
枯死木の役割と菌類による分解|https://www.ffpri.go.jp/snap/2024/1-kareki.html
木材腐朽菌と物質循環|https://www.nite.go.jp/nbrc/industry/other/biomass/knowledge/glucoenzyme.html https://doi.org/10.1007/s11368-017-1858-2
コケと倒木の微環境|https://esj.ne.jp/meeting/abst/73/P2-070.html
昆虫の孔道と食痕|https://www.ffpri.go.jp/snap/2013/4-juhikakonchu.html https://www.chiba-muse.or.jp/NATURAL/special/yama/news/2020/20201223ampedus.htm
シイタケ（解説資料）|https://www.ffpri.go.jp/pubs/kikan/documents/kikanffpri-62.pdf
ヒラタケ（解説資料）|https://www.pref.ishikawa.lg.jp/ringyo/kinoko/data/hiratake.html https://www.nilim.go.jp/lab/bcg/siryou/tnn/tnn0566pdf/ks0566.pdf
スエヒロタケ（解説資料）|https://www.nilim.go.jp/lab/bcg/siryou/tnn/tnn0566pdf/ks0566.pdf
キクラゲ（解説資料）|https://www.ffpri.go.jp/kys/business/tatuta/kinoko/kinoko069.html
マンネンタケ（解説資料）|https://www.ffpri.go.jp/kys/business/tatuta/kinoko/kinoko060.html https://www.pref.ishikawa.lg.jp/ringyo/kinoko/data/mannentake.html
ヤマブシタケ（解説資料）|https://www.ffpri.go.jp/research/project/documents/chukanhoukoku_1.pdf
ウマノケタケ（解説資料）|https://s-kinokonokai.sakura.ne.jp/kinoko/common/umanoketake.htm
ブクリョウ（茯苓・解説資料）|https://www.nikkankyo.org/kampo/kampo02/20.html
ハナビラタケ（解説資料）|https://www.maff.go.jp/j/pr/aff/1610/spe1_03.html
マツノサルノコシカケ（解説資料）|https://repository.dl.itc.u-tokyo.ac.jp/record/25706/files/esrh059004.pdf https://www.speciesfungorum.org/names/NamesRecord.asp?RecordId=296184 https://www2.gov.bc.ca/assets/gov/environment/plants-animals-and-ecosystems/wildlife-wildlife-habitat/wildlife-trees/forest_activities_handbook-april_2022.pdf
トンビマイタケ（解説資料）|https://www.pref.gifu.lg.jp/uploaded/attachment/325279.pdf
カイガラタケ（解説資料）|https://www.nilim.go.jp/lab/bcg/siryou/tnn/tnn0566pdf/ks0566.pdf
キクイムシ類・ゾウムシ類の幼虫（解説資料）|https://www.ffpri.go.jp/snap/2013/4-juhikakonchu.html
タマムシ類の幼虫（解説資料）|https://www.ffpri.go.jp/kys/business/tatuta/konchu/yamatotamamushi.html https://extensionentomology.tamu.edu/wp-content/uploads/2025/03/Wood_Boring_Insects.pdf
コメツキムシ類の幼虫（解説資料）|https://www.delta-intkey.com/elateril/www/elat_ela.htm
カミキリムシ類・大型カミキリムシ類の幼虫（解説資料）|https://www.ffpri.go.jp/press/2023/20230323/index.html
ヒラタキクイムシ（解説資料）|https://www.tobunken.go.jp/ccr/pest-search/species/Coleoptera-beetle/hirata_kikuimushi/hirata_kikuimushi.html https://www.mlit.go.jp/common/001192969.pdf
カキノフタトゲナガシンクイ（解説資料）|https://www.erc.pref.fukui.jp/gbank/insect/order223.html https://www.zobodat.at/pdf/MittMuenchEntGes_098_0091-0097.pdf https://researchmap.jp/maruhananomi/misc/49669441/attachment_file.pdf
ニレカワノキクイムシ（解説資料）|https://www.ffpri.go.jp/pubs/bulletin/251/documents/258-2.pdf https://db.koreascholar.com/Article/Detail/290194
チュウゴクツヤナガシンクイ（解説資料）|https://researchmap.jp/maruhananomi/misc/49669441/attachment_file.pdf https://doi.org/10.5852/ejt.2021.746.1325
岩の下の環境|https://agsci.colostate.edu/agbio/ipm-pests/millipedes-centipedes-sowbugs-and-pillbugs/ https://www.takao599museum.jp/treasures/others/?lang=ja
岩の表面とコケの微小環境|https://pubmed.ncbi.nlm.nih.gov/22481304/ https://doi.org/10.1016/j.actao.2017.10.003 https://doi.org/10.1111/ejss.70025
風化の概要|https://opentextbc.ca/physicalgeology2ed/chapter/5-1-mechanical-weathering/ https://opentextbc.ca/physicalgeology2ed/chapter/5-2-chemical-weathering/
凍結融解による風化|https://opentextbc.ca/physicalgeology2ed/chapter/5-1-mechanical-weathering/ https://epub.uni-bayreuth.de/id/eprint/7605/
塩類風化|https://www.sciencedirect.com/science/article/pii/S0008884604000122
温度変化による風化|https://doi.org/10.1130/B31422.1
除荷による剥離|https://opentextbc.ca/physicalgeology2ed/chapter/5-1-mechanical-weathering/ https://www.soest.hawaii.edu/martel/Martel.pubs.pdf/Martel_2006.pdf
乾湿風化|https://www.jstage.jst.go.jp/article/matertrans/65/11/65_MT-Z2024015/_article/-char/ja
酸化・加水分解・溶解|https://opentextbc.ca/physicalgeology2ed/chapter/5-2-chemical-weathering/
還元|https://www.nrcs.usda.gov/sites/default/files/2025-09/Field-Indicators-of-Hydric-Soils-v9-2.pdf
水和|https://doi.org/10.1007/s12371-023-00797-x
炭酸による溶解|https://pubs.usgs.gov/gip/7000072/report.pdf
植物の根による風化|https://opentextbc.ca/physicalgeology2ed/chapter/5-1-mechanical-weathering/ https://doi.org/10.1080/00380768.2021.1878471
地衣類による風化|https://pages.mtu.edu/~raman/papers2/ChenetalCatena00.pdf
微生物による風化|https://pubmed.ncbi.nlm.nih.gov/19660952/ https://doi.org/10.1099/mic.0.037143-0
動物の活動による風化|https://opentextbc.ca/physicalgeology2ed/chapter/5-1-mechanical-weathering/ https://doi.org/10.1146/annurev.earth.31.100901.141314
エゾスナゴケ|https://www1.ous.ac.jp/garden/hada/plantsdic/bryophyta/grimmiaceae/ezosunagoke/ezosunagoke.htm
ケギボウシゴケ|https://okayama-shizenhogo-c.jp/do-shokubutsu/moss?mode=ishi https://gikou2.seesaa.net/article/445374430.html
ハイゴケ（解説資料）|https://biodiversity.pref.fukuoka.lg.jp/futsushu/picturebook/haigoke.html
ヒジキゴケ|https://www.moss-ecology.jp/cont11/main.html https://mikawanoyasou.org/koke/hijikigoke.htm
オオケマイマイ（解説資料）|https://www.nara-edu.ac.jp/cnee/NUE-KINDER-INSECT-GUIDE/web-content/musipage/ookemaimai.html
ニシキマイマイ|https://www.pref.kyoto.jp/kankyo/rdb/bio/db/gshel0039.html
ニッポンマイマイ（解説資料）|https://www.city.nagoya.jp/_res/projects/default_project/_page_/001/033/467/rdb2025_doubutsu_n.pdf
ゴマオカタニシ（解説資料）|https://www.pref.kyoto.jp/kankyo/rdb/bio/db/gshel0021.html
ヤマナメクジ（解説資料）|https://www.nishi.or.jp/bunka/bunka/kairuikan/nishinomiyanokai/82yamanamekuzi.html
マダラコウラナメクジ|https://www.env.go.jp/content/000390411.pdf https://hdl.handle.net/11094/104570
チャコウラナメクジ|https://www.nies.go.jp/biodiversity/invasive/DB/detail/70390.html
トビムシ類|https://extension.umd.edu/resource/springtails https://australian.museum/learn/species-identification/ask-an-expert/what-do-springtails-look-like/
Orchesella cincta・Tomocerus minor|https://www.naturespot.org/species/orchesella-cincta https://www.naturespot.org/species/tomocerus-minor https://doi.org/10.1007/BF00346922
Dicyrtomina ornata|https://www.collembola.org/key/fkuk.htm https://www.naturespot.org/node/132553
Allacma fusca|https://pmc.ncbi.nlm.nih.gov/articles/PMC10427803/
ヤスデ類・ヤケヤスデ|https://nature-museum.city.fukui.lg.jp/asuwayama/zukan/species/c1003.html https://www.pestcontrol-tokyo.jp/yasumukageji/syurui.html https://www.city.nishitokyo.lg.jp/kurasi/kankyo/animals/gaityuu/yasude.html
オビババヤスデ（解説資料）|https://www.chiba-muse.or.jp/natural/special/yama/news/2022/20220710parafontaria.htm
タマヤスデ属の仲間|https://www.takao599museum.jp/treasures/others/タマヤスデ科/387/?lang=ja
陸生等脚類|https://southwestmuseums.org.uk/resources/woodlice/ https://agsci.colostate.edu/agbio/ipm-pests/millipedes-centipedes-sowbugs-and-pillbugs/
ワラジムシ（解説資料）|https://bmig.org.uk/species/porcellio-scaber
オカダンゴムシ（解説資料）|https://www.tokyo-park.or.jp/park/hachijo/creature/detail/0435.html
ニホンヒメフナムシ（解説資料）|https://jhs.nara-edu.ac.jp/cnee/Narakyou-InsectAndSoil_folder/Narakyou-InsectAndSoil/INSECT%20PAGES/Nihonhimefunamushi.html https://www.nat.museum.ibk.ed.jp/wp-content/uploads/2021/03/2021-03-17_17-18-50_890574.pdf
ホソワラジムシ|https://db.kahaku.go.jp/webmuseum/detail?cls=col_a2_10&pkey=NSMT-Cr%2C21178%2C https://bmig.org.uk/species/Porcellionides-pruinosus
甲虫類|https://www.nat.museum.ibk.ed.jp/wp-content/uploads/2025/05/1746935632.pdf
オオゴモクムシ（解説資料）|https://hyoka.nenv.k.u-tokyo.ac.jp/ground_beetle_zukan/5_gomoku/33/ https://www.biwahaku.jp/study/gomimushi/oogomokumushi.html
オオヒラタゴミムシ（解説資料）|https://hyoka.nenv.k.u-tokyo.ac.jp/ground_beetle_zukan/3_naga/17/ https://www.insects.jp/kon-gomioohirata.htm
アオオサムシ（解説資料）|https://www.takao599museum.jp/treasures/selected/2986/?lang=ja https://www.env.go.jp/content/000118143.pdf https://www.ktr.mlit.go.jp/ktr_content/content/000074284.pdf
`;

/* 참고문헌 데이터 변환 */
const references = referenceText
  .trim()
  .split("\n")
  .map((line) => {
    const separatorIndex = line.indexOf("|");
    if (separatorIndex === -1) {
      return null;
    }
    const title = line.slice(0, separatorIndex).trim();
    const urlText = line.slice(separatorIndex + 1).trim();
    const urls = urlText
      ? urlText.split(/\s+/).filter(Boolean)
      : [];
    return { title, urls };
  })
  .filter(Boolean);

/* HTML 요소 */
const openReferencesButton =
  document.getElementById("openReferences");
const closeReferencesButton =
  document.getElementById("closeReferences");
const referencesModal =
  document.getElementById("references-modal");
const referencesPanel =
  referencesModal.querySelector(".references-panel");
const referencesOverlay =
  referencesModal.querySelector(".references-overlay");
const referencesList =
  document.getElementById("referencesList");
let previousFocus = null;

/* 목록 생성 */
function renderReferences() {
  referencesList.replaceChildren();
  references.forEach((reference, index) => {
    const item = document.createElement("article");
    item.className = "reference-item";
    const number = document.createElement("span");
    number.className = "reference-number";
    number.textContent =
      String(index + 1).padStart(2, "0");
    const title = document.createElement("h3");
    title.className = "reference-title";
    title.textContent = reference.title;
    item.append(number, title);

    if (reference.urls.length === 0) {
      const notice = document.createElement("p");
      notice.className = "reference-meta";
      notice.textContent = "個別の出典URLは未確認";
      item.appendChild(notice);
    }

    reference.urls.forEach((url, urlIndex) => {
      const link = document.createElement("a");
      link.className = "reference-url";
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent =
        reference.urls.length > 1
          ? `資料 ${urlIndex + 1}：${url}`
          : url;
      link.style.display = "block";
      item.appendChild(link);
    });
    referencesList.appendChild(item);
  });
}

/* 팝업 열기 */
function openReferences() {
  previousFocus = document.activeElement;
  renderReferences();
  referencesModal.classList.add("is-open");
  referencesModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("references-open");
  referencesList.scrollTop = 0;
  closeReferencesButton.focus();
}

/* 팝업 닫기 */
function closeReferences() {
  referencesModal.classList.remove("is-open");
  referencesModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("references-open");
  if (
    previousFocus &&
    typeof previousFocus.focus === "function"
  ) {
    previousFocus.focus();
  }
}

/* 클릭 이벤트 */
openReferencesButton.addEventListener(
  "click",
  openReferences
);
closeReferencesButton.addEventListener(
  "click",
  closeReferences
);
referencesOverlay.addEventListener(
  "click",
  closeReferences
);

/* ESC / 키보드 포커스 */
document.addEventListener("keydown", (event) => {
  if (!referencesModal.classList.contains("is-open")) {
    return;
  }
  if (event.key === "Escape") {
    closeReferences();
    return;
  }
  if (event.key !== "Tab") {
    return;
  }
  const focusable = Array.from(
    referencesPanel.querySelectorAll(
      'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
    )
  );
  if (focusable.length === 0) {
    event.preventDefault();
    referencesPanel.focus();
    return;
  }
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (
    !event.shiftKey &&
    document.activeElement === last
  ) {
    event.preventDefault();
    first.focus();
  }
});
