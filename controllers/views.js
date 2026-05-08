export default {
    async viewsRender (views){

        return async (req,res,next)=>{
            try {
                res.render(views)

            }catch(e){
                next(e);
            }
        }

    }
}