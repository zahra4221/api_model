import { Router } from "express";
import { FreeGame } from "../model/FreeGame";

export const freeGameRouter = Router();

freeGameRouter.get("/", async (req, res) => {
    try {
        const freeGames = await FreeGame.find();
        res.json(freeGames);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

freeGameRouter.get("/:id", async (req, res) => {
    try {
        const freeGame = await FreeGame.findById(req.params.id);
        if (freeGame) {
            res.json(freeGame);
        } else {
            res.status(404).send("Game not found");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

freeGameRouter.post("/", async (req, res) => {
    const { name, description, image } = req.body.data;
    if (!name || !description || !image) {
        res.status(400).send("Missing required information");
    } else {
        try {
            const newFreeGame = await FreeGame.create({ name, description, image });
            res.json(newFreeGame);
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    }
});

freeGameRouter.put("/:id", async (req, res) => {
    const { name, description, image } = req.body.data;
    try {
        const freeGame = await FreeGame.findById(req.params.id);
        if (freeGame) {
            freeGame.name = name;
            freeGame.description = description;
            freeGame.image = image;
            await freeGame.save();
            res.json(freeGame);
        } else {
            res.status(404).send("Game not found");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

freeGameRouter.delete("/:id", async (req, res) => {
    try {
        const freeGame = await FreeGame.findByIdAndDelete(req.params.id);
        if (freeGame) {
            res.json(freeGame);
        } else {
            res.status(404).send("Game not found");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});
