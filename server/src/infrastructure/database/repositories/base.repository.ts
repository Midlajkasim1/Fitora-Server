import { Model, SortOrder } from "mongoose";
import { IBaseRepository } from "@/domain/interfaces/repositories/base.repository";
import { IMapper } from "@/domain/interfaces/services/mapper.interface";


export abstract class BaseRepository<TEntity, TDocument> implements IBaseRepository<TEntity> {
  constructor(
    protected readonly model: Model<TDocument>,
    protected readonly mapper: IMapper<TEntity, TDocument>
  ) {}

  async create(item: TEntity): Promise<TEntity> {
    const mongoData = this.mapper.toMongo(item);
    const result = await this.model.create(mongoData);
    return this.mapper.toEntity(result as TDocument);
  }

  async findById(id: string): Promise<TEntity | null> {
    const result = await this.model.findById(id).lean().exec();
    return result ? this.mapper.toEntity(result as TDocument) : null;
  }

  async findAll(): Promise<TEntity[]> {
    const result = await this.model.find({}).lean().exec();
    return result.map((doc) => this.mapper.toEntity(doc as TDocument));
  }

  async update(id: string, update: Record<string, unknown>): Promise<TEntity | null> {
    const result = await this.model
      .findByIdAndUpdate(id, update, { new: true })
      .lean()
      .exec();
    return result ? this.mapper.toEntity(result as TDocument) : null;
  }

  async findOne(filter: Record<string, unknown>): Promise<TEntity | null> {
    const result = await this.model.findOne(filter).lean().exec();
    return result ? this.mapper.toEntity(result as TDocument) : null;
  }

  async find(
    filter: Record<string, unknown>, 
    options: { skip: number; limit: number }
  ): Promise<TEntity[]> {
    const sortCriteria: { [key: string]: SortOrder } = { createdAt: -1 };

    const docs = await this.model
      .find(filter)
      .sort(sortCriteria) 
      .skip(options.skip)
      .limit(options.limit)
      .lean()
      .exec();

    return docs.map((doc) => this.mapper.toEntity(doc as TDocument));
  }

  async delete(id: string): Promise<TEntity | null> {
    const result = await this.model.findByIdAndDelete(id).lean().exec();
    return result ? this.mapper.toEntity(result as TDocument) : null;
  }

  async count(filter: Record<string, unknown>): Promise<number> {
    return await this.model.countDocuments(filter);
  }
}