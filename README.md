# Table Of Contents
 Table of contents purely by CSS & JavaScript


## 如上，这是一个纯前端的目录生成器

至于为什么要写这种东西，那一定是因为<del>我太闲了</del>当网页内文章内容很长的时候，
大部分浏览者一般都没有耐心全部读完，这时候，一个能够揭示文章层次的目录
就显得非常重要，可以将读者导向他真正感兴趣的内容。

本项目能够简单解析指定区域中标题的层次结构，将其解析为一个可以点击的目录，
固定浮动于页面左下角（可适当调整位置）。在点击目录时，页面会滑动到对应的内容上。

其实已经有很多贼优秀的TOC项目了，但因为我的网站前端花里胡哨，很难完全适应，试了好几个
别人写的，或样式不好看，或适应性差，或同时基于后端（能让浏览器做的事为什么要交给后端去完成？
我不会告诉你其实是因为我不会写PHP又懒得学）因此还是打算自己写一下。
## 使用方法

此项目依赖于JQuery、animate.css(version 4.1.0)和Font Awesome(version 5+)

```html
<!DOCTYPE html>
<html>
<head>
    <script src="/path/to/jquery/jquery-3.1.1.min.js"></script>
    <script src="/path/to/font-awesome/all.min.js"></script>
    <link rel="stylesheet" href="/path/to/animate-css/animate.min.css">
    <script src="toc.js"></script>
    <link rel="stylesheet" href="toc.css">
    <meta charset="utf-8">
    <title></title>
</head>
<body>
    <article id="toc">
        <h1>1级标题</h1>
        <h2>2级标题</h2>
        <h2>2级标题</h2>
        <h1>1级标题</h1>
        <h2>2级标题</h2>
        <h2>2级标题</h2>
        <h3>3级标题</h3>
        <h4>4级标题</h4>
        <h2>2级标题</h2>
        <h1>1级标题</h1>
        <h2>2级标题</h2>
        <h1>1级标题</h1>
        <h3>2级标题</h3>
        <h2>2级标题</h2>
        <h3>3级标题</h3>
        <h4>4级标题</h4>
        <h2>2级标题</h2>
        <h1>1级标题</h1>
        <h2>2级标题</h2>
    </article>
</body>
    <script type="text/javascript">
        $(document).ready(function(){
            let toc = new TableOfContents({
                'selector': '#toc',
                'titles': 'h1,h2,h3',
                'id-prefix': 'toc',
                'toc-title': 'Table Of Contents',
                'left': 20,
                'bottom': 80,
                'number': true
            });
            toc.init();
        });
    </script>
</html>
```

## 说明

|参数|说明|
|:---:|:---:|
|selector|CSS选择器,选中想要解析标题的元素|
|titles|选择需要解析的标题tag,以逗号分割,支持h1~h6|
|id-prefix|此代码会为每一个解析到的标题生成锚点,可能会污染原文档<br>该参数会作为prefix加在锚点的id前面，以避免污染|
|toc-title|没什么用,就是显示在最上面的目录标题|
|left|目录距离网页左侧的距离(px)|
|bottom|目录距离网页底部的距离(px)|
|number|bool值,是否为目录编号|

## 示例

[我的blog](https://www.fyz666.xyz/)