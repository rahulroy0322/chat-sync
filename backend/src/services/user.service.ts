import {
  Error as DbError,
  type FilterQuery,
  type ProjectionType,
} from 'mongoose';
import type { DbResType } from '../@types/db.types';
import type { UserType } from '../@types/user.types';
import User from '../models/user.model';

const createUser = async (data: UserType): DbResType<UserType, null> => {
  try {
    return (await User.create(data))?.toJSON();
  } catch (e) {
    if (e instanceof DbError) {
      return {
        error: e,
      };
    }

    return null;
  }
};

const findUser = async (
  where: FilterQuery<UserType>,
  projection?: ProjectionType<UserType>
): DbResType<UserType, null> => {
  try {
    return (await User.findOne(where, projection))?.toJSON() as UserType;
  } catch (e) {
    if (e instanceof DbError) {
      return {
        error: e,
      };
    }

    return null;
  }
};

const findUserByUserNameOrEmail = ({
  email,
  uname,
}: Pick<UserType, 'email' | 'uname'>): DbResType<UserType, null> =>
  findUser({
    $or: [
      {
        email,
      },
      {
        uname,
      },
    ],
  });

const findUserByEmail = ({
  email,
}: Pick<UserType, 'email'>): DbResType<UserType, null> =>
  findUser(
    {
      email,
    },
    '+password'
  );

const findUserByID = ({
  _id,
}: Pick<UserType, '_id'>): DbResType<UserType, null> =>
  findUser({
    _id,
  });
export {
  createUser,
  findUserByEmail,
  findUserByUserNameOrEmail,
  findUser,
  findUserByID,
};
