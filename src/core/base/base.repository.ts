import { Document, FilterQuery, Model, UpdateQuery } from 'mongoose';

export abstract class BaseRepository<T extends Document> {
    constructor(protected readonly entityModel: Model<T>) {}

    async create(entity: Partial<T>): Promise<T> {
        const _entity = new this.entityModel(entity);

        return _entity.save();
    }

    async findOne(filterQuery?: FilterQuery<T>): Promise<T> {
        return this.entityModel.findOne(filterQuery);
    }

    async findAndUpdateOne(filterQuery: FilterQuery<T>, entity: UpdateQuery<T>): Promise<T> {
        return this.entityModel.findOneAndUpdate(filterQuery, entity);
    }

    async createOrUpdateOne(filterQuery: FilterQuery<T>, entity: UpdateQuery<T>): Promise<T> {
        return this.entityModel.findOneAndUpdate(filterQuery, entity, { upsert: true });
    }

    async deleteOne(filterQuery: FilterQuery<T>): Promise<number> {
        const result = await this.entityModel.deleteOne(filterQuery);

        return result.deletedCount;
    }
}
