import { Model, type FilterQuery, type UpdateQuery, type ClientSession } from "mongoose";
import { PaginatedResponse } from "../Interface";
import { CrudOperationsEnum } from "../Helper";

abstract class BaseAbstract<T, I> {
  abstract findSingle(payload: object): Promise<I | null>;
  abstract create(payload: T): Promise<I>;
  abstract getAll(queries: {
    page: number;
    pageSize: number;
    queries: object;
    search?: string;
  }): Promise<PaginatedResponse<I>>;
  abstract update(query: object, payload: UpdateQuery<I>): Promise<I | null>;
  abstract delete(id: string): Promise<void>;
}

// Create a type instead of an interface
type MongoFilters<T> = FilterQuery<T> & {
  $text?: { $search: string };
};

const notAllowedMsg = (operation: CrudOperationsEnum): never => {
  const err = new Error(`Operation ${operation} not allowed`);
  console.log(err)
  throw err;
};

export default class BaseService<T, I> extends BaseAbstract<T, I> {
  private readonly Model: Model<I>;
  private readonly allowedOperations: CrudOperationsEnum[];

  public constructor(
    Model: Model<I>,
    allowedOperations: CrudOperationsEnum[] = Object.values(CrudOperationsEnum)
  ) {
    super();
    this.Model = Model;
    this.allowedOperations = allowedOperations;
  }

  async findSingle(payload: object, session?: ClientSession): Promise<I | null> {
    if (!this.allowedOperations.includes(CrudOperationsEnum.FINDSINGLE)) {
      notAllowedMsg(CrudOperationsEnum.FINDSINGLE);
    }
    const findSingle = await this.Model.findOne(payload, null, { session });
    return findSingle as I | null;
  }

  async create(payload: T, session?: ClientSession): Promise<I> {
    if (!this.allowedOperations.includes(CrudOperationsEnum.CREATE)) {
      notAllowedMsg(CrudOperationsEnum.CREATE);
    }
    const create = new this.Model(payload);
    await create.save({ session });
    return create as I;
  }

  async getAll(queries: {
    page: number;
    pageSize: number;
    queries: object;
    search?: string;
  }): Promise<PaginatedResponse<I>> {
    if (!this.allowedOperations.includes(CrudOperationsEnum.GETALL)) {
      notAllowedMsg(CrudOperationsEnum.GETALL);
    }
    const mongoFilters: MongoFilters<I> = { ...queries.queries };

    if (queries.search) {
      mongoFilters.$text = { $search: queries.search };
    }
    const skip = ((queries.page || 1) - 1) * queries.pageSize;
    const total = await this.Model.countDocuments(mongoFilters);
    const data = await this.Model.find(mongoFilters)
      .sort(
        queries.search
          ? { score: { $meta: "textScore" } }
          : { createdAt: "desc" }
      )
      .skip(skip)
      .limit(queries.pageSize)
      .exec();

    return {
      data: data as I[],
      meta: {
        total,
        page: queries.page,
        pageSize: queries.pageSize,
        totalPages: Math.ceil(total / queries.pageSize),
      },
    };
  }

  async update(query: object, payload: UpdateQuery<I>, session?: ClientSession): Promise<I | null> {
    if (!this.allowedOperations.includes(CrudOperationsEnum.UPDATE)) {
      notAllowedMsg(CrudOperationsEnum.UPDATE);
    }
    const update = await this.Model.findOneAndUpdate(query, payload, {
      new: true,
      session
    });
    return update as I | null;
  }

  async delete(id: string, session?: ClientSession): Promise<void> {
    if (!this.allowedOperations.includes(CrudOperationsEnum.DELETE)) {
      notAllowedMsg(CrudOperationsEnum.DELETE);
    }
    await this.Model.findByIdAndDelete(id, { session });
  }
}


/**
 * 
 *     // Start a session
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        // Example: Creating a new user inside the transaction
        const user = await UserModel.create({ name: "John" });

        // implement error behaviour by not completing bioModel
        await BioModel.create({
            name: "John Doe Bio",
            // description: "This is John Doe's Bio",
            dataId: user._id
        });

        // Commit transaction
        await session.commitTransaction();
        console.log("Transaction committed successfully");

    } catch (error) {
        // Abort transaction in case of error
        await session.abortTransaction();
        console.error("Transaction aborted due to error:", error);
    } finally {
        // End session
        session.endSession();
    }
 */ 