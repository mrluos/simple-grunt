# simple-grunt
一个简单的gruntfile.js例子，用于压缩合并css,js。

#获取文件
<code>
  //创建一个文件夹 \r
  mkdir grunt-simple
  cd grunt-simple
  //克隆版本
  git clone https://github.com/mrluos/simple-grunt.git
</code>

#安装插件
<code>
  //安装文件
  npm install
</code>

#配置需要操作的页面信息
在根目录下的pagelist.json添加页面的节点，配置需要压缩的文件信息，具体参照pagelist_demo.json.

#执行压缩合并
1.根据pagelist.json文件的配置执行具体的操作
<code>
  //pagename是在pagelist.json配置的一级节点名称。
  grunt  -page=pagename
</code>

2.保留执行时生成的任务配置文件
<code>
  //-cmd=add. 会在根目录下生成一个map文件夹，保存pagename.json文件，可以自由编辑配置pagename.json文件
  //达到自己想要的效果。
  grunt  -page=pagename -cmd=add
  //删除具体的页面生成的配置文件
  grunt  -cmd=cls:pagename
  //覆盖原来生成的配置文件内容
  grunt  -page=pagename -cmd=add+
</code>

3.其他
<code>
  //执行默认的操作['clean', 'uglify', 'sass', 'cssmin', 'autoprefixer', 'watch']
  grunt  -page=pagename 

  //执行css的操作['clean', 'sass', 'cssmin', 'autoprefixer', 'watch:css']
  grunt  -page=pagename:css

  //执行js的操作['clean', 'uglify', 'watch:js']
  grunt  -page=pagename:js

</code>



#文件结构
|-root
|----dest //样例 输出文件存放
|----map
|-----page.json //在使用-cmd=save的时候会生成当前执行的page对应的grunt config 文件，需要扩展修改的时候可以修改这个文件
|----src //样例 源文件存放
|--Gruntfile.js
|--pagelist_demo.json //配置页面信息说明
|--pagelist.json //配置页面信息
|--package.json 
