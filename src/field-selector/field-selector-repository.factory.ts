import { Injectable, Inject } from "@nestjs/common";
import { FieldSelectorEntityManager } from "./field-selector-entity-manager";
import { EntityTarget, Repository } from "typeorm";
import { ObjectLiteral } from "typeorm/common/ObjectLiteral";

@Injectable()
export class FieldSelectorFactory {
  constructor(
    @Inject(FieldSelectorEntityManager)
    private readonly manager: FieldSelectorEntityManager,
  ) {}

  create<T extends ObjectLiteral>(entity: EntityTarget<T>): Repository<T> {
    return new Repository<T>(entity, this.manager);
  }
}
