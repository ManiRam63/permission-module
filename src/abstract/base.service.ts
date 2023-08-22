import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { IErrorObject } from 'src/types/IErrorObject';
import {
  paginate,
  Pagination,
  IPaginationOptions,
  PaginationTypeEnum,
} from 'nestjs-typeorm-paginate';
import { SelectQueryBuilder } from 'typeorm';
import { RESPONSE_MESSAGES } from '../types/responseMessages';

export abstract class BaseService {
  protected _getBadRequestError(message: string) {
    throw new BadRequestException({ message });
  }
  protected _getForbiddenError(message: IErrorObject | string) {
    throw new ForbiddenException({ message });
  }
  protected _getInternalServerError(message: string) {
    throw new InternalServerErrorException({ message });
  }
  // mobile use only
  protected _getInternalServerErrorMob(message: string) {
    throw new InternalServerErrorException({ message, items: [] });
  }
  protected _getNotFoundErrorMob(message: string) {
    throw new NotFoundException({ message, items: [] });
  }
  protected _getNotFoundError(message: string) {
    throw new NotFoundException({ message });
  }
  protected _getUnverifiedEmail(message: string) {
    throw new NotFoundException({ message });
  }
  protected _getUnauthorizedError(message: string) {
    throw new UnauthorizedException({ message });
  }

  protected async _paginate<T>(
    queryBuilder: SelectQueryBuilder<any>,
    { limit = 10, page = 1 }: IPaginationOptions,
  ): Promise<Pagination<T>> {
    const totalItems = await queryBuilder.getCount();
    return await paginate<T>(queryBuilder, {
      limit,
      page,
      paginationType: PaginationTypeEnum.TAKE_AND_SKIP,
      //https://github.com/nestjsx/nestjs-typeorm-paginate/issues/627
      metaTransformer: ({ currentPage, itemCount, itemsPerPage }) => {
        // Calculating the total of pages
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        return {
          currentPage,
          itemCount,
          itemsPerPage,

          // Returning in this two row
          totalItems,
          totalPages: totalPages === 0 ? 1 : totalPages,
        };
      },
    });
  }

  public buildSortParams<T extends object>(param: string) {
    if (typeof param === 'string') {
      const result = param?.match(/^-/);
      if (result) {
        const key = param.slice(1);
        return [key, 'DESC'] as [keyof T, 'DESC'];
      }
    }
    return [param, 'ASC'] as [keyof T, 'ASC'];
  }

  protected customErrorHandle(error) {
    switch (error.name) {
      case 'HttpException':
        throw new HttpException(error.response, error.status);
    }
    switch (error.status || error.code || error.name) {
      case 400:
        return this._getBadRequestError(error.message);

      case 401:
        return this._getUnauthorizedError(error.message);

      case 403:
        return this._getForbiddenError(error.message);

      case 404:
        return this._getNotFoundError(error.message);

      case '23505':
        return this._getBadRequestError(
          RESPONSE_MESSAGES.COMMON.DUPLICATE_KEY_EXISTS,
        );

      case '23503':
        return this._getBadRequestError(RESPONSE_MESSAGES.COMMON.NOT_FOUND);

      case '42830':
        return this._getBadRequestError(
          RESPONSE_MESSAGES.ERROR_MESSAGES.INVALID_REQUEST,
        );

      case '22P02':
        return this._getBadRequestError(
          RESPONSE_MESSAGES.ERROR_MESSAGES.INVALID_TYPE_OF_INPUT,
        );
      case 403:
        return this._getUnverifiedEmail(error.message);
      default:
        return this._getInternalServerError(
          RESPONSE_MESSAGES.COMMON.SOMETHING_WENT_WRONG,
        );
    }
  }
}
