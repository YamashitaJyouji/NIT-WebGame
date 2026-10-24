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
    colors: { body: '#ffffff', stripe: '#1aa7e0', accent: '#ffb21a', glass: '#1b2d52' },   // liveries が無い場合の予備
    liveryByRound: ['blueLine', 'green', 'purple', 'urbanRapid', 'openingCream'],   // ラウンドごとの塗装（実車も編成ごとに塗装が違う）
    titleLivery: 'blueLine',
    /* 実車（1000形）の確認できた特徴: 日本跨座式(日立ALWEG)・4両・両開き扉・2段窓・大きな前面窓(右側は小窓)・
       連結部のキノコ形ホロ・軌道桁 幅850×高1500mm・集電は第三軌条(パンタ無し)・全列車「企救丘」行き。
       ↓ 確認できていない値（寸法・帯の位置と太さ・各塗装の正確な色）は近似です。写真が手に入れば直してください。 */
    dims: { width: 2.95, bodyH: 3.3, gap: 0.7, beamW: 0.85, beamH: 1.5, doorsPerSide: 2, windowsPerSide: 6, dest: '企救丘' },
  },
  /* 塗装プリセット。body=車体 / stripe=窓下の太い帯 / accent=細い帯 / roof=屋根 / skirt=足回り / front=前面の飾り帯
     evidence: 'confirmed'=名称と大まかな色が資料で確認済み / 'approx'=名称のみ確認で色は推定 */
  liveries: {
    // 参考写真（raillab 掲載の1000形）: 白い車体に、窓下の太い青帯と窓上の細い青線。前面は黒いマスクに大きな窓、下に丸いマーク、青い行先表示、足回りは明るいグレーの台車カバー
    blueLine:   { name: 'ブルーライン（白地に青帯）', body: '#e9eef3', stripe: '#2c63b8', accent: '#2c63b8', roof: '#c7ced8', skirt: '#cfd6de', evidence: 'photo: 参考写真から（青の濃さは推定）' },
    openingCream: { name: '開業時塗装（クリーム地に青帯）', body: '#e7dfc6', stripe: '#2c6fc4', accent: '#2c6fc4', roof: '#c9c4b0', skirt: '#4a5568', evidence: 'confirmed: クリーム地に青帯（帯位置は推定）' },
    green:      { name: 'グリーンカラー',             body: '#e9eee4', stripe: '#3aa857', accent: '#9bd36a', roof: '#c8d0c4', skirt: '#47554c', evidence: 'approx: 名称のみ確認' },
    purple:     { name: 'パープルライン',             body: '#ece8f0', stripe: '#7b4db5', accent: '#c7a6ec', roof: '#cdc8d6', skirt: '#4f4863', evidence: 'approx: 名称のみ確認' },
    urbanRapid: { name: 'アーバンラピッド',           body: '#e3e9f0', stripe: '#e2493b', accent: '#2f3f63', roof: '#c3ccd8', skirt: '#414c63', evidence: 'approx: 名称のみ確認' },
  },

  /* ---------------------------------------------------------------- 2. 駅
     km  : 小倉からの営業キロ（出典: Wikipedia英語版 Kitakyushu Monorail の駅一覧）
     spot: 駅選択カードに出す一言（出典は landmarks の source / 下記コメント）
     color: 駅舎・屋根のポップな差し色（演出用）                                      */
  stations: [
    { id: 'kokura',      name: '小倉',         kana: 'こくら',                 km: 0.0, color: '#ff7a59', spot: '駅ビルの中ほどから発車！', tip: '駅ビル4階がモノレールの終点ホーム。ここから全線8.8km・約19分の旅が始まる' },
    { id: 'heiwadori',   name: '平和通',       kana: 'へいわどおり',           km: 0.4, color: '#ffb21a', spot: '小倉から最初の駅（0.4 km）', tip: '小倉から最初の駅。わずか0.4kmで着く' },
    { id: 'tanga',       name: '旦過',         kana: 'たんが',                 km: 0.7, color: '#2fc4b2', spot: '旦過市場・勝山公園が近い', tip: '旦過市場・勝山公園が近い。昔ながらの市場の街' },
    { id: 'kawaraguchi', name: '香春口三萩野', kana: 'かわらぐちみはぎの',     km: 1.6, color: '#7a6cff', spot: '車窓に旦過市場の再開発', tip: '旦過市場の再開発が車窓から見える。黄金市場やTOTOミュージアムも近い' },
    { id: 'katano',      name: '片野',         kana: 'かたの',                 km: 2.4, color: '#ff5d8f', spot: '手前で都市高速の上を走る', tip: 'この前後の区間は都市高速道路の上を走る' },
    { id: 'jono',        name: '城野',         kana: 'じょうの',               km: 3.2, color: '#4aa8ff', spot: 'JR日豊本線をまたぐ', tip: 'JR日豊本線の上をまたいで走る' },
    { id: 'kitagata',    name: '北方',         kana: 'きたがた',               km: 4.2, color: '#ffa43a', spot: '都市高速と交差する', tip: '都市高速道路と交差するあたり' },
    { id: 'keibajo',     name: '競馬場前',     kana: 'けいばじょうまえ',       km: 4.9, color: '#46c26a', spot: '小倉競馬場のコースが見える', tip: '小倉競馬場のコースが車窓から見える' },
    { id: 'moritsune',   name: '守恒',         kana: 'もりつね',               km: 5.7, color: '#e85ad8', spot: '', tip: '終点の企救丘まで、あと3.1km' },
    { id: 'tokuriki1',   name: '徳力公団前',   kana: 'とくりきこうだんまえ',   km: 6.6, color: '#ff8a4a', spot: '先でユニークなマンション群', tip: 'このあたりからユニークなマンション群の区間' },
    { id: 'tokuriki2',   name: '徳力嵐山口',   kana: 'とくりきあらしやまぐち', km: 7.3, color: '#3fd0e0', spot: 'ユニークなマンション群の区間', tip: 'ユニークなマンション群が車窓に並ぶ区間' },
    { id: 'shii',        name: '志井',         kana: 'しい',                   km: 8.2, color: '#9be04a', spot: '', tip: '終点・企救丘の1つ手前の駅（営業キロ8.2km）' },
    { id: 'kikugaoka',   name: '企救丘',       kana: 'きくがおか',             km: 8.8, color: '#ff6b6b', spot: '志井公園・車両基地が近い', tip: '終点。志井公園・車両基地が近い。全列車がここまで走る' },
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
    { id: 'PERFECT', tol: 1,  score: 1800, label: 'PERFECT!', sub: 'ジャスト停車！', color: '#ffd24a', edge: '#7a3b00' },
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

  /* ---------------------------------------------------------------- 6b. 先バレ演出（パチンコ風）
     指を離した瞬間の誤差が 0.0 m（表示が「0.0 m」になる範囲）だったとき、結果が出る前に当たりを匂わせる予告を出します。
     enabled   : false で無効化
     thresholdM: |誤差| がこの値[m]未満で発動。0.05 = 画面表示が「0.0 m」になる範囲（ねらって約5回に1回が目安）。
                 もっと厳しくしたいときは 0.005（表示が「0.00 m」の範囲。約50回に1回）。
     stages    : 離した瞬間からの経過秒 at で順に発動（発車カット → 走行にまたがって進みます）
        kind 'heartbeat' = 暗転して鼓動（画面の縁が脈打つ）
        kind 'lamp'      = 上部の保留ランプが n 番目から点灯（青→緑→赤→虹の保留変化）
        kind 'cutin'     = 帯のカットイン（text / sub / dur[秒]）
        kind 'persona'   = 赤×黒×白の「決めカット」全画面カットイン（text / sub / tag / dur）。終わるまで発車を待ち、終わると発車！
        kind 'kakutei'   = 確定演出（車両と目標駅の光柱が虹色に、画面枠が虹色に、text / sub を表示）
     resultSub : 当たったとき（PERFECT）の結果画面のひとこと                              */
  foreshadow: {
    enabled: true,
    thresholdM: 0.05,
    lampColors: ['#3aa0ff', '#3fdc7a', '#ff3b4d', 'rainbow'],
    /* 確定演出のパターン。誤差 0.0 m のとき、この中から 1 つがランダムに選ばれる（w が大きいほど出やすい）。
       stages の at は秒。when:'run' は「停車へ向かう走行シーンが始まってから」の秒、省略は「離した瞬間から」の秒。
       kind : heartbeat(鼓動) / lamp(保留ランプ n=0..3) / lampoff(ランプ消灯) / cutin(帯カットイン) / persona(決めカット) / kakutei(虹の確定)
       hold:true  … そのカットインが終わるまで発車を待たせる（persona は自動で待つ）
       style:'fail' … 青黒いガセ風のカットイン      calm:true … 最初は画面の脈動なし（普通の発車に見せる）
       runStretch … 走行シーンをその倍率だけゆっくりにして、演出の時間を確保 */
    patterns: [
      { id: 'classic', name: '王道（ランプ → 激アツ → 決めカット）', w: 1, stages: [
        { at: 0.00, kind: 'heartbeat' },
        { at: 0.30, kind: 'lamp', n: 0 }, { at: 0.65, kind: 'lamp', n: 1 }, { at: 1.00, kind: 'lamp', n: 2 }, { at: 1.35, kind: 'lamp', n: 3 },
        { at: 1.75, kind: 'cutin',   text: '激アツ!!', sub: 'この感じ…来るぞ!?', dur: 0.95 },
        { at: 2.75, kind: 'persona', text: '確定', sub: 'ぴったり 0.0 m', tag: 'TAKE OFF', dur: 1.8 },
        { at: 4.60, kind: 'kakutei', text: '確定!!', sub: 'ぴったり 0.0 m' },
      ] },
      { id: 'premiere', name: '突然プレミア（予兆なしでいきなり決めカット）', w: 1, stages: [
        { at: 0.00, kind: 'heartbeat' },
        { at: 0.40, kind: 'persona', text: '超確定', sub: '虹の予感', tag: 'PREMIUM', dur: 1.7 },
        { at: 2.15, kind: 'kakutei', text: '確定!!', sub: 'ぴったり 0.0 m' },
      ] },
      { id: 'interrupt', name: '発車後の割り込み（普通に発車 → 走行中に乱入）', w: 1, calm: true, runStretch: 1.7, stages: [
        { at: 0.35, when: 'run', kind: 'cutin', sfx: 'rev', style: 'rev', text: '割り込み!!', sub: 'この走り…まさか!?', dur: 0.95 },
        { at: 1.40, when: 'run', kind: 'persona', text: '確定', sub: 'ぴったり 0.0 m', tag: 'INTERRUPT', dur: 1.3 },
        { at: 2.80, when: 'run', kind: 'kakutei', text: '確定!!', sub: 'ぴったり 0.0 m' },
      ] },
      { id: 'fakeout', name: 'ガセ → 逆転（外れそうに見せて、発車後に確定）', w: 1, runStretch: 1.8, stages: [
        { at: 0.00, kind: 'heartbeat' },
        { at: 0.30, kind: 'lamp', n: 0 }, { at: 0.65, kind: 'lamp', n: 1 },
        { at: 1.00, kind: 'cutin', sfx: 'fail', style: 'fail', hold: true, text: '残念…', sub: 'ちょっとズレたかも', dur: 0.95 },
        { at: 1.25, kind: 'lampoff', sfx: 'lampoff' },
        { at: 0.40, when: 'run', kind: 'cutin', sfx: 'rev', style: 'rev', text: 'いや…待て!!', sub: 'この感じは…!?', dur: 0.9 },
        { at: 0.45, when: 'run', kind: 'lamp', n: 3, sfx: 'rev' },
        { at: 1.45, when: 'run', kind: 'persona', text: '確定', sub: 'ぴったり 0.0 m', tag: 'REVERSAL', dur: 1.3 },
        { at: 2.85, when: 'run', kind: 'kakutei', text: '確定!!', sub: 'ぴったり 0.0 m' },
      ] },
      { id: 'twist', name: '静かな発車 → ズレた？ → どんでん返し', w: 1, calm: true, runStretch: 2.0, stages: [
        { at: 0.30, when: 'run', kind: 'cutin', sfx: 'fail', style: 'fail', text: 'ズレてる…?', sub: 'ブレーキが早いか!?', dur: 0.95 },
        { at: 1.40, when: 'run', kind: 'cutin', sfx: 'rev', style: 'rev', text: 'と思いきや!!', sub: '', dur: 0.8 },
        { at: 2.10, when: 'run', kind: 'persona', text: '確定', sub: 'ぴったり 0.0 m', tag: 'TWIST', dur: 1.3 },
        { at: 3.50, when: 'run', kind: 'kakutei', text: '確定!!', sub: 'ぴったり 0.0 m' },
      ] },
    ],
    resultSub: '先バレ的中！ぴったり 0.0 m',
  },

  /* ---------------------------------------------------------------- 7. 採点 */
  score: {
    /* 1ラウンドの最大は 2000 点 × 5 = 10000 点。距離（駅の遠さ）による有利・不利はありません。
       justTol : 誤差がこの値[m]未満（表示「0.0 m」）を「ジャスト」とし、justPts 点（満点）。
       PERFECT : 誤差 justTol〜1 m で perfectMax → perfectMin 点に下がる。 GREAT / GOOD は judge の score。
       comboBonus : 連続で停車成功するたびに +この点（2回目から）。ジャスト以外は nonJustCap 点が上限なので、
                    10000 点になれるのは 5 回ともジャストのときだけ。                                        */
    justTol: 0.05, justPts: 2000, perfectMax: 1800, perfectMin: 1000, comboBonus: 100, nonJustCap: 1990,
  },
  /* 長押しの最短時間[秒]。これより短い「ポチッ」は発車せず、やり直しになります（連打・ミスタップ対策） */
  charge: { minHoldSec: 0.3 },
  /* オンライン対戦（端末同士を直接つなぐ WebRTC）。iceServers: 接続の手助けをする STUN サーバー（無料の公開サーバー）。
     自分の STUN/TURN に変えたいときはここを書き換えます。同じ Wi-Fi 内なら無くてもつながることが多いです。 */
  online: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] },
  /* 今日のお題（日替わり）: seeded:true なら、その日（日本時間）は全員同じ 5 駅になります（ランキングを公平にするため） */
  daily: { seeded: true },
  /* ランキング（今日のベスト）
     endpoint を空にすると、このページの共有データベース（db）を使います。使えるのは「このページを開けて書き込みを許された人」だけで、
     見知らぬ全国の人の書き込みは受け付けられません。全国向けにするには、同梱の ranking-worker.js を自分のサーバー（Cloudflare Workers）に置き、
     その URL をここに書いてください（GET ?day=YYYY-MM-DD で一覧、POST で登録）。                                     */
  ranking: { enabled: true, endpoint: '', top: 10, collection: 'ranking' },
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

  /* ---------------------------------------------------------------- 9b. BGM（モノレールに乗っている気分）
     WebAudio でその場で演奏します（音源ファイル不要）。enabled:false で無効、volume で全体の音量。
     ride  : 走行音。hum=駅で鳴る低い電気の唸り / speedHum・speedWhoosh=速度に応じて増える走行音と風切り音
     chimes: 発車メロディ(departure)と、停車駅が近づく「ピンポーン」(approach)
     moods : 場面ごとの曲。bpm / swing(0〜0.3) / gain / hum / chords(コード進行・1小節ずつ)
        chords[].bass = ベース音、notes = コード構成音（音名: C4, F#3, Bb3 のように書く）
        layers: 楽器ごとの 16 ステップ譜。'.'=休み / 'x'=発音 / 'X'=アクセント
            pad(和音の持続) comp(エレピのコード) bass kick hat tick(レールの継ぎ目 コトン) mel(メロディ) arp(アルペジオ)
            mel の数字は notes の何番目か（1オクターブ上で鳴る）。 min=この強さ(0〜1)以上で参加（チャージ中はゲージ量が強さ）
     moods は title / charge / run / result / final を使います。                            */
  bgm: {
    enabled: true, volume: 0.9,
    ride: { hum: 0.012, speedHum: 0.10, speedWhoosh: 0.06 },
    chimes: {
      departure: [ { n: 'E5', at: 0.00, dur: 0.9 }, { n: 'C5', at: 0.30, dur: 0.9 }, { n: 'G4', at: 0.60, dur: 0.9 }, { n: 'C5', at: 0.90, dur: 1.4 } ],
      approach:  [ { n: 'G5', at: 0.00, dur: 1.0 }, { n: 'E5', at: 0.45, dur: 1.4 } ],
    },
    moods: {
      title: { bpm: 90, swing: 0.12, gain: 1.0, hum: 1.0,
        chords: [ { bass: 'F2', notes: ['A3','C4','E4','G4'] }, { bass: 'E2', notes: ['G3','B3','D4','F#4'] }, { bass: 'D2', notes: ['F3','A3','C4','E4'] }, { bass: 'C2', notes: ['E3','G3','B3','D4'] } ],
        layers: { pad:  { pat: 'X...............', gain: 0.05 }, comp: { pat: 'x..x..x...x..x..', gain: 0.06 }, bass: { pat: 'x.....x.x.......', gain: 0.16 },
                  kick: { pat: 'x.......x.......', gain: 0.18 }, hat:  { pat: 'x.x.x.x.x.x.x.x.', gain: 0.025 }, mel: { pat: '..2...3.4...3.2.', gain: 0.06 } } },
      charge: { bpm: 128, swing: 0.0, gain: 0.9, hum: 1.0,
        chords: [ { bass: 'A2', notes: ['C4','E4','G4','B4'] }, { bass: 'F2', notes: ['A3','C4','E4','G4'] }, { bass: 'D2', notes: ['F3','A3','C4','E4'] }, { bass: 'E2', notes: ['G#3','B3','D4','F#4'] } ],
        layers: { pad:  { pat: 'X...............', gain: 0.05 }, kick: { pat: 'x...x...x...x...', gain: 0.2, min: 0.10 }, bass: { pat: 'x.x.x.x.x.x.x.x.', gain: 0.13, min: 0.20 },
                  hat:  { pat: '..x...x...x...x.', gain: 0.03, min: 0.30 }, comp: { pat: 'x..x..x.x..x..x.', gain: 0.06, min: 0.45 },
                  mel:  { pat: '0.2.3.2.0.2.3.5.', gain: 0.06, min: 0.60 }, arp: { pat: 'xxxxxxxxxxxxxxxx', gain: 0.035, min: 0.80 } } },
      run: { bpm: 118, swing: 0.05, gain: 1.0, hum: 0.4,
        chords: [ { bass: 'C2', notes: ['E3','G3','B3','D4'] }, { bass: 'G2', notes: ['B3','D4','F#4','A4'] }, { bass: 'A2', notes: ['C4','E4','G4','B4'] }, { bass: 'F2', notes: ['A3','C4','E4','G4'] } ],
        layers: { pad:  { pat: 'X...............', gain: 0.045 }, comp: { pat: 'x..x..x.x..x..x.', gain: 0.06 }, bass: { pat: 'x..x..x.x..x..x.', gain: 0.15 },
                  kick: { pat: 'x...x...x...x...', gain: 0.13 }, hat: { pat: '..x...x...x...x.', gain: 0.025 }, tick: { pat: 'x...x...x...x...', gain: 0.5 },
                  mel:  { pat: '2...3...4...3.2.', gain: 0.06 }, arp: { pat: 'x.x.x.x.x.x.x.x.', gain: 0.025 } } },
      result: { bpm: 100, swing: 0.1, gain: 0.7, hum: 0.0,
        chords: [ { bass: 'C2', notes: ['E3','G3','B3','D4'] }, { bass: 'A2', notes: ['C4','E4','G4','B4'] } ],
        layers: { pad: { pat: 'X...............', gain: 0.05 }, comp: { pat: 'x.......x.......', gain: 0.05 }, mel: { pat: '....2.......3...', gain: 0.05 } } },
      final: { bpm: 84, swing: 0.1, gain: 1.0, hum: 0.0,
        chords: [ { bass: 'F2', notes: ['A3','C4','E4','G4'] }, { bass: 'G2', notes: ['B3','D4','E4','A4'] }, { bass: 'E2', notes: ['G3','B3','D4','F#4'] }, { bass: 'A2', notes: ['C4','E4','G4','B4'] } ],
        layers: { pad: { pat: 'X...............', gain: 0.055 }, comp: { pat: 'x..x..x...x..x..', gain: 0.06 }, bass: { pat: 'x.....x.x.......', gain: 0.15 },
                  kick: { pat: 'x.......x.......', gain: 0.15 }, mel: { pat: '2...3...4.3.2...', gain: 0.065 } } },
    },
  },

  /* ---------------------------------------------------------------- 9. カメラ（車両中心からの相対位置[m]） */
  camera: {
    run:    { pos: [-84, 12, 22], look: [20, 6, 0], fov: 55, fovAtSpeed: 22 },
    station:{ pos: [-4, 10, 44], look: [0, 4, -2], fov: 50 },
    charge: { pos: [-46, 4.6, 3], look: [70, 4, 0], fov: 62 },
    title:  { radius: 96, height: 26, fov: 52 },
  },

  /* ---------------------------------------------------------------- 10. 文言 */
  storageKey: 'kokura-monorail-dash.best.v3',
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
