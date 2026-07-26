import type { Request } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import type { ParsedQs } from "qs";

export type TypedRequestBody<T> = Request<
  ParamsDictionary,
  unknown,
  T,
  ParsedQs
>;
