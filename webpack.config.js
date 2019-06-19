
module.exports = (env) => {
    return require(`./webpack/webpack.${env.NODE_ENV}.config.js`);
};