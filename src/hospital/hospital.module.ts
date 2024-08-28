import { Module } from "@nestjs/common";
import { HospitalController } from "./hospital.controller";
import { HospitalService } from "./hospital.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HospitalEntity } from "./hospital.entity";
import { Repository } from "typeorm";
import { FieldSelectorFactory } from "src/field-selector";

@Module({
  imports: [TypeOrmModule.forFeature([HospitalEntity])],
  controllers: [HospitalController],
  providers: [
    HospitalService,
    {
      provide: Repository<HospitalEntity>,
      useFactory: (factory: FieldSelectorFactory) =>
        factory.create(HospitalEntity),
      inject: [FieldSelectorFactory],
    },
  ],
})
export class HospitalModule {}
