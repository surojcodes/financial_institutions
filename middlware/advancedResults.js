const advancedResults = (model, populate) => async (req, res, next) => {
    let reqQuery = { ...req.query };
    let query = '';

    // stuff to remove from query
    const toRemove = ['select', 'sort', 'page', 'limit'];

    // lets remove these
    toRemove.forEach(item => delete reqQuery[item]);

    let queryStr = JSON.stringify(reqQuery);

    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    //form first part of query
    query = model.find(JSON.parse(queryStr));

    // chain the methods corresponding to the removed item
    // select
    if (req.query.select) {
        const toSelect = req.query.select.split(',').join(' ');
        query = query.select(toSelect);
    }
    // sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        // default sort by createdAt (latest first)
        query = query.sort('-createdAt');
    }

    // lets do pagination
    const page = parseInt(req.query.page, 10) || 1; //show page 1 by defauls
    const limit = parseInt(req.query.limit, 10) || 5;  //5 results per page by default
    const startIndex = (page - 1) * limit;
    const endIndex = (page * limit) - 1;
    const total = await model.countDocuments();

    //lets add paingation and populate the tile of category
    query = query.skip(startIndex).limit(limit).populate(populate);
    const results = await query;

    // pagination result to return 
    const pagination = {};
    if (endIndex < total - 1) {
        pagination.next = {
            page: page + 1, limit
        }
    } //else no need to show next page
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1, limit
        }
    }//else no need to show previous page

    res.advancedResults = {
        success: true,
        count: results.length,
        pagination,
        data: results
    }
    next();
}
module.exports = advancedResults;