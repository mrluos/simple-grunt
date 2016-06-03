module.exports = function(grunt) {
	var map = grunt.option('cmd') || '';
	var target = grunt.option('page') || '';
	var opt = {
		pkg: grunt.file.readJSON('package.json'),
	}
	var mapPath = "map/";
	//看是否已经生成了map
	var conf = {};
	/**
	 * 设置项目需要压缩合并的js和css文件
	 * key :value 方式
	 */
	var pageList = grunt.file.readJSON('pagelist.json'),
		//支持的行为
		operatorAry = {
			'default': ['clean', 'uglify', 'sass', 'cssmin', 'autoprefixer', 'watch'],
			//js操作
			'js': ['clean', 'uglify', 'watch:js'],
			//css操作
			'css': ['clean', 'sass', 'cssmin', 'autoprefixer', 'watch:css'],
		},
		supportSonaTask = [],
		//所有pagelist的值
		keyList = [],
		outPath = 'out/';
	for (var item in operatorAry) {
		supportSonaTask.push(item);
	}
	supportSonaTask = supportSonaTask.join(",")
	for (var item in pageList) {
		keyList.push(item);
	};

	var targetAry = [],
		sonTask = '';
	if (target.indexOf(":") !== -1) {
		var targetAry = target.split(':');
		target = targetAry[0];
		sonTask = targetAry[1];
	}
	var mapAry = [],
		mapSonParam = '';
	if (map.indexOf(":") !== -1) {
		var mapAry = map.split(':');
		map = mapAry[0];
		mapSonParam = mapAry[1];
	}

	/*
	 *删除map缓存
	 */
	if (map == 'cls') {
		// grunt.file.delete(mapPath);
		var flag = true;
		var mapList = [];
		grunt.file.recurse(mapPath, function callback(abspath, rootdir, subdir, filename) {
			mapList.push(filename);

			if (filename == (mapSonParam.indexOf(".json") === -1 ? (mapSonParam + ".json") : mapSonParam)) {
				flag = false;
				grunt.file.delete(abspath);
				grunt.log.warn('remove "' + abspath + '"" map file...');
			}
		})
		if (mapSonParam == '') {
			console.log('all map files:', mapList);
			grunt.fatal('please input map filename,above....');
		}
		if (flag) {
			grunt.fatal('map file "' + mapSonParam + '" not found ...');
		}
		//grunt.log.warn('remove map caching complate...');

	}
	/*
	 *获取操作的页面
	 */
	if (target == '') {
		grunt.fatal('please use -page=pagename:task ,select page and run task...');
	}

	if (!pageList[target]) {
		grunt.log.writeln('page list :', keyList);
		grunt.fatal('--page set error,page: \'' + target + '\' not found ...');
	}
	var curSetting = pageList[target];
	grunt.log.writeln('use page[' + target + "],tasks[" + sonTask + "]:");
	//console.log('use page[' + target + "],tasks[" + sonTask + "]:");
	var taskAry = [];
	if (sonTask == '') {
		/**
		 * 执行所有的操作
		 */
		taskAry = operatorAry['default'];
	} else {
		/**
		 * 执行指定的多个操作
		 */
		if (sonTask.indexOf(",") !== -1) {
			grunt.fatal('muti operator no support...');
			var sonTaskList = sonTask.split(',');
			for (var _k in sonTaskList) {
				taskAry.push(target + ":" + _k);
			}
		} else {
			/**
			 * 执行特定的一个操作
			 */
			if (supportSonaTask.indexOf(sonTask) === -1) {
				grunt.fatal('only support js or css operator...');
			} else {
				var _operatorAry = operatorAry[sonTask];
				taskAry = _operatorAry;
			}

		}

	}
	if (taskAry.length == 0) {
		grunt.log.writeln('can use task:', allowTask);
		grunt.fatal('no task can run,please see list above...');
	}
	/**
	 * 获取当前选择的页面的css.js数据
	 * @param  {[object]} _obj     [当前选择的page对象]
	 * @return {[object]}          [生成的配置]
	 */
	function getPageData(_obj, _opt) {
		var jsObj = _obj['js'],
			cssObj = _obj['css'],
			sassObj = _obj['sass'],
			uglify = {},
			watch = {},
			clean = {},
			sass = {},
			cssmin = {},
			autoprefixer = {};
		//js 处理
		if (jsObj) {
			//添加uglify的files任务
			var jsWatchFiles = [];
			uglify["dist"] = {};
			uglify["dist"]["files"] = jsObj;
			for (var item in jsObj) {
				jsWatchFiles = jsWatchFiles.concat(jsObj[item]);
			}
			/**
			 * 添加watch
			 */
			watch['js'] = {
				files: jsWatchFiles,
				tasks: ['uglify'],
				options: {
					spawn: false
				}
			}
			_opt['uglify'] = uglify;
		}
		//sass 处理·
		var cssWatch = {},
			sassWatch = [],
			concatcss = {};
		if (sassObj) {
			sass['dist'] = {
				options: { // Target options
					style: 'compressed',
					sourcemap: "none"
				},
				files: sassObj
			};
			for (var item in sassObj) {
				sassWatch.push(sassObj[item]);
			}
			_opt['sass'] = sass;
		}
		if (cssObj) {
			cssmin['dist'] = {};
			cssmin['dist']["files"] = cssObj;
			var i = 0,
				cssSrcAry = [];
			for (var item in cssObj) {
				autoprefixer["fiels" + i] = {
					"src": item
				}
				console.log(cssObj[item]);
				cssSrcAry = cssSrcAry.concat(cssObj[item]);
				i++;
			}
			/**
			 * 添加watch
			 */
			watch['css'] = watch['css'] || {};
			watch['css'] = {
				files: cssSrcAry.concat(sassWatch),
				tasks: ['sass', 'cssmin', 'autoprefixer'],
				options: {
					spawn: false
				}
			};
			_opt['autoprefixer'] = autoprefixer;
			_opt['cssmin'] = cssmin;
		}
		_opt['watch'] = watch;
		_opt['clean'] = {
			all: {
				'src': outPath
			}
		};
		return _opt;
	}

	function saveMap(_path, _filename, _jsonContent) {
		grunt.file.write(_path + _filename + ".json", JSON.stringify(_jsonContent))
	}

	function hasMap(_path, _filename) {
		try {
			grunt.file.read(_path + _filename)
			return true;
		} catch (e) {
			return false;
		}

	}
	if (map == 'add+' || !hasMap(mapPath, target + ".json")) {
		console.log('crate ' + target + ' config ..');
		conf = getPageData(curSetting, opt);
		if (map == 'add' || map == 'add+') {
			saveMap(mapPath, target, conf)
		}
	} else {

		console.log('read ' + target + '  config Caching..');
		conf = grunt.file.readJSON(mapPath + target + ".json");
	}
	grunt.initConfig(conf);
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.registerTask('default', taskAry);
};