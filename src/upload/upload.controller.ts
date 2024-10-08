import { Request, Response } from 'express';
import { errorResponse, successResponse } from '../utils/api.utils';
import { updateUser } from '../modules/user/user.services';
import { UserType } from '../modules/user/user.dto';

export const handleProfileUpload = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    const currentUser = req.user as UserType;

    if ((file && !('location' in file)) || !file) {
      return errorResponse(res, 'File not uploaded, Please try again');
    }

    const user = await updateUser(String(currentUser._id), {
      avatar: String(file.location),
    });

    return successResponse(res, 'Profile picture has been uploaded', user);
  } catch (err) {
    return errorResponse(res, (err as Error).message);
  }
};
