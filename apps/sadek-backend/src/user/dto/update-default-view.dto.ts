import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateDefaultViewDto {
    @IsBoolean()
    @IsNotEmpty()
    isDefaultView!: boolean;
}
