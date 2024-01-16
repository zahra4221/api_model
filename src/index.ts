import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { Sequelize, DataTypes} from "sequelize";

import { OfficialGameModel } from "./model/OfficialGame";
import { FreeGameModel } from "./model/FreeGame";
import { UserModel} from "./model/User";
import { TokenBlackListModel } from "./model/TokenBlackList";

import { officialGameRouter } from "./router/officialGame";
import { freeGameRouter } from "./router/freeGame";
import { authRouter } from "./router/auth";
import { userRouter } from "./router/users";

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'db/database.sqlite'
});

export const OfficialGame = OfficialGameModel(sequelize);
export const FreeGame = FreeGameModel(sequelize);
export const User = UserModel(sequelize);
export const TokenBlackList = TokenBlackListModel(sequelize);

// sequelize.sync({ force: true });
sequelize.sync();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const apiRouter = express.Router();
apiRouter.use('/auth', authRouter);
apiRouter.use('/official-games', officialGameRouter );
apiRouter.use('/free-games', freeGameRouter);
apiRouter.use('/users', userRouter);

app.use("/api", apiRouter);

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}!`)
});
