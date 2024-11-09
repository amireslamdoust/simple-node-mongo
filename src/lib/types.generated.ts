import { GraphQLResolveInfo } from 'graphql';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type AddUserToTaskList = {
  taskListId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};

export type AuthUser = {
  __typename?: 'AuthUser';
  token: Scalars['String']['output'];
  user: User;
};

export type CreateTaskListInput = {
  title: Scalars['String']['input'];
};

export type CreateToDoInput = {
  content: Scalars['String']['input'];
  taskListId: Scalars['ID']['input'];
};

export type DeleteMessagesStatus = {
  __typename?: 'DeleteMessagesStatus';
  message: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addUserToTaskList: TaskList;
  createTaskList: TaskList;
  createToDo: ToDo;
  deleteTaskList?: Maybe<DeleteMessagesStatus>;
  deleteToDo?: Maybe<DeleteMessagesStatus>;
  signIn: AuthUser;
  singUp: AuthUser;
  updateTaskList: TaskList;
  updateToDo: ToDo;
};


export type MutationAddUserToTaskListArgs = {
  input?: InputMaybe<AddUserToTaskList>;
};


export type MutationCreateTaskListArgs = {
  input?: InputMaybe<CreateTaskListInput>;
};


export type MutationCreateToDoArgs = {
  input?: InputMaybe<CreateToDoInput>;
};


export type MutationDeleteTaskListArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteToDoArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSignInArgs = {
  input?: InputMaybe<SingInInput>;
};


export type MutationSingUpArgs = {
  input?: InputMaybe<SignUpInput>;
};


export type MutationUpdateTaskListArgs = {
  input?: InputMaybe<UpdateTaskListInput>;
};


export type MutationUpdateToDoArgs = {
  input?: InputMaybe<UpdateToDoInput>;
};

export type Query = {
  __typename?: 'Query';
  getTaskList: TaskList;
  getToDo: ToDo;
  myTaskLists: Array<TaskList>;
};


export type QueryGetTaskListArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetToDoArgs = {
  id: Scalars['ID']['input'];
};

export type SignUpInput = {
  avatar?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type SingInInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type TaskList = {
  __typename?: 'TaskList';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  progress: Scalars['Float']['output'];
  title: Scalars['String']['output'];
  todos: Array<ToDo>;
  users: Array<User>;
};

export type ToDo = {
  __typename?: 'ToDo';
  content: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isCompleted: Scalars['Boolean']['output'];
  taskList: TaskList;
};

export type UpdateTaskListInput = {
  id: Scalars['ID']['input'];
  progress?: InputMaybe<Scalars['Float']['input']>;
  title: Scalars['String']['input'];
};

export type UpdateToDoInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  isCompleted?: InputMaybe<Scalars['Boolean']['input']>;
};

