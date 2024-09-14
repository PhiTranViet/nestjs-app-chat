import {Request} from 'express';
import {User} from '../../database/entities';

interface RequestWithUser extends Request {
    user: User;
}

export default RequestWithUser;