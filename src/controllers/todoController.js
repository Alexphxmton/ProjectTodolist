const repo = require ('../repositories/todoRepository');


async function listar(req, res, next) {
    try{
        const  status = req.query.status || 'all';
        const notes = await repo.cargar(status);
        res.json({ data: notes, error: null});
    } catch(err){
        next(err);
    }
    
}
async function inProgress(req, res, next){
  try{
     const notes = await repo.inProgress();
    res.json({ data: notes, error: null });
  }catch(err){
    next(err);
  }
}
async function completed(req, res, next){
  try{
     const notes = await repo.completed();
    res.json({ data: notes, error: null });
  }catch(err){
    next(err);
  }
}

async function crear(req, res, next){
    try{
        const {title} = req.body;
        if (!title || !title.trim()){
            return res.status(400).json({
                data:null,
                error:{ message: 'Title es obligatorio'
                },
            });
        }
        const nuevo = await repo.create(title.trim());

        res.status(201).json({data: nuevo, error: null});
    } catch(err){
        next(err);
    }
}

async function actualizar(req, res, next) {
  try {
    const id = Number(req.params.id);
    const actualizado = await repo.actualizar(id, req.body);

    if (!actualizado) {
      return res.status(404).json({
        data: null,
        error: { message: 'Todo no encontrado' },
      });
    }

    res.json({ data: actualizado, error: null });
  } catch (err) {
    next(err);
  }
}


async function eliminar(req, res, next) {
  try {
    const id = Number(req.params.id);
    await repo.eliminar(id);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
async function marcarTodos(req, res, next){
  try {
    const {completed} = req.body;
  await repo.markAll(completed ?? true);
  res.json({data: true, error: null});
 } catch (err){
  next(err);
 }
}

async function clearAll(req, res, next){
  try{
    await repo.clearAll();
    res.json({data: true, error: null});
  }catch(err){
    next(err);
  }

}


module.exports = {
    listar,
    crear,
    actualizar,
    eliminar,
    marcarTodos,
    inProgress,
    completed,
    clearAll,

};