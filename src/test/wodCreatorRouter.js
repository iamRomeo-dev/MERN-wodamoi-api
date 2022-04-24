import express from "express";
import Boom from "@hapi/boom";
import { validateObjectId } from "../utils/validateObjectId";
import { sanitize } from "../utils/sanitize";
import { WodCreator } from "./wodCreator";

const WodCreatorRouter = express.Router();

WodCreatorRouter.route("/")
  .get(async (req, res) => {
    const { limit = 20, skip = 0, sort = "_id", select, populate, ...filter } = req.query;
    const listQuery = WodCreator.find(filter)
      .limit(Number(limit))
      .skip(Number(skip))
      .sort(sort)
      .select(select)
      .populate(populate);
    const totalCountQuery = WodCreator.find(listQuery.getFilter()).countDocuments();
    const [list, totalCount] = await Promise.all([listQuery, totalCountQuery]);
    res.set("X-Total-Count", String(totalCount));
    return res.json(list);
  })
  .post(async (req, res) => {
    const wodCreator = new WodCreator(sanitize(req.body));
    await wodCreator.save();
    return res.status(201).json(wodCreator);
  });

WodCreatorRouter.param("id", validateObjectId).param("id", async (req, res, next, value, name) => {
  const { select, populate } = req.query;
  const wodCreator = await WodCreator.findById(value).select(select).populate(populate);
  if (wodCreator === null) {
    throw Boom.notFound(
      `${WodCreator.modelName} with \`${name}\` matching \`${value}\` not found.`
    );
  }
  res.locals.wodCreator = wodCreator;
  return next();
});

WodCreatorRouter.route("/:id")
  .get((req, res) => {
    const { wodCreator } = res.locals;
    return res.json(wodCreator);
  })
  .patch(async (req, res) => {
    const { wodCreator } = res.locals;
    wodCreator.set(sanitize(req.body));
    await wodCreator.save();
    return res.json(wodCreator);
  })
  .delete(async (req, res) => {
    const { wodCreator } = res.locals;
    await wodCreator.remove();
    return res.sendStatus(204);
  });

export { WodCreatorRouter };
