import { ParameterizedContext, Next, Context } from "koa";
import { IRouterParamContext } from "koa-router";

export abstract class BaseController {
  // eslint-disable-next-line no-unused-vars
  public abstract middleware(params?: any): (
    // eslint-disable-next-line no-unused-vars
    context: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
    // eslint-disable-next-line no-unused-vars
    next: Next
  ) => Promise<void>;
}

export function setCommonHeader(
  context: ParameterizedContext<any, IRouterParamContext<any, {}>, any>
): void {
  context.set("Content-Type", "application/json");
  context.set("Access-Control-Allow-Origin", "*"); // TODO: FIND A BETTER WAY TO FIX CORS
}

export * as Controllers from "./common";

export abstract class BaseWsController {
  public abstract middleware(): (
    // eslint-disable-next-line no-unused-vars
    context: Context
  ) => Promise<void>;
}

export * as WsControllers from "./ws";
