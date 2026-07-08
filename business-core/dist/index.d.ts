/**
 * BusinessOS Core Engine — public entry point.
 * Everything a consumer (backend, tests, demo scripts) needs is
 * re-exported from here, so usage looks like:
 *
 *   import { createOrder, calculateRevenue, generateBusinessSummary } from "@businessos/core";
 */
export * from "./models";
export * from "./constants";
export * from "./utils";
export * from "./services";
export * from "./analytics";
export * from "./reports";
export * from "./ai";
export * from "./data";
