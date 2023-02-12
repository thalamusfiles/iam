import { PrimaryKey, Property } from '@mikro-orm/core';

export abstract class IamBaseEntity {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()', nullable: false })
  uuid: string;
  //@PrimaryKey()
  //uuid: string = v4();

  @Property({ onCreate: () => new Date() })
  createdAt: Date;

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt: Date;
}
