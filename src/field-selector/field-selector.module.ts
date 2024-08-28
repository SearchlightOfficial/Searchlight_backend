import { Module, Global } from "@nestjs/common";
import { APP_PIPE } from "@nestjs/core";
import { FieldSelectorPipe } from "./body-pipe";
import { FieldSelectorEntityManager } from "./field-selector-entity-manager";
import { FieldSelectorFactory } from "./field-selector-repository.factory";

@Global()
@Module({
  providers: [
    FieldSelectorPipe,
    {
      provide: APP_PIPE,
      useClass: FieldSelectorPipe,
    },
    FieldSelectorEntityManager,
    FieldSelectorFactory,
  ],
  exports: [
    FieldSelectorPipe,
    FieldSelectorEntityManager,
    FieldSelectorFactory,
  ],
})
export class FieldSelectorModule {}
