export default {
    async getHomePage(req, res, next) {
        try {
            res.render('home', { title: 'Express' });
        } catch (e) {
            next(e);
        }
    }}