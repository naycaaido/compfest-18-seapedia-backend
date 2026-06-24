import { PickType } from "@nestjs/mapped-types";
import { FindDiscountDto } from "../../discount/dto/find-discount.dto";

export class FindPromoDto extends PickType(FindDiscountDto,['showing_expired']){}