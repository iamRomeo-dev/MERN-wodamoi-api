import express from "express";
import Boom from "@hapi/boom";
import { validateObjectId } from "../utils/validateObjectId";
import { sanitize } from "../utils/sanitize";
import { FullTraining } from "./fullTraining";

const FullTrainingRouter = express.Router();

FullTrainingRouter.route("/")
  .get(async (req, res) => {
    const { limit = 20, skip = 0, sort = "_id", select, populate, ...filter } = req.query;
    const listQuery = FullTraining.find(filter)
      .limit(Number(limit))
      .skip(Number(skip))
      .sort(sort)
      .select(select)
      .populate(populate);
    const totalCountQuery = FullTraining.find(listQuery.getFilter()).countDocuments();
    const [list, totalCount] = await Promise.all([listQuery, totalCountQuery]);
    res.set("X-Total-Count", String(totalCount));
    return res.json(list);
  })
  .post(async (req, res) => {
    const fullTraining = new FullTraining(sanitize(req.body));
    await fullTraining.save();
    return res.status(201).json(fullTraining);
  });

FullTrainingRouter.param("id", validateObjectId).param(
  "id",
  async (req, res, next, value, name) => {
    const { select, populate } = req.query;
    const fullTraining = await FullTraining.findById(value).select(select).populate(populate);
    if (fullTraining === null) {
      throw Boom.notFound(
        `${FullTraining.modelName} with \`${name}\` matching \`${value}\` not found.`
      );
    }
    res.locals.fullTraining = fullTraining;
    return next();
  }
);

FullTrainingRouter.route("/:id")
  .get((req, res) => {
    const { fullTraining } = res.locals;
    return res.json(fullTraining);
  })
  .patch(async (req, res) => {
    const { fullTraining } = res.locals;
    fullTraining.set(sanitize(req.body));
    await fullTraining.save();
    return res.json(fullTraining);
  })
  .delete(async (req, res) => {
    const { fullTraining } = res.locals;
    await fullTraining.remove();
    return res.sendStatus(204);
  });

export { FullTrainingRouter };
