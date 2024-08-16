import { ROLE_ENUM, RoleType, SOCIAL_ACCOUNT_ENUM } from '../enums';
import { GoogleCallbackQuery } from '../types';
import { UserType } from '../user/user.dto';
import User from '../user/user.model';
import { createUser } from '../user/user.services';
import {
  compareHash,
  fetchGoogleTokens,
  getUserInfo,
  hashPassword,
  JwtPayload,
  signToken,
} from '../utils/auth.utils';
import { generateRandomNumbers } from '../utils/common.utils';
import {
  ChangePasswordSchemaType,
  ForgetPasswordSchemaType,
  LoginUserByEmailSchemaType,
  RegisterUserByEmailSchemaType,
  ResetPasswordSchemaType,
} from './auth.schema';

export const resetPassword = async (payload: ResetPasswordSchemaType) => {
  const user = User.findOne({
    _id: payload.userId,
    passwordResetCode: payload.code,
  });
  if (!user) {
    throw new Error('token is not valid or expired, please try again');
  }

  if (payload.confirmPassword !== payload.password) {
    throw new Error('Password and confirm password must be same');
  }

  const hashedPassword = await hashPassword(payload.password);

  await User.updateOne(
    {
      _id: payload.userId,
    },
    {
      $set: {
        password: hashedPassword,
        passwordResetCode: null,
      },
    },
  );
};

export const forgetPassword = async (
  payload: ForgetPasswordSchemaType,
): Promise<UserType> => {
  const user = await User.findOne({
    phoneNo: payload.email,
  });

  if (!user) {
    throw new Error("user doesn't exists");
  }

  const code = generateRandomNumbers(4);

  await User.updateOne(
    {
      _id: user._id,
    },
    {
      $set: { passwordResetCode: code },
    },
  );

  return user.toObject();
};

export const changePassword = async (
  userId: string,
  payload: ChangePasswordSchemaType,
): Promise<void> => {
  const user = await User.findOne({
    _id: userId,
  }).select('+password');

  if (!user || !user.password) {
    throw new Error('User is not found');
  }

  const isCurrentPassowordCorrect = await compareHash(
    user.password,
    payload.currentPassword,
  );

  if (!isCurrentPassowordCorrect) {
    throw new Error('current password is not valid');
  }

  const hashedPassword = await hashPassword(payload.newPassword);

  await User.updateOne({ _id: userId }, { $set: { password: hashedPassword } });
};

export const registerUserByEmail = async (
  payload: RegisterUserByEmailSchemaType,
): Promise<UserType> => {
  const userExistByEmail = await User.findOne({
    email: payload.email,
  });

  if (userExistByEmail) {
    throw new Error('Account already exist with same email address');
  }

  const { confirmPassword, ...rest } = payload;

  const user = await createUser({ ...rest, role: 'DEFAULT_USER' }, false);

  return user;
};

export const loginUserByEmail = async (
  payload: LoginUserByEmailSchemaType,
): Promise<string> => {
  const user = await User.findOne({ email: payload.email }).select('+password');

  if (!user || !(await compareHash(String(user.password), payload.password))) {
    throw new Error('Invalid email or password');
  }

  const jwtPayload: JwtPayload = {
    sub: String(user.id),
    email: user?.email,
    phoneNo: user?.phoneNo,
    role: String(user.role) as RoleType,
    username: user.username,
  };

  const token = await signToken(jwtPayload);

  return token;
};

export const googleLogin = async (
  payload: GoogleCallbackQuery,
): Promise<UserType> => {
  const { code, error } = payload;
  if (error) {
    throw new Error(error);
  }

  if (!code) {
    throw new Error('Code Not Provided');
  }
  const tokenResponse = await fetchGoogleTokens({ code });

  const { access_token, refresh_token, expires_in } = tokenResponse;

  const userInfoResponse = await getUserInfo(access_token);

  const { id, email, name, picture } = userInfoResponse;
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    return await createUser({
      email,
      username: name,
      avatar: picture,
      role: ROLE_ENUM.DEFAULT_USER,
      password: generateRandomNumbers(4),
      socialAccount: [
        {
          refreshToken: refresh_token,
          tokenExpiry: new Date(Date.now() + expires_in * 1000),
          accountType: SOCIAL_ACCOUNT_ENUM.GOOGLE,
          accessToken: access_token,
          accountID: id,
        },
      ],
    });
  } else {
    existingUser.socialAccount = [
      {
        refreshToken: refresh_token,
        tokenExpiry: new Date(Date.now() + expires_in * 1000),
        accountType: SOCIAL_ACCOUNT_ENUM.GOOGLE,
        accessToken: access_token,
        accountID: id,
      },
    ];
    await existingUser.save();
  }

  return existingUser.toObject();
};
