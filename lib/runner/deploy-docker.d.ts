import { Result } from "ts-results";
import { BaseError } from "../errors";
export default function (pathToDataApp: string): Promise<Result<true, BaseError>>;
