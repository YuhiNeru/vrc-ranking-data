# VRChat Ranking Data

[World Watch](https://vrc-ranking-board.vrc-ranking-board.workers.dev/) の公開ランキングデータです。アプリ本体の関連リポジトリとして、データを別管理しています。

- アプリ・収集コード：[vrc-ranking-board](https://github.com/yuhi-neru/vrc-ranking-board)
- 最新JSON：[latest.json](https://raw.githubusercontent.com/yuhi-neru/vrc-ranking-data/main/latest.json)
- 最新CSV：[latest.csv](https://raw.githubusercontent.com/yuhi-neru/vrc-ranking-data/main/latest.csv)
- 公開API：[api/latest](https://vrc-ranking-board.vrc-ranking-board.workers.dev/api/latest)

## 更新方法

VPSで毎時収集・集計 → Cloudflareの公開APIへ送信 → GitHub Actionsが毎時57分に最新データを保存します。追加のVPS認証やGitHub用の個人tokenは不要です。Actionsの実行は混雑によって遅れることがあり、厳密な時刻は保証しません。

新しい観測時刻がある場合だけ更新します。取得失敗時は最後の成功データを維持します。最新かどうかはJSONの `observedAt` を確認してください。Actions画面の「Run workflow」で手動同期もできます。

`latest.json` は掲載対象全件の人数・対応端末・観測時刻と直近48時間の観測履歴を含みます。`latest.csv` は全件を総同接順に並べ、総同接順位と公開側人数順位を付けています。アプリはそれぞれの上位100件を表示します。CSVはUTF-8 BOM付きです。表計算ソフトの数式として解釈される名前・作者欄は先頭にアポストロフィを付けています。正確な文字列はJSONを利用してください。

## データの意味

公式アクティブ一覧の最大500候補から、名前・説明・タグに日本語または日本向けの明示がある候補を中心に抽出しています。日本語ワールド全体の網羅順位や日本人の人数ではありません。

`total` はワールド全体の同接、`public` と `private` はVRChat APIの公開側・非公開側集計です。公開側人数は参加可能な人数を保証しません。各ワールドの `observedAt` は実際の取得時刻で、同時刻に全件を取得した値ではありません。欠測は0人に置き換えません。

履歴の各点は `[Unix時刻秒, 総同接, 公開側人数, 非公開側人数]` です。JSONの時刻はUTCで、アプリ表示は日本時間です。増減が `null` の場合、前の時間帯に比較できる観測がありません。

## 公開範囲・利用

公開するのはワールドの公開メタデータと集計人数です。ユーザー一覧・インスタンス一覧・認証Cookie・秘密鍵・取得元DBは含みません。画像本体は保存せず、公式URLのみを参照します。

VRChat非公式の観測データです。VRChatや各ワールドの画像・名称等の権利を譲渡するものではありません。[VRChat利用規約](https://hello.vrchat.com/legal)と権利者の条件に従って利用してください。データの正確性・継続性や第三者の権利について保証しません。

## 費用

公開リポジトリの標準Ubuntu runnerを使い、追加の有料サービス、Actions成果物保存やキャッシュは使用しません。既存VPSの契約費用は別です。
