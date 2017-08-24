module.exports = {
    create: ( req, res, next ) => {
        const dbInstance = req.app.get('db')
        const { name, description, price, imageurl } = req.body

        dbInstance.create( [name, description, price, imageurl] )
            .then( () =>res.status(200).send() )
            .catch( () => res.status(500).send() )
    },

    getOne: ( req, res, next ) => {
        const dbInstance = req.app.get('db')
        const { params } = req

        dbInstance.readProd( [params.id] )
            .then( product => res.status(200).send( product ) )
            .catch( () => res.status(500) )
    },

    getAll: ( req, res, next ) => {
        const dbInstance = req.app.get('db')

        dbInstance.readAll()
            .then( all => res.status(200).send( all ) )
            .catch( () => res.status(500) )
    },

    update: ( req, res, next ) => {
        const dbInstance = req.app.get('db')
        const { params, query } = req

        dbInstance.update( [params.id, query.desc] )
            .then( () => res.status(200) )
            .catch( () => res.status(500) )
    },

    delete: ( req, res, next ) => {
        const dbInstance = req.app.get('db')
        const { params } = req

        dbInstance.delete( [params.id] )
            .then( () => res.status(200) )
            .catch( () => res.status(500) )
    }
}