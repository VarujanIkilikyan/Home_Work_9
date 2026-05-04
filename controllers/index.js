export default {
    async getHomePage(req, res, next) {
        try {
            res.render('index', { title: 'Express' });
        } catch (e) {
            next(e);
        }
    }}