# simple-grunt
一个简单的gruntfile.js例子，用于压缩合并css,js。

#安装文件
<code>
  npm install 
</code>

#添加文件
1.打开pagelsit.json,添加你的页面需要使用的信息格式如下：
<code>
"pagename": {
    "js": {
      "src": [
        "1.js",
        "2.js",
        "3.js",
        "4.js"
      ],
      "dest": [
        [
          "1,2",//1.2对应的是上面的src里面的文件名字
          "dest/1.core.min.js"//压缩合并后输出文件的路径
        ],
        [
          "3,4",
          "dest/2.core.min.js"
        ]
      ]
    },
    "css": {
      "src": [
        "1.css",
        "2.css",
        "3.css",
        "4.css"
      ],
      "dest": [
        [
          "1,2",//同js节点一样
          "dest/1.core.min.css"//同js节点一样
        ],
        [
          "3,4",
          "dest/2.core.min.css"
        ]
      ]
    },
    "sass": {
      "src": [
        "12.sass",
        "22.sass",
        "test2.sass"
      ]
    }
  }
</code>
