import express from "express";
import Boom from "@hapi/boom";
import { validateObjectId } from "../utils/validateObjectId";
import { sanitize } from "../utils/sanitize";
import { RmTracker } from "./rmTracker";

const RmTrackerRouter = express.Router();

RmTrackerRouter.route("/")
  .get(async (req, res) => {
    const { limit = 20, skip = 0, sort = "_id", select, populate, ...filter } = req.query;
    const listQuery = RmTracker.find(filter)
      .limit(Number(limit))
      .skip(Number(skip))
      .sort(sort)
      .select(select)
      .populate(populate);
    const totalCountQuery = RmTracker.find(listQuery.getFilter()).countDocuments();
    const [list, totalCount] = await Promise.all([listQuery, totalCountQuery]);
    res.set("X-Total-Count", String(totalCount));
    return res.json(list);
  })
  .post(async (req, res) => {
    const rmTracker = new RmTracker(sanitize(req.body));
    await rmTracker.save();
    return res.status(201).json(rmTracker);
  });

RmTrackerRouter.param("id", validateObjectId).param("id", async (req, res, next, value, name) => {
  const { select, populate } = req.query;
  const rmTracker = await RmTracker.findById(value).select(select).populate(populate);
  if (rmTracker === null) {
    throw Boom.notFound(`${RmTracker.modelName} with \`${name}\` matching \`${value}\` not found.`);
  }
  res.locals.rmTracker = rmTracker;
  return next();
});

RmTrackerRouter.route("/:id")
  .get((req, res) => {
    const { rmTracker } = res.locals;
    return res.json(rmTracker);
  })
  .patch(async (req, res) => {
    const { rmTracker } = res.locals;
    rmTracker.set(sanitize(req.body));
    await rmTracker.save();
    return res.json(rmTracker);
  })
  .delete(async (req, res) => {
    const { rmTracker } = res.locals;
    await rmTracker.remove();
    return res.sendStatus(204);
  });

export { RmTrackerRouter };
