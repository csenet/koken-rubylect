# Ruby講習 第0回 環境構築

Ruby講習担当の21ぼいどです。Rubyを動かすための環境構築の方法を紹介します。  
環境構築が難しい場合はサポートしますので、講習が開始される18:00より前にA-403又は部室へお越しください。

# Ruby講習の受講に必要なもの

1. PC(OSは任意)
2. Rubyの実行環境
3. テキストエディタ

## 1. PC

OSはなんでも構いません。おそらくWindowsかMacOSの方が大半かと思いますが、ArchLinuxやUbuntuなどのOSでも可能です。   
PCのスペックに関してもそこまでスペックにを使うわけではないので大丈夫かと思います。ただ、Zoomと同時に起動すると一部動作が重くなる可能性がありますので、その場合は別端末でZoomを開くなど適宜対応をお願いします。

## 2. Rubyの実行環境

以下のいずれかの方法で準備してください。

### A. ローカルにRubyを導入

簡単なCUI操作が可能な人がおすすめです。様々なライブラリを仕様したい場合はおすすめです。

[Ruby公式サイト](https://www.ruby-lang.org/ja/documentation/installation/#apt-wsl) を参考にして導入をしてください。

#### Windowsの場合
[このサイト](https://joho.g-edu.uec.ac.jp/joho/ruby_win/)
を参考にして環境構築してください。

#### MacやLinuxの場合

Macには標準でRubyがインストールされているので、そのまま使用することも可能です。  
Linuxの場合は、`$ apt-get install ruby`というコマンドを実行してRubyをインストールしてください。

----

環境構築ができているかは以下のコマンドを実行して確認してください。
コマンドはWindowsならPowerShell、Macならターミナル、Linuxなら端末といったようソフトウェアを起動して入力します。
```bash
$ ruby -v
ruby 3.0.2p107 (2021-07-07 revision 0db68f0233) [arm64-darwin20]
```
ここで表示されるRubyのVersionは様々なバージョンがあるかと思いますが、`2.x`又は`3.x`であれば問題ありません。

次に、以下のプログラムを`sample.rb`として保存して、

```rb
def triarea(w, h)
  return (w * h )/ 2.0
end
```
次のコマンドを実行します。
```bash
$ irb
irb(main):001:0> load 'sample.rb'
=> true
irb(main):002:0> triarea(3, 4)
=> 6.0
```
として無事に実行されれば問題なく導入されています。

### B. SolへSSHで接続する


### C. Webブラウザ上でRubyを実行する
