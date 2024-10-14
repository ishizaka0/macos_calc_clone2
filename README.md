# macos_calc_clone2
- CLINEでAIにお願いして作ったもの
- 今回は独自のワークフローを用いている：未ドキュメント化

# v0の時と同じステップで
- next.jsで電卓を作りたいです。
- 配色は、macosの添付画像の色と、キーボード配列にしてください。ss.png

## 使用フレームワーク
- Next.js（Vercelにデプロイ前提）
- Material-UI (MUI)
- Tailwind CSS
- そのほか必要と思われるライブラリ

# AI操作LOG
- 人間：next.jsで電卓を作りたいです。カレントディレクトリはすでにルートです
- AI：Next.jsプロジェクトの初期化が完了しました。次に、Material-UI (MUI)をインストールし、電卓のUIを作成する準備をします。まず、MUIのインストールを行います。

- 人間：終わったよ
- AI：MUIのインストールが完了しました。これで、src/app/page.tsxのエラーが解消されるはずです。次に、アプリケーションをローカルで実行して、電卓のUIが正しく表示されるか確認します。npm run dev

- 人間：エラーです。※エラーをコピペ
- AI：Next.jsアプリケーションに電卓のUIを追加しました。npm run devが実行中であれば、ブラウザでhttp://localhost:3000にアクセスして、電卓が正しく表示されているか確認してください。電卓のUIは、MUIとTailwind CSSを使用してスタイリングされています。何か問題があればお知らせください。

- 人間：配列とカラーリングは、ss.png　と同じにしてください。また、それ以外の余分は文字などは不要です。画面の中央に寄せてください。
- AI：以下続く・・・

# 電卓アプリ - 仕様書

- この各種仕様書は、ソースコードから元にしてo1の生成AIが作成したものです。

## 目次

