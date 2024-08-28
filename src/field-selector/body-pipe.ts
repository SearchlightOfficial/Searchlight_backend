import { Injectable, ArgumentMetadata, PipeTransform } from "@nestjs/common";

@Injectable()
export class FieldSelectorPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === "body" && value.data) {
      return value.data;
    }

    return value;
  }
}
