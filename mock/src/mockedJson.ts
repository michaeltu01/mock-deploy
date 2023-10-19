/**
 * A file that contains constants used for mocking JSON responses and command outputs
 */

export const test: any[][] = [
  [1, 2, 3, 4, 5],
  ["a", "b", "c", "d", "e"],
];

export const words: any[][] = [
  [1, 2, 3, 4, 5],
  ["the", "quick", "brown", "fox", "jumped"],
];

export const loadSuccess: { type: string; details: string } = {
  type: "success",
  details: "file loaded successfully",
};

export const loadError: { type: string; error_type: string } = {
  type: "success",
  error_type: "error_datasource",
};

export const searchBrown: string[][] = [
  ["the", "quick", "brown", "fox", "jumped"],
];

export const searchApple: string[][] = [
  ["apples", "are", "cool", "0000"],
  ["aren't", "apples", "really", "cool!"],
];

export const searchEmpty: string[][] = [];

export const searchMultiWords: string[][] = [
  ["Rhode Island", "19999", "20.344", "true"],
];

export const searchBadRequestError: {} = {
  type: "error",
  error_type: "error_bad_request",
};

export const searchDatasourceError: {} = {
  type: "error",
  error_type: "error_datasource",
};
