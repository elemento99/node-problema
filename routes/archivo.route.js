import path from 'path'
import { Router } from "express"
import { writeFile } from 'fs/promises';
import { readFile } from 'fs/promises';
import slugify from 'slugify';

const router = Router()

const __dirname = import.meta.dirname;

//PATH / archivos 

router.get('/', (req, res) => {

    //query params query string
    const { sucess, error } = req.query
    console.log({sucess, error})

    return res.render('archivos', {sucess, error})
})

//crear los archivos
router.post('/crear', async(req, res) => {

    try{
        //req.body
        const {archivo, contenido} = req.body

        //validación
    if(!archivo || !contenido || !archivo.trim() || !contenido.trim()){
        console.log("todos los campos obligatorios")
        return res.status(400).redirect('/archivos?error=todos los campos son obligatorios')
    }
    const slug = slugify(archivo, {
        trim: true,
        lower: true,
        strict: true
    })


    const ruta = path.join(__dirname, `../data/archivos/${archivo}.txt`)
    console.log(ruta)


    //crear un archivo
    await writeFile(ruta, contenido)


    return res.status(201).redirect( '/archivos?sucess=se creo el archivo con éxito')
    } catch (error) {
        console.log(error)
        return res.status(500).redirect('/archivos?error=error al crear el archivo')
    }
})


//leer

router.get('/leer', async(req, res) => {

    try {
        const {archivo} = req.query

        const slug = slugify(archivos, {
            trin: true, 
            lower: true,
            strict: true
        })

        const ruta = path.join(__dirname, `../data/archivos/${slug}.txt`)
        const contenido = await readFile(ruta, 'utf-8')

        return res.redirect('/archivos?sucess=' + contenido)

    }catch (error) {
        console.log(error)
        if(error.code === 'ENOENT'){
            return res.status(404).redirect('/archivos?error= No se encuentra este archivo')
        }
        return res.status(500).redirect('/archivos?error=error al leer archivo')
    }
})

//renombrar
router.post('/renombrar', async(req, res) => {
    try{
        const {archivo, nuevoNombre} = req.body

        const slug = slugify(archivo, {
            trim: true,
            lower: true,
            strict: true
        })
        const nuevoSlug = slugify(nuevoNombre, {
            trim: true,
            lower: true,
            strict: true
        })

        const viejaRuta = path.join(__dirname, `../data/archivos/${slug}.text`)
        const nuevaRuta = path.join(__dirname, `../data/archivos/${nuevoSlug}.txt`)

        await rename(viejaRuta, nuevaRuta)

    }catch(error) {
        console.log(error)
        if (error.code === "ENOENT") {
            return res.status(404).redirect('/archivos?error=No se encuentra este archivo')
        }
    } return res.status(500).redirect('/archivos?error=error al leer el archivo')


})

export default router; 