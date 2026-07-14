import { NextFunction, Request, Response } from "express";
import { TypedRequest } from "../../lib/typed-request.interface";
import { AddCategoriaDTO } from "./categoria.dto";
import categoriaService from "./categoria.service";

export const getAllCategorie = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const categorie = await categoriaService.allCategorie();
        res.status(200).json(categorie);
    } catch (err) {
        next(err);
    }
}

export const createCategoria = async (
    req: TypedRequest<AddCategoriaDTO>,
    res: Response,
    next: NextFunction
) => {
    try {
        const categoria = await categoriaService.add(req.body);
        res.status(201).json(categoria);
    } catch (err) {
        next(err);
    }
}