export type User = {
  __typename?: 'User';
  avatar?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type AdditionalEntityFields = {
  path?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AddUserToTaskList: AddUserToTaskList;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  AuthUser: ResolverTypeWrapper<AuthUser>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  CreateTaskListInput: CreateTaskListInput;
  CreateToDoInput: CreateToDoInput;
  DeleteMessagesStatus: ResolverTypeWrapper<DeleteMessagesStatus>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  SignUpInput: SignUpInput;
  SingInInput: SingInInput;
  TaskList: ResolverTypeWrapper<TaskList>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  ToDo: ResolverTypeWrapper<ToDo>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  UpdateTaskListInput: UpdateTaskListInput;
  UpdateToDoInput: UpdateToDoInput;
  User: ResolverTypeWrapper<User>;
  AdditionalEntityFields: AdditionalEntityFields;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AddUserToTaskList: AddUserToTaskList;
  ID: Scalars['ID']['output'];
  AuthUser: AuthUser;
  String: Scalars['String']['output'];
  CreateTaskListInput: CreateTaskListInput;
  CreateToDoInput: CreateToDoInput;
  DeleteMessagesStatus: DeleteMessagesStatus;
  Mutation: {};
  Query: {};
  SignUpInput: SignUpInput;
  SingInInput: SingInInput;
  TaskList: TaskList;
  Float: Scalars['Float']['output'];
  ToDo: ToDo;
  Boolean: Scalars['Boolean']['output'];
  UpdateTaskListInput: UpdateTaskListInput;
  UpdateToDoInput: UpdateToDoInput;
  User: User;
  AdditionalEntityFields: AdditionalEntityFields;
};

export type UnionDirectiveArgs = {
  discriminatorField?: Maybe<Scalars['String']['input']>;
  additionalFields?: Maybe<Array<Maybe<AdditionalEntityFields>>>;
};

export type UnionDirectiveResolver<Result, Parent, ContextType = any, Args = UnionDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AbstractEntityDirectiveArgs = {
  discriminatorField: Scalars['String']['input'];
  additionalFields?: Maybe<Array<Maybe<AdditionalEntityFields>>>;
};

export type AbstractEntityDirectiveResolver<Result, Parent, ContextType = any, Args = AbstractEntityDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type EntityDirectiveArgs = {
  embedded?: Maybe<Scalars['Boolean']['input']>;
  additionalFields?: Maybe<Array<Maybe<AdditionalEntityFields>>>;
};

export type EntityDirectiveResolver<Result, Parent, ContextType = any, Args = EntityDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type ColumnDirectiveArgs = {
  overrideType?: Maybe<Scalars['String']['input']>;
};

export type ColumnDirectiveResolver<Result, Parent, ContextType = any, Args = ColumnDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type IdDirectiveArgs = { };

export type IdDirectiveResolver<Result, Parent, ContextType = any, Args = IdDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type LinkDirectiveArgs = {
  overrideType?: Maybe<Scalars['String']['input']>;
};

export type LinkDirectiveResolver<Result, Parent, ContextType = any, Args = LinkDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type EmbeddedDirectiveArgs = { };

export type EmbeddedDirectiveResolver<Result, Parent, ContextType = any, Args = EmbeddedDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type MapDirectiveArgs = {
  path: Scalars['String']['input'];
};

export type MapDirectiveResolver<Result, Parent, ContextType = any, Args = MapDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AuthUserResolvers<ContextType = any, ParentType extends ResolversParentTypes['AuthUser'] = ResolversParentTypes['AuthUser']> = {
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeleteMessagesStatusResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeleteMessagesStatus'] = ResolversParentTypes['DeleteMessagesStatus']> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  addUserToTaskList?: Resolver<ResolversTypes['TaskList'], ParentType, ContextType, Partial<MutationAddUserToTaskListArgs>>;
  createTaskList?: Resolver<ResolversTypes['TaskList'], ParentType, ContextType, Partial<MutationCreateTaskListArgs>>;
  createToDo?: Resolver<ResolversTypes['ToDo'], ParentType, ContextType, Partial<MutationCreateToDoArgs>>;
  deleteTaskList?: Resolver<Maybe<ResolversTypes['DeleteMessagesStatus']>, ParentType, ContextType, RequireFields<MutationDeleteTaskListArgs, 'id'>>;
  deleteToDo?: Resolver<Maybe<ResolversTypes['DeleteMessagesStatus']>, ParentType, ContextType, RequireFields<MutationDeleteToDoArgs, 'id'>>;
  signIn?: Resolver<ResolversTypes['AuthUser'], ParentType, ContextType, Partial<MutationSignInArgs>>;
  singUp?: Resolver<ResolversTypes['AuthUser'], ParentType, ContextType, Partial<MutationSingUpArgs>>;
  updateTaskList?: Resolver<ResolversTypes['TaskList'], ParentType, ContextType, Partial<MutationUpdateTaskListArgs>>;
  updateToDo?: Resolver<ResolversTypes['ToDo'], ParentType, ContextType, Partial<MutationUpdateToDoArgs>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getTaskList?: Resolver<ResolversTypes['TaskList'], ParentType, ContextType, RequireFields<QueryGetTaskListArgs, 'id'>>;
  getToDo?: Resolver<ResolversTypes['ToDo'], ParentType, ContextType, RequireFields<QueryGetToDoArgs, 'id'>>;
  myTaskLists?: Resolver<Array<ResolversTypes['TaskList']>, ParentType, ContextType>;
};

export type TaskListResolvers<ContextType = any, ParentType extends ResolversParentTypes['TaskList'] = ResolversParentTypes['TaskList']> = {
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  progress?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  todos?: Resolver<Array<ResolversTypes['ToDo']>, ParentType, ContextType>;
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ToDoResolvers<ContextType = any, ParentType extends ResolversParentTypes['ToDo'] = ResolversParentTypes['ToDo']> = {
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isCompleted?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  taskList?: Resolver<ResolversTypes['TaskList'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  avatar?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  AuthUser?: AuthUserResolvers<ContextType>;
  DeleteMessagesStatus?: DeleteMessagesStatusResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  TaskList?: TaskListResolvers<ContextType>;
  ToDo?: ToDoResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

export type DirectiveResolvers<ContextType = any> = {
  union?: UnionDirectiveResolver<any, any, ContextType>;
  abstractEntity?: AbstractEntityDirectiveResolver<any, any, ContextType>;
  entity?: EntityDirectiveResolver<any, any, ContextType>;
  column?: ColumnDirectiveResolver<any, any, ContextType>;
  id?: IdDirectiveResolver<any, any, ContextType>;
  link?: LinkDirectiveResolver<any, any, ContextType>;
  embedded?: EmbeddedDirectiveResolver<any, any, ContextType>;
  map?: MapDirectiveResolver<any, any, ContextType>;
};

import { ObjectId } from 'mongodb';