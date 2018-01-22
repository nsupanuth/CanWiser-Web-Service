const databaseOptions = {
    operatorsAliases : false,
    pool : {
        max : 5,
        min : 0,
        acquire : 30000,
        idle : 10000
    }
}

const rawQueryOptions = {
    type : 'SELECT'
}

module.exports = {
    databaseOptions,
    rawQueryOptions
}