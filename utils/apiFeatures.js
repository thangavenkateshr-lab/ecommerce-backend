class APIFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }
    search() {
        let keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: 'i'
            }
        } : {}
        this.query.find({ ...keyword })
        return this
    }

filter() {
    const queryStrCopy = {...this.queryStr};
    const removeField = ['keyword','limit','page'];
    removeField.forEach(field => delete queryStrCopy[field]);
    let queryStr = JSON.stringify(queryStrCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);
    console.log(queryStr);
    this.query.find(JSON.parse(queryStr));
    return this; 
}
}

module.exports = APIFeatures;