export type Gender = "male" | "female" | "not-specified";
export type AccountVisibility = "public" | "private";
export type MessageAllowedType = "everyone" | "followers" | "following" | "none" | string;

export interface INotificationClient {
  type: string;
  userId: string;
  contentId?: string;
  contentType?: "post" | "comment" | "message" | string;
  media?: string;
  text?: string | null;
}

export interface IChatMetaClient {
  userId: string;
  chatboxId: string;
  userData: IUserClient;
}

export interface IUserClient {
  _id?: string;
  name?: string;
  username: string;
  email: string;
  profilePicture?: string | null;
  bio?: string;
  links?: string | null;
  dob?: string;
  gender?: Gender;

  accountVisibility?: AccountVisibility;
  messageAllowed?: MessageAllowedType;

  requests?: IUserClient[];
  followers?: IUserClient[];
  following?: IUserClient[];

  postCount?: number;
  chats?: IChatMetaClient[];

  notifications?: INotificationClient[];
  resetPasswordToken?: string | null;
  resetPasswordExpire?: string | null;

  createdAt?: string;
  updatedAt?: string;
}


export type VisibilityType = "public" | "private" | "friends";
export type MediaType = "image" | "video" | string;

export interface IPostClient {
  _id?: string;
  userId: string;

  content: string;
  media?: string | null;
  mediaType?: MediaType;

  tags?: string[];
  likes?: string[];
  reports?: string[];

  visibility?: VisibilityType;

  createdAt?: string;
  updatedAt?: string;

  likeCount?: number;
}


export interface ICommentClient {
    _id?: string;
    postId: string;
    userId: string;
  
    content: string;
    parentId?: string | null;
  
    likes?: string[];
  
    createdAt?: string;
    updatedAt?: string;
  }

  
export type MessageType = "user" | "post";
export type MessageStatus = "sent" | "delivered" | "read";
export type ChatType = "group" | "personal";

export interface IMessageClient {
  _id?: string;
  senderId: string;
  receiverId: string;

  text?: string;
  type?: MessageType;
  mediaUrl?: string | null;
  postId?: string | null;
  status?: MessageStatus;

  createdAt?: string;
  updatedAt?: string;
}

export interface AuthFormData {
    name: string;
    email: string;
    username: string;
    password: string;
}

export interface IChatClient {
  _id?: string;
  type: ChatType;

  users: string[];
  messages: string[];
  lastMessage?: string;

  createdAt?: string;
  updatedAt?: string;
}
