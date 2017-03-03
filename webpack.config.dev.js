/**
 * Created by sirpale on 17/3/3.
 */

let webpack  = require('webpack'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    HtmlWebpackPlugin = require('html-webpack-plugin');


let path = require('path'),
    ROOT_PATH = __dirname,
    DIST_PATH = path.resolve(ROOT_PATH,'dist'),
    SRC_PATH = path.resolve(ROOT_PATH,'src'),
    PUBLIC_PATH = path.resolve(SRC_PATH,'public'),
    VIEWS_PATH = path.resolve(SRC_PATH,'views');


let config = {
    /*
     * eval  每个模块转化为字符串，在尾部添加//# souceURL后，被eval包裹起来
     * source-map 最原始的实现方式，打包代码并生成一个sourcemap文件
     * hidden-source-map 打包结果source-map一致，但是.map文件结尾不显示//# sourceMappingURL
     * inline-source-map 为打包的每个文件添加sourcemap的dataUrl，追加到结尾；此处dataUrl包含一个文件完整souremap信息的Base64格式化后的字符串
     * eval-source-map 将每个模块转化为字符串，使用eval包裹，并将打包前每个模块的sourcemap信息转换为Base64编码
     * cheap-source-map 同source-map 但不包含列信息，不包含loader的sourcemap
     * cheap-module-source-map 不包含列信息，同时loader的sourcemap也被简化为只包含对应行的。最终的sourcemap只有一份，它是webpack对loader生成的sourcemap进行简化，然后再次生成的
     * 开发环境推荐 cheap-module-eval-source-map
     * 生产环境推荐 cheap-module-source-map
     *
     * */
    devtool : 'cheap-module-source-map',
    // 页面入口文件配置
    entry : {
        core : PUBLIC_PATH +'/js/common/core.js',
        index : PUBLIC_PATH + '/js/modules/index.js',
        list : PUBLIC_PATH + '/js/modules/list.js'
    },
    // 入口文件输出配置
    output : {
        path : ROOT_PATH,
        publicPath : 'dist',
        filename : 'js/[name].js',
        chunkFilename : 'js/[name].[chunkhash:5].min.js'
    },
    module : {
        // 加载器配置
        loaders : [
            // 样式
            {
                test : /\.(css|scss|less)$/,
                loader : ExtractTextPlugin.extract({filename:'style-loader',use:'css-loader!sass-loader!less-loader'})
            },
            // js
            {
                test : /\.js$/,
                exclude : /^node_modules/,
                loader : 'babel-loader'
            },
            // 字体
            {
                test : /\.(eot|woff|svg|ttf|woff2|gif|appcache)(\?|$)/,
                loader : 'file-loader?name=fonts/[name],[ext]'
            },
            // 图片
            {
                test : /\.(png|jpg)$/,
                loader : 'url-loader?limit=81925&name=/dist/images/[name],[ext]'
            }

        ]
    },
    plugins : [
        new ExtractTextPlugin('css/[name].css'),
        new webpack.ProvidePlugin({
            $ : 'jquery',
            jQuery : 'jquery',
            'window.jQuery' : 'jquery'
        }),
        // 独立出js
        new webpack.optimize.CommonsChunkPlugin({name:'core',filename : 'js/core.js'}),
        // 热模块开启
        new webpack.HotModuleReplacementPlugin()
    ],
    resolve : {
        extensions : ['.js','.jsx','.less','.scss','.css']
    },
    devServer : {
        // contentBase : './src/views/',
        host : '0.0.0.0',
        port : 3000,
        inline : true,
        hot : true,
        historyApiFallback : true
    }
};


// 解析html模板
for(let chunkName in config.entry) {
    if(chunkName !== 'core') {
        let conf = {
            title : chunkName,
            filename : DIST_PATH + '/views/' + chunkName+'.html',
            template : VIEWS_PATH + '/' +chunkName + '.tpl.html',
            inject : true,
            minify : {
                removeComments : true,
                collapseWhitespace : false
            },
            chunks : [chunkName,'core'],
            hash : true
        };

        config.plugins.push(new HtmlWebpackPlugin(conf));
    }
}


module.exports = config;