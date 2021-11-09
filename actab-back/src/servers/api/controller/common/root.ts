import { ParameterizedContext, Next } from "koa";
import { IRouterParamContext } from "koa-router";
import { BaseController, setCommonHeader } from "..";

export class RootController extends BaseController {
  public middleware() {
    return async (
      context: ParameterizedContext<any, IRouterParamContext<any, {}>, any>,
      next: Next
    ) => {
      setCommonHeader(context);
      context.body = { message: "Running." };
      next();
    };
  }
}
