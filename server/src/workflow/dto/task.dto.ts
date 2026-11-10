import { IsString, Length } from 'class-validator';

export class TaskDto {
  @IsString()
  @Length(3, 4000)
  task: string;
}
