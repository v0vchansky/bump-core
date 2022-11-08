import { SetProfileInfoFieldName } from '../user.types';

export class SetProfileInfoDto {
    readonly fieldName: SetProfileInfoFieldName;
    readonly fieldValue: string;
    readonly unique: boolean;
}
