/* ============================================================================
   小倉貫通！モノレール・ダッシュ ― ゲームデータ（ここだけ直せば調整できます）
   ----------------------------------------------------------------------------
   ・単位はすべて「実際の距離」です。km は小倉駅からの営業キロ、m はメートル。
   ・色は '#rrggbb'。数値や文言を書き換えて保存するだけで反映されます。
   ・読み込み順: このファイル → kokura-monorail-dash.html（ゲーム本体）

   目次
     1. line / train      実在する路線・車両の諸元
     2. stations          駅（実際の営業キロ）
     3. landmarks         背景に出す名所（実在・出典つき）
     4. gaugeSettings     パワーゲージ
     5. judge / fail      判定
     6. run / launch      走行・発車演出
     7. score / rank      採点とランク
     8. skies             ラウンドごとの時間帯（朝→夜）
     9. camera            カメラ位置（x,z は車両/駅からの相対[m]、y は線路面からの高さ[m]）
    10. text              画面の文言
   ============================================================================ */
window.MONORAIL_DATA = {

  /* ---------------------------------------------------------------- 1. 実在データ */
  line: {
    name: '北九州モノレール小倉線',
    operator: '北九州高速鉄道',
    lengthKm: 8.8,            // 営業キロ（出典: 北九州モノレール公式「あらまし」）
    stationCount: 13,
    structure: '跨座式モノレール',
    travelMinutes: 19,        // 小倉〜企救丘（公式）
    maxSpeedKmh: 65.0,        // 公式
  },

  train: {
    cars: 4,                  // 4両編成（公式）
    lengthM: 60.47,           // 全長 60.47 m（公式）
    colors: { body: '#ffffff', stripe: '#1aa7e0', accent: '#ffb21a', glass: '#1b2d52' },
  },

  /* ---------------------------------------------------------------- 2. 駅
     km  : 小倉からの営業キロ（出典: Wikipedia英語版 Kitakyushu Monorail の駅一覧）
     spot: 駅選択カードに出す一言（出典は landmarks の source / 下記コメント）
     color: 駅舎・屋根のポップな差し色（演出用）                                      */
  stations: [
    { id: 'kokura',      name: '小倉',         kana: 'こくら',                 km: 0.0, color: '#ff7a59', spot: '駅ビルの中ほどから発車！' },
    { id: 'heiwadori',   name: '平和通',       kana: 'へいわどおり',           km: 0.4, color: '#ffb21a', spot: '小倉から最初の駅（0.4 km）' },
    { id: 'tanga',       name: '旦過',         kana: 'たんが',                 km: 0.7, color: '#2fc4b2', spot: '旦過市場・勝山公園が近い' },
    { id: 'kawaraguchi', name: '香春口三萩野', kana: 'かわらぐちみはぎの',     km: 1.6, color: '#7a6cff', spot: '車窓に旦過市場の再開発' },
    { id: 'katano',      name: '片野',         kana: 'かたの',                 km: 2.4, color: '#ff5d8f', spot: '手前で都市高速の上を走る' },
    { id: 'jono',        name: '城野',         kana: 'じょうの',               km: 3.2, color: '#4aa8ff', spot: 'JR日豊本線をまたぐ' },
    { id: 'kitagata',    name: '北方',         kana: 'きたがた',               km: 4.2, color: '#ffa43a', spot: '都市高速と交差する' },
    { id: 'keibajo',     name: '競馬場前',     kana: 'けいばじょうまえ',       km: 4.9, color: '#46c26a', spot: '小倉競馬場のコースが見える' },
    { id: 'moritsune',   name: '守恒',         kana: 'もりつね',               km: 5.7, color: '#e85ad8', spot: '' },
    { id: 'tokuriki1',   name: '徳力公団前',   kana: 'とくりきこうだんまえ',   km: 6.6, color: '#ff8a4a', spot: '先でユニークなマンション群' },
    { id: 'tokuriki2',   name: '徳力嵐山口',   kana: 'とくりきあらしやまぐち', km: 7.3, color: '#3fd0e0', spot: 'ユニークなマンション群の区間' },
    { id: 'shii',        name: '志井',         kana: 'しい',                   km: 8.2, color: '#9be04a', spot: '' },
    { id: 'kikugaoka',   name: '企救丘',       kana: 'きくがおか',             km: 8.8, color: '#ff6b6b', spot: '志井公園・車両基地が近い' },
  ],

  /* ---------------------------------------------------------------- 3. 名所
     kind    : 3Dモデルの種類（stationBuilding / stadium / market / retroMarket /
               museum / racecourse / expresswayAlong / expresswayCross / railCross /
               apartments / hillHouses / depotPark / castle）
     km      : 路線上の位置（実際の営業キロ）。 z: 線路から横にどれだけ離すか[m]（演出用）
     evidence: 'window'       = 車窓から見えると出典で確認できたもの
               'station-area' = 公式の「駅周辺情報」に載る施設（車窓からの見え方は未確認）
               'walk'         = 駅から歩く距離で、車窓から見えるかは未確認
     enabled : false にすると表示しません
     ※ 横方向の位置(z)と大きさはデザイン上の配置です。実際の位置関係とは異なります。 */
  landmarkFilter: ['window', 'station-area'],   // 'walk' を足すと徒歩圏の名所も出ます

  landmarks: [
    { id: 'kokuraBuilding', name: '小倉駅ビル', kind: 'stationBuilding', km: 0.0, z: 0, enabled: true, evidence: 'window',
      caption: '地上14階・地下3階の駅ビル。南側の3〜4階の吹き抜けにモノレールが乗り入れ、4階のホームが終点（改札はその下の3階）',
      source: 'https://ja.wikipedia.org/wiki/%E5%B0%8F%E5%80%89%E9%A7%85_(%E7%A6%8F%E5%B2%A1%E7%9C%8C)' },

    { id: 'stadium', name: 'ミクニワールドスタジアム北九州', kind: 'stadium', km: 0.0, z: -250, enabled: true, evidence: 'station-area',
      caption: '小倉駅の駅周辺施設（公式）', source: 'https://www.kitakyushu-monorail.co.jp/route/kokura.php' },

    { id: 'tangaMarket', name: '旦過市場', kind: 'market', km: 0.75, z: -62, enabled: true, evidence: 'window',
      caption: '香春口三萩野駅付近の車窓から再開発中の旦過市場が見える',
      source: 'https://monotabi.jp/?p=927' },

    { id: 'ogonMarket', name: '黄金市場', kind: 'retroMarket', km: 1.5, z: 52, enabled: true, evidence: 'station-area',
      caption: '香春口三萩野駅の近く。昭和レトロな市場', source: 'https://monotabi.jp/?p=927' },

    { id: 'totoMuseum', name: 'TOTOミュージアム', kind: 'museum', km: 1.72, z: 78, enabled: true, evidence: 'station-area',
      caption: '香春口三萩野駅の近く', source: 'https://monotabi.jp/?p=927' },

    { id: 'expresswayA', name: '都市高速（上を走る）', kind: 'expresswayAlong', kmFrom: 1.75, kmTo: 2.35, enabled: true, evidence: 'window',
      caption: '香春口三萩野〜片野間は都市高速道路の上を走る', source: 'https://monotabi.jp/?p=927' },

    { id: 'nippoLine', name: 'JR日豊本線', kind: 'railCross', km: 2.8, enabled: true, evidence: 'window',
      caption: '片野〜城野間でJR日豊本線の上を通過', source: 'https://monotabi.jp/?p=927' },

    { id: 'expresswayB', name: '都市高速（交差）', kind: 'expresswayCross', km: 3.7, enabled: true, evidence: 'window',
      caption: '城野〜北方間で都市高速道路と交差', source: 'https://monotabi.jp/?p=927' },

    { id: 'racecourse', name: '小倉競馬場', kind: 'racecourse', km: 5.25, z: -150, enabled: true, evidence: 'window',
      caption: 'JRAの競馬場。競馬場前駅を過ぎると車窓にコースが見える',
      source: 'https://www.tripadvisor.jp/ShowUserReviews-g303160-d8699721-r469782012-Kitakyushu_Monorail-Kitakyushu_Fukuoka_Prefecture_Kyushu.html' },

    { id: 'apartments', name: 'ユニークなマンション群', kind: 'apartments', km: 7.4, z: 52, enabled: true, evidence: 'window',
      caption: '徳力公団前〜志井間の車窓の見どころ', source: 'https://monotabi.jp/?p=927' },

    { id: 'hillHomes', name: '丘の住宅地', kind: 'hillHouses', km: 8.45, z: 105, enabled: true, evidence: 'window',
      caption: '終点に向かって急勾配で丘の住宅地を登る',
      source: 'https://note.com/jojo778m/n/ndc00a6356888' },

    { id: 'depotPark', name: '志井公園・車両基地', kind: 'depotPark', km: 8.88, z: 55, enabled: true, evidence: 'window',
      caption: '企救丘駅の先に車両基地。駅の近くに志井公園とアドベンチャープール',
      source: 'https://www.kitakyushu-monorail.co.jp/route/kikugaoka.php' },

    // 徒歩圏の名所（既定では非表示）。landmarkFilter に 'walk' を足すと出ます。
    { id: 'kokuraCastle', name: '小倉城', kind: 'castle', km: 0.55, z: -380, enabled: true, evidence: 'walk',
      caption: '唐造りの天守。最寄りはJR西小倉駅から徒歩約10分。モノレールの車窓から見えるかは未確認',
      source: 'https://www.ana.co.jp/ja/hk/japan-travel-planner/fukuoka/0000027.html' },
  ],

  /* ---------------------------------------------------------------- 4. ゲージ
     maxM        ゲージ最大距離[m]（路線 8.8 km + 余裕）
     zoneM       目標駅まわり「±何m」を拡大して扱うか
     zoneHalf    その拡大区間がゲージ幅に占める半分の割合
     sweepSec    ゲージが端から端まで動く秒数
     zoneSlow    拡大区間でカーソルを遅くする倍率（小さいほど遅い＝易しい）                */
  gaugeSettings: { maxM: 9000, zoneM: 30, zoneHalf: 0.1, sweepSec: 2.4, zoneSlow: 0.25, loupeM: 24,
                   bounce: false },   // bounce: false = 最大まで行ったら戻らず MAX で止まる / true = 往復する

  /* ---------------------------------------------------------------- 5. 判定（誤差の許容[m]） */
  judge: [
    { id: 'PERFECT', tol: 1,  score: 1000, label: 'PERFECT!', sub: 'ジャスト停車！', color: '#ffd24a', edge: '#7a3b00' },
    { id: 'GREAT',   tol: 5,  score: 600,  label: 'GREAT!',   sub: 'ナイス停車！',   color: '#6dffb8', edge: '#06503a' },
    { id: 'GOOD',    tol: 10, score: 300,  label: 'GOOD',     sub: '停車成功',       color: '#8fdcff', edge: '#0b3c66' },
  ],
  fail: {
    over:   { id: 'OVER',  label: 'OVER RUN', sub: '止まりきれず通過！', color: '#ff5a6e', edge: '#4c0010' },
    short:  { id: 'SHORT', label: 'SHORT',    sub: '手前で停車…',       color: '#ff9a5a', edge: '#4c1f00' },
    derailSub: '終端を突破！脱線！',
  },

  /* ---------------------------------------------------------------- 6. 走行・演出
     走行時間 = baseSec + secPerSqrtKm × √(距離km)。decelPower が大きいほど終盤がゆっくり。 */
  run:    { baseSec: 1.8, secPerSqrtKm: 1.0, decelPower: 3, endBufferM: 15, zoomPerfect: 0.55, zoomGreat: 0.8 },
  // zoomPerfect / zoomGreat: 停車後にカメラが寄る倍率（小さいほど近づく。1 = 寄らない）
  // decelPower: 大きいほど停車直前がゆっくりになり、ぴたっと止まる瞬間が見やすい
  /* 発車カットシーン（3カメ）。until = そのカットが終わる秒。最後の until が全体の長さ。
     mode  : 'fixed' = 定点（pos は線路上の絶対位置[m] / 高さ / 横）、 'follow' = 車両に追従（pos は車両からの相対）
     pos   : [x, 線路面からの高さ, z]     look : 注視点（follow は車両からの相対）
     dolly : そのカット中にカメラが動く量   track : 注視点を走る車両へ寄せる割合(0-1)   lead : 車両の何m先を見るか
     fov / fovTo : 画角（始まり→終わり）    shake : 揺れの強さ
     anticipate : 発車の合図（ズバッ！）が出る秒。 travelMaxM : このカットで走る距離の上限[m]、 accelPower : 加速の鋭さ */
  launch: {
    sec: 2.6, anticipate: 0.7, skipAfter: 0.6, travelMaxM: 180, accelPower: 1.7, minCamX: 55,   // minCamX: カメラが駅ビルの中に入らない下限の位置[m]
   
    shots: [
      { until: 0.7, mode: 'fixed',  pos: [100, 5, 30],   look: [5, 2.5, 0],  dolly: [-10, 0.5, -6], fov: 54, fovTo: 48, shake: 0.18 },   // ① ビルの南面を斜めから。開口の奥で車両が震える
      { until: 1.6, mode: 'fixed',  pos: [118, 2.2, 32], look: [45, 5.5, 0], dolly: [-8, 0.6, 0],  track: 0.55, lead: 24, fov: 62, fovTo: 74, shake: 0.5 },   // ② 出口側の低い位置。飛び出す瞬間
      { until: 2.6, mode: 'follow', pos: [12, 6, 60],    look: [6, 3, 0],                          fov: 52, fovTo: 64, shake: 0.35 },   // ③ 横から追走。そのまま走行へ
    ],
  },

  /* ---------------------------------------------------------------- 7. 採点 */
  score: { distanceBonusMax: 1.0, comboBonus: 100 },
  rank:  [ { id: 'S', min: 0.8 }, { id: 'A', min: 0.55 }, { id: 'B', min: 0.3 }, { id: 'C', min: 0 } ],
  rounds: 5,

  /* ---------------------------------------------------------------- 8. 時間帯（ラウンド順）
     skyTop/skyBottom 空  fog 遠景  hemiSky/hemiGround 環境光  hemi/sunI 光の強さ（強すぎると白飛びします）  sun 太陽光  glow 窓の灯り(0-1)
     ground 地面  road 道路  far 遠景の山  orb 太陽/月                                       */
  skies: [
    { name: '朝',     skyTop: '#6cc4ff', skyBottom: '#ffe9c4', fog: '#d9ecff', hemiSky: '#ffffff', hemiGround: '#9bb0c8', hemi: 0.55, sun: '#fff1cf', sunI: 0.54, sunDir: [-0.5, 0.6, 0.6], glow: 0.0, ground: '#8fcf86', road: '#59627a', far: '#7aa9c4', stars: false, orb: { color: '#fff6c9', size: 70, dir: [-0.8, 0.35, -0.5] } },
    // 昼 = 朝と、従来の昼の「中間の色」（明るさ hemi / sunI は自然光寄りに少し暗め）。従来の昼の行:
    // { name: '昼',     skyTop: '#2c98f0', skyBottom: '#bfe8ff', fog: '#cfe8ff', hemiSky: '#ffffff', hemiGround: '#a8bdd3', hemi: 1.4, sun: '#fff8ec', sunI: 1.35, sunDir: [0.2, 1.0, 0.5], glow: 0.0, ground: '#7cc97a', road: '#555e74', far: '#6aa0c0', stars: false, orb: { color: '#ffffff', size: 60, dir: [0.2, 0.9, -0.6] } },
    { name: '昼',     skyTop: '#4caef8', skyBottom: '#dfe8e2', fog: '#d4eaff', hemiSky: '#ffffff', hemiGround: '#a2b6ce', hemi: 1.1, sun: '#fff4de', sunI: 1.05, sunDir: [-0.15, 0.8, 0.55], glow: 0.0, ground: '#86cc80', road: '#576077', far: '#72a4c2', stars: false, orb: { color: '#fffae4', size: 65, dir: [-0.3, 0.62, -0.55] } },
    { name: '午後',   skyTop: '#4f86d6', skyBottom: '#ffd9a0', fog: '#ffe3bd', hemiSky: '#fff0d8', hemiGround: '#8f9ab8', hemi: 0.52, sun: '#ffd9a0', sunI: 0.57, sunDir: [0.8, 0.35, 0.5], glow: 0.0, ground: '#87bf70', road: '#585a70', far: '#7d8bb4', stars: false, orb: { color: '#ffe0a0', size: 80, dir: [0.9, 0.3, -0.5] } },
    { name: '夕暮れ', skyTop: '#2b2f6b', skyBottom: '#ff8d5c', fog: '#ff9a72', hemiSky: '#ffc8a0', hemiGround: '#5a4a78', hemi: 0.43, sun: '#ff9d6a', sunI: 0.51, sunDir: [0.9, 0.18, 0.4], glow: 0.55, ground: '#6a8f5e', road: '#4a4a62', far: '#6a4c82', stars: false, orb: { color: '#ffb070', size: 95, dir: [0.95, 0.15, -0.4] } },
    { name: '夜',     skyTop: '#060a1c', skyBottom: '#1d2f66', fog: '#17224a', hemiSky: '#5a78c8', hemiGround: '#1c2440', hemi: 0.41, sun: '#9db8ff', sunI: 0.27, sunDir: [-0.4, 0.8, 0.4], glow: 1.0, ground: '#27405a', road: '#2b3048', far: '#1c2c5c', stars: true, orb: { color: '#f4f1d6', size: 55, dir: [-0.7, 0.55, -0.5] } },
  ],

  /* 明るさの調整（白飛びするときは数値を下げる）
     hemiScale / sunScale : 各時間帯のライト強さに掛ける倍率。 fogNear / fogFar : 霧が始まる/完全にかかる距離[m] */
  lighting: { hemiScale: 0.5, sunScale: 0.6, fogNear: 260, fogFar: 2600,
              // 車両の光源（ヘッドライト側の点光源）。night = 夜の強さ / launch = 発車シーン / charge = チャージ最大時 / range = 届く距離[m]
              trainLight: { night: 0.7, launch: 0.5, charge: 0.9, range: 55 } },

  /* ---------------------------------------------------------------- 9. カメラ（車両中心からの相対位置[m]） */
  camera: {
    run:    { pos: [-84, 12, 22], look: [20, 6, 0], fov: 55, fovAtSpeed: 22 },
    station:{ pos: [-4, 10, 44], look: [0, 4, -2], fov: 50 },
    charge: { pos: [-46, 4.6, 3], look: [70, 4, 0], fov: 62 },
    title:  { radius: 96, height: 26, fov: 52 },
  },

  /* ---------------------------------------------------------------- 10. 文言 */
  storageKey: 'kokura-monorail-dash.best.v2',
  text: {
    title1: '小倉貫通！', title2: 'モノレール・ダッシュ', tagline: '小倉駅ビルを突き抜けろ',
    rules: ['画面を長押しでパワーをためる', '目標駅の位置で指を離して発車', 'ぴたっと停めて高得点'],
    start: 'TAP TO START',
    ready: '長押しでチャージ',
    charging: '狙った位置で離して発車！',
    chargeMax: '最大！指を離して発車',
    next: 'タップで次のラウンドへ',
    toFinal: 'タップで結果を見る',
    retry: 'タップでもう一度',
  },
};
