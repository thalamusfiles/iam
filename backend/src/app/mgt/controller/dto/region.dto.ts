import { IsUUID, IsString, IsNotEmpty } from 'class-validator';

export class RegionDto {
  @IsString()
  initials!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;
}

export class RegionWithIdDto extends RegionDto {
  @IsUUID('4')
  id: number;
}
