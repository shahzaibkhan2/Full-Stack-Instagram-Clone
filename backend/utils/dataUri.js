import DataUriParser from "datauri/parser.js";
import path from "path";

const uriParser = new DataUriParser();

const getDataUri = (file) => {
  const extName = path.extname(file.originalname).toString();
  return uriParser.format(extName, file.buffer).content;
};

export default getDataUri;
