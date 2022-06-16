class Contenedor {
  constructor(knex, tableName) {
    this.knex = knex;
    this.tableName = tableName;
  }

  save = async (object) => {
    try {

      if( await this.existeTable()){

        const idObject  =  await this.knex(this.tableName).insert(object);
        
        if(idObject){
          object.id = await this.knex(this.tableName).max("id");
          return object.id; 
        }
        
      }else {
        await this.crearTable();
        const idObject  =  await this.knex(this.tableName).insert(object);
        if(idObject){
          object.id = await this.knex(this.tableName).max("id");
          return object.id; 
        }
      }
     
    } catch (error) {
      console.log(`Error al guardar el objeto: ${error}`);
    } 
  };

  getAll = async () => {
    try {
      if( await this.existeTable()){
        const data = await this.knex(this.tableName).select();
        if(data)return data
        else throw new Error("No hay datos");
      }else return [];
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  //Schema methods
  existeTable = async () => {
    try {
      return await this.knex.schema.hasTable(this.tableName);
    } catch (error) {
      console.log("Error al verificar si existe la tabla");
    }
  }

  crearTable = async () => {
    try{
      if(this.tableName == "productos"){
        await this.knex.schema.createTable(this.tableName, table => {
          table.increments();
          table.string('title');
          table.string('price');
          table.string('thumbnail');
        })
      }else if(this.tableName == "mensajes"){
        await this.knex.schema.createTable(this.tableName, table => {
          table.increments();
          table.string('mail');
          table.string('message');
          table.string('date');
        })
      }
    }catch(error){
      console.log("Error al crear la tabla");
    }
  };

}

module.exports = Contenedor;
