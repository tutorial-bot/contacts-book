function InvalidPathFixPlugin({ invalidPath }) {
    this.invalidPath = invalidPath;
}

InvalidPathFixPlugin.prototype.apply = function (compiler) {
	compiler.hooks.compilation.tap(InvalidPathFixPlugin.name, this.applyFix.bind(this));
};

InvalidPathFixPlugin.prototype.applyFix = function (compilation) {
	compilation.hooks.htmlWebpackPluginAlterAssetTags.tap(InvalidPathFixPlugin.name, this.onAlterAssetTags.bind(this));
};

InvalidPathFixPlugin.prototype.onAlterAssetTags = function (htmlPluginData, callback) {
	htmlPluginData.body.forEach(script => {
		const attrs = script && script.attributes || {};
		if (attrs.src) {
			attrs.src = attrs.src.replace(this.invalidPath, '/');
		}
	});
};

module.exports = InvalidPathFixPlugin
