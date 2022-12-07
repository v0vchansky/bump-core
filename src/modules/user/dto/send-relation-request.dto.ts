import { RelationRequestType } from 'src/modules/relation/types';

export class SendRelationRequestDto {
    readonly to: string;
    readonly relationType: RelationRequestType;
}
