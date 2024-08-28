import {
  EntityManager,
  EntityTarget,
  SelectQueryBuilder,
  DataSource,
  QueryRunner,
  ObjectLiteral,
  EntitySchema,
} from "typeorm";
import { Injectable, Inject, BadRequestException, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";

@Injectable({ scope: Scope.REQUEST })
export class FieldSelectorEntityManager extends EntityManager {
  constructor(
    @Inject(REQUEST) private readonly request: any,
    @Inject(DataSource) dataSource: DataSource,
  ) {
    super(dataSource);
  }

  private validateFields<Entity>(
    entityClass: EntityTarget<Entity>,
    fields: string[],
  ): void {
    const entityMetadata = this.connection.getMetadata(entityClass);

    const invalidFields = fields.filter(
      (field) => !entityMetadata.findColumnWithPropertyName(field),
    );

    if (invalidFields.length > 0) {
      throw new BadRequestException(
        `Invalid fields: ${invalidFields.join(", ")}`,
      );
    }
  }

  createQueryBuilder<Entity extends ObjectLiteral>(
    entityClass: EntityTarget<Entity>,
    alias: string,
    queryRunner?: QueryRunner,
  ): SelectQueryBuilder<Entity>;
  createQueryBuilder<Entity extends ObjectLiteral>(
    queryRunner?: QueryRunner,
  ): SelectQueryBuilder<Entity>;

  createQueryBuilder<Entity extends ObjectLiteral>(
    entityClassOrQueryRunner?: EntityTarget<Entity> | QueryRunner,
    alias?: string,
    queryRunner?: QueryRunner,
  ): SelectQueryBuilder<Entity> {
    let queryBuilder: SelectQueryBuilder<Entity>;

    if (
      typeof entityClassOrQueryRunner === "string" ||
      typeof entityClassOrQueryRunner === "function" ||
      entityClassOrQueryRunner instanceof EntitySchema
    ) {
      queryBuilder = super.createQueryBuilder(
        entityClassOrQueryRunner as EntityTarget<Entity>,
        alias!,
        queryRunner,
      );

      const fields =
        this.request.body.fields ??
        (this.request.query.fields ? this.request.query.fields.split(",") : []);

      if (fields.length) {
        this.validateFields(
          entityClassOrQueryRunner as EntityTarget<Entity>,
          fields,
        );
        queryBuilder.select(fields.map((field: any) => `${alias}.${field}`));
      }
    } else {
      queryBuilder = super.createQueryBuilder(
        entityClassOrQueryRunner as QueryRunner,
      );
    }

    return queryBuilder;
  }
}