1. [要求仕様書](#要求仕様書)
2. [設計仕様書](#設計仕様書)
3. [詳細設計書](#詳細設計書)
4. [画面UI設計書](#画面ui設計書)
5. [テスト仕様書](#テスト仕様書)
6. [操作説明書](#操作説明書)

---

## 要求仕様書

### 1. 概要

電卓アプリは、シンプルで使いやすい電卓アプリケーションです。ユーザーが基本的な算術計算やパーセント計算を直感的に行えることを目的としています。特に、価格からの割引計算（例：10,000円から25%引き）を正確に行い、履歴に正しい計算式と結果を表示することを重視しています。

### 2. 目的

- 基本的な四則演算（加算、減算、乗算、除算）が可能であること。
- パーセント計算に対応し、割引や税計算が容易に行えること。
- 操作履歴を表示し、過去の計算を確認できること。
- 直感的で使いやすいユーザーインターフェースを提供すること。

### 3. 対象ユーザー

- 日常的に計算を行う一般ユーザー。
- ショッピング時に割引計算を行いたいユーザー。
- シンプルで見やすい電卓アプリを求めるユーザー。

### 4. 機能要件

- **数字入力**：0〜9、および小数点の入力が可能。
- **演算子**：加算（+）、減算（-）、乗算（×）、除算（÷）の利用が可能。
- **パーセント計算**：数値に対するパーセント計算が可能（例：10,000 - 25% = 7,500）。
- **特殊キー**：
  - **AC（オールクリア）**：現在の入力と計算をリセット。
  - **±（符号反転）**：現在の数値の符号を反転。
  - **000キー**：一度に「000」を入力。
- **履歴表示**：過去の計算式と結果を一覧表示。
- **ウィンドウコントロール**：アプリケーションの閉じる、再読み込み、フルスクリーン切り替え。

### 5. 非機能要件

- **ユーザビリティ**：直感的で使いやすい操作性。
- **パフォーマンス**：遅延なく即座に計算結果を表示。
- **可読性**：数字の桁区切り（カンマ区切り）で読みやすさを向上。
- **互換性**：主要なウェブブラウザで動作。

---

## 設計仕様書

### 1. システムアーキテクチャ

- **フロントエンド**：React.js（Next.js）を使用したシングルページアプリケーション。
- **スタイリング**：Material-UI（@mui）およびstyled-componentsを使用。
- **言語**：TypeScriptを使用して型安全性を確保。

### 2. コンポーネント設計

- **CalculatorContainer**：電卓全体を囲むコンテナ。
- **Calculator**：電卓本体のコンポーネント。
- **Display**：現在の入力や計算結果を表示。
- **History**：過去の計算履歴を表示。
- **ButtonStyled**：電卓の各種ボタン。
- **WindowControls**：ウィンドウの閉じる、再読み込み、フルスクリーンボタン。

### 3. 状態管理

- **displayValue（string）**：現在の入力または結果を保持。
- **currentExpression（string）**：現在の計算式を保持。
- **history（string[]）**：過去の計算履歴を配列で保持。

### 4. 主要な関数

- **handleButtonClick(label: string)**：ボタンがクリックされたときの処理を管理。
- **evaluateExpression(expr: string): number**：計算式を評価して結果を返す。
- **formatNumber(num: string): string**：数字をカンマ区切りでフォーマット。

### 5. パーセント計算のロジック

- パーセント記号（%）は直前の数値に対して適用される。
- 例：`10000 - 25%` は `10000 - (10000 * 0.25)` と解釈し、結果は `7500`。

---

## 詳細設計書

### 1. フロントエンド

#### 1.1 ページ構成

- **page.tsx**：アプリケーションのメインページ。

#### 1.2 スタイリング

- **Material-UI**：ボタンやグリッドレイアウトに使用。
- **styled-components**：カスタムスタイルを適用。

#### 1.3 コンポーネント詳細

- **CalculatorContainer**
  - 背景色：黒（#000）
  - 配置：中央揃え（Flexbox）
- **Calculator**
  - 背景色：ダークグレー（#333）
  - サイズ：幅240px
  - 角丸：10px
- **Display**
  - 背景色：やや明るいグレー（#444）
  - フォントサイズ：1.8rem
  - テキスト配置：右揃え
- **History**
  - 背景色：さらに暗いグレー（#222）
  - フォントサイズ：0.9rem
  - スクロール可能（最大高さ150px）

#### 1.4 関数詳細

- **formatNumber**
  - 入力：数値の文字列。
  - 処理：整数部をカンマ区切りにする。小数点以下はそのまま。
  - 出力：フォーマット済みの文字列。

- **evaluateExpression**
  - 入力：計算式の文字列。
  - 処理：
    - カンマを除去。
    - `×`、`÷`を `*`、`/` に置換。
    - パーセント計算を適用。
    - `eval` 関数で計算式を評価。
  - 出力：計算結果の数値。

- **handleButtonClick**
  - 入力：ボタンのラベル（文字列）。
  - 処理：ラベルに応じて `displayValue`、`currentExpression`、`history` を更新。
  - 特殊処理：
    - `AC`：全てリセット。
    - `±`：符号を反転。
    - `%`：パーセント記号を追加し、パーセント計算を可能に。
    - `=`：計算式を評価し、結果を表示および履歴に追加。

### 2. ロジックフロー

1. **数字キー入力時**
   - `displayValue` に数字を追加。
   - `displayValue` が `'0'` の場合は入力値に置き換え。

2. **演算子キー入力時**
   - `currentExpression` に `displayValue` と演算子を追加。
   - `displayValue` をリセット。

3. **`%` キー入力時**
   - `displayValue` に `%` を追加。
   - パーセント計算が必要な場合に備える。

4. **`=` キー入力時**
   - `currentExpression` に `displayValue` を追加。
   - `evaluateExpression` 関数で計算式を評価。
   - 結果を `displayValue` に表示し、`history` に追加。
   - `currentExpression` をリセット。

---

## 画面UI設計書

### 1. 全体レイアウト

- **画面サイズ**：縦長（モバイルデバイスを想定）。
- **電卓位置**：画面中央に配置。

### 2. コンポーネント配置

1. **ウィンドウコントロール**（上部）
   - 左から順に：
     - **閉じるボタン**（赤）
     - **再読み込みボタン**（黄）
     - **フルスクリーンボタン**（緑）
2. **表示部**
   - **Display**：現在の入力や結果を表示。
   - **History**：過去の計算履歴を表示。
3. **ボタン配置**（下部）
   - **上段**：`AC`、`±`、`%`、`÷`
   - **中段1**：`7`、`8`、`9`、`×`
   - **中段2**：`4`、`5`、`6`、`-`
   - **中段3**：`1`、`2`、`3`、`+`
   - **下段**：`0`（幅2倍）、`000`、`.`、`=`

### 3. デザイン要素

- **色合い**
  - **背景**：黒（#000）
  - **電卓本体**：ダークグレー（#333）
  - **ボタン**
    - **数字ボタン**：ライトグレー（#888）
    - **演算子ボタン**：オレンジ（#f90）
    - **特殊ボタン（AC、±、%）**：ダークグレー（#555）
- **フォント**
  - **表示部フォントサイズ**：1.8rem（大きく見やすい）
  - **ボタンフォントサイズ**：1.1rem

---

## テスト仕様書

### 1. テスト環境

- **ブラウザ**：最新のChrome、Firefox、Safari、Edge
- **OS**：Windows、macOS、Linux

### 2. テスト項目

#### 2.1 基本動作テスト

1. **数字入力テスト**
   - 各数字キーを押下し、`displayValue` に正しく表示されるか確認。
2. **演算子入力テスト**
   - `+`, `-`, `×`, `÷` を押下し、`currentExpression` が正しく更新されるか確認。
3. **計算テスト**
   - 例：`5` `+` `3` `=` → 結果が `8`、履歴に `5+3 = 8` が表示されるか確認。
4. **小数点入力テスト**
   - 小数点を含む数値の計算が正しく行われるか確認。

#### 2.2 パーセント計算テスト

1. **減算でのパーセント計算**
   - 例：`10,000` `-` `25` `%` `=` → 結果が `7,500`、履歴に `10,000-25% = 7,500` が表示されるか確認。
2. **加算でのパーセント計算**
   - 例：`8,000` `+` `10` `%` `=` → 結果が `8,800`、履歴に `8,000+10% = 8,800` が表示されるか確認。
3. **乗算・除算でのパーセント計算**
   - 例：`200` `×` `50` `%` `=` → 結果が `100`、履歴に `200×50% = 100` が表示されるか確認。

#### 2.3 特殊キー動作テスト

1. **ACキー**
   - 途中で `AC` を押下し、`displayValue` と `currentExpression` がリセットされるか確認。
2. **±キー**
   - 現在の数値の符号が反転するか確認。
3. **000キー**
   - 一度に `000` が入力されるか確認。

#### 2.4 エラーハンドリングテスト

1. **ゼロ除算**
   - 例：`5` `÷` `0` `=` → エラーが表示されるか確認。
2. **不正な入力**
   - 不正な計算式を入力した場合にエラーが表示されるか確認。

### 3. テスト結果

- 各テスト項目ごとに、期待される結果と実際の結果を記録し、不具合があれば修正。

---

## 操作説明書

### 1. アプリの起動

- ウェブブラウザでアプリケーションを開く。

### 2. 基本的な使い方

#### 2.1 数字の入力

- 電卓の数字ボタン（`0`〜`9`、`000`）をクリックして数値を入力します。

#### 2.2 演算の実行

1. **加算（+）**
   - 数字を入力 → `+` ボタンをクリック → 次の数字を入力 → `=` ボタンをクリック。
2. **減算（-）**
   - 数字を入力 → `-` ボタンをクリック → 次の数字を入力 → `=` ボタンをクリック。
3. **乗算（×）**
   - 数字を入力 → `×` ボタンをクリック → 次の数字を入力 → `=` ボタンをクリック。
4. **除算（÷）**
   - 数字を入力 → `÷` ボタンをクリック → 次の数字を入力 → `=` ボタンをクリック。

#### 2.3 パーセント計算

- 数字を入力 → 演算子をクリック（例：`-`） → 次の数字を入力 → `%` ボタンをクリック → `=` ボタンをクリック。
- 例：`10,000` `-` `25` `%` `=` → 結果は `7,500`。

#### 2.4 特殊キーの使い方

- **AC（オールクリア）**：計算を初期化します。
- **±（符号反転）**：現在入力中の数値の符号を反転します。
- **000キー**：一度に `000` を入力できます。

#### 2.5 履歴の確認

- 計算結果は履歴に表示されます。過去の計算を確認できます。

### 3. ウィンドウコントロール

- **閉じるボタン（赤）**：アプリケーションを閉じます。
- **再読み込みボタン（黄）**：アプリケーションを再読み込みします。
- **フルスクリーンボタン（緑）**：アプリケーションをフルスクリーン表示に切り替えます。

### 4. 注意事項

- **ゼロ除算**：ゼロでの除算はエラーとなります。
- **演算順序**：本アプリでは入力順に計算が行われます。複雑な数式や括弧を用いた計算には対応していません。
- **セキュリティ**：計算式の評価には `eval` 関数を使用しています。安全な入力を心がけてください。

---

以上が電卓アプリの仕様書となります。この仕様書に基づいて、同様の電卓アプリケーションを構築することが可能です。追加の要件がある場合は、適宜仕様書を更新してください。

