const Firebase = require('firebase');


const getSoftwares = async() => {
    var watchingTheHeroes = await Firebase.database().ref().child("/");
    var snapshot;
    try {
        snapshot = await watchingTheHeroes.once('value')
        var DataWithTockens = await snapshot.val();
        delete DataWithTockens.tokens
        return DataWithTockens;
    } catch (error) {
        console.log(error)
    }

}

const getTokens = async() => {
    var watchingTheHeroes = await Firebase.database().ref().child("/tokens");
    var snapshot;
    try {
        snapshot = await watchingTheHeroes.once('value')
        var tokens = await snapshot.val();
        return tokens;
    } catch (error) {
        console.log(error)
    }

}
export {
    getSoftwares,
    getTokens
}