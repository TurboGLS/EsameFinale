import { Categoria } from "../categoria/categoria.entity";
import { CategoriaModel } from "../categoria/categoria.model";

export class CategoriaService {
    async allCategorie(): Promise<Categoria[]> {
        const categorie = await CategoriaModel.find().sort({ nomeCategoria: 1 });
        return categorie.map(c => c.toObject());
    }

    async add(categoria: Categoria): Promise<Categoria> {
        const nuova = await CategoriaModel.create(categoria);
        return nuova.toObject();
    }
}

export default new CategoriaService();
