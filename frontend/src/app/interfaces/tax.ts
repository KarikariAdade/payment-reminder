import {User} from "./user";

export interface Tax {
  id: number;
  name: string;
  type: string;
  user_id: number;
  user: User
  created_at: string

}
