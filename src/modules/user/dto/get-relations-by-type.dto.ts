import { RelationList } from 'src/modules/relation/types';

export class GetRelationsByTypeDto {
    readonly uuid: string | undefined;
    readonly type: RelationList;
}
