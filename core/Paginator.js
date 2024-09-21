// Class for implementing pagination of application entities
class Paginator {
    // Receiving the database object in the controller
    constructor(db) {
        this.db = db;
    }

    // Method that receives a database query and parameters for forming the range of results
    getPaginatedResults(query, params = [], limit, offset) {
        let paginatedQuery = query;

        if (limit !== undefined && offset !== undefined) {
            paginatedQuery = `${query} LIMIT ? OFFSET ?`;
        }

        return new Promise((resolve, reject) => {
            this.db.all(
                paginatedQuery,
                // ...params spreads the params array and adds limit and offset parameters
                [...params, limit, offset],
                (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                }
            );
        });
    }

    // Method for counting the number of entities to paginate
    countResults(query, params = []) {
        const countQuery = `SELECT COUNT(*) AS count FROM ${query}`;
        return new Promise((resolve, reject) => {
            this.db.get(countQuery, params, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result.count);
                }
            });
        });
    }
}

// Export the class
module.exports = Paginator;
