import { Router } from "express";
import { OfficialGame } from "../model/OfficialGame"; 
import { checkToken } from "../middlewares/checkToken";

export const officialGameRouter = Router();

officialGameRouter.get("/", checkToken, async (req, res) => {
    try {
        const officialGames = await OfficialGame.find(); 
        res.json(officialGames);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

officialGameRouter.get("/:id", checkToken, async (req, res) => {
    try {
        const officialGame = await OfficialGame.findById(req.params.id); 
        if (officialGame) {
            res.json(officialGame);
        } else {
            res.status(404).send("Game not found");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

officialGameRouter.post("/", checkToken, async (req, res) => {
    const { name, description, price, image } = req.body.data;
    if (!name || !description || !price || !image) {
        res.status(400).send("Missing required information");
    } else {
        try {
            const newOfficialGame = new OfficialGame({ name, description, price, image }); 
            await newOfficialGame.save();
            res.json(newOfficialGame);
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    }
});

officialGameRouter.put("/:id", checkToken, async (req, res) => {
    const { name, description, price, image } = req.body.data;
    try {
        const officialGame = await OfficialGame.findById(req.params.id); 
        if (officialGame) {
            officialGame.name = name;
            officialGame.description = description;
            officialGame.price = price;
            officialGame.image = image;
            await officialGame.save();
            res.json(officialGame);
        } else {
            res.status(404).send("Game not found");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

officialGameRouter.delete("/:id", checkToken, async (req, res) => {
    try {
        const officialGame = await OfficialGame.findByIdAndDelete(req.params.id);
        if (officialGame) {
            res.send("Deleted");
        } else {
            res.status(404).send("Game not found");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});
