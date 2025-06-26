import { IsOptional, IsString } from "class-validator";
import { PaginationQueryParams } from "../../pagination/dto/pagination.dto";

export class GetUsersDTO extends PaginationQueryParams {
  @IsOptional()
  @IsString()
  readonly search?: string;
}
