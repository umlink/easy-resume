declare namespace API {
  type copyResumeParams = {
    id: number;
  };

  type CreateGuidDto = {
    title: string;
    content: string;
    sort: number;
    status: number;
  };

  type CreateOrderDto = {
    vipTypeId: number;
  };

  type CreateOrderVO = {
    orderId: string;
    payImgUrl: string;
  };

  type CreateProposeDto = {
    message: string;
  };

  type CreateResumeDto = {
    title: string;
    content: Record<string, any>;
    templateCode: string;
  };

  type CreateTemplateDto = {
    code: string;
    title: string;
    headerImg: string;
    tags: string[];
    content: Record<string, any>;
  };

  type CreateVipTypeDto = {
    /** id */
    id: number;
    /** 会员类型标题 */
    title: string;
    /** 会员介绍 */
    description: string;
    /** 权益介绍，json 对象 */
    equity: Record<string, any>;
    /** 售价 */
    price: number;
    /** 原价 */
    originalPrice: number;
    /** 有效天数 */
    duration: number;
    /** 售卖类型 */
    sellType: 'SELL' | 'GIFT' | 'PRIVATE';
  };

  type deleteGuideParams = {
    id: number;
  };

  type EmailCodeLoginDto = {
    email: string;
    code: string;
  };

  type EmailPwdLoginDto = {
    email: string;
    password: string;
  };

  type exportPDFParams = {
    id: number;
  };

  type FormData = {};

  type generateHtmlToPdfParams = {
    url: string;
    rId: number;
  };

  type genResumeAccessCodeParams = {
    id: number;
  };

  type getGuideDetailParams = {
    id: number;
  };

  type getQrCodeParams = {
    inviteCode?: string;
  };

  type getResumeInfoParams = {
    id: number;
  };

  type getResumeTmpInfoParams = {
    id: number;
  };

  type getTemplateInfoParams = {
    code: string;
  };

  type GuideDetailDto = {
    id: number;
    title: string;
    content: string;
    sort: number;
    status: number;
  };

  type GuideItemVO = {
    id: number;
    title: string;
  };

  type GuideListVO = {
    list: GuideItemVO[];
    total: number;
    pageNum: number;
    pageSize: number;
  };

  type GuideQueryDto = {
    pageNum: number;
    pageSize: number;
  };

  type LoginResVo = {
    /** jwt token */
    accessToken: string;
    /** 是否是新用户 */
    isRegister: boolean;
  };

  type loopLoginStatusParams = {
    verifyCode: string;
    verifyCode: string;
  };

  type MigrationResumeDto = {
    email: string;
    code: string;
  };

  type MpCodeAutoLoginDto = {
    code: string;
  };

  type MpCodeLoginDto = {
    code: string;
    verifyCode: string;
    inviteCode: string;
  };

  type NewSseTaskReq = {
    content: string;
  };

  type OptModuleReqDto = {
    title: string;
    description?: string;
    content: string;
  };

  type PreviewResumeDto = {
    id: number;
    code?: string;
  };

  type QueryMpQrCodeResVo = {
    imgUrl: string;
    verifyCode: number;
  };

  type QueryResumeDto = {
    pageNum: number;
    pageSize: number;
  };

  type removeResumeParams = {
    id: number;
  };

  type ResetEmailPwdDto = {
    email: string;
    password: string;
    code: string;
  };

  type Response = {
    /** 状态码 */
    code: number;
    /** 提示信息 */
    message: string;
    success: boolean;
  };

  type resumeAiChatStreamParams = {
    taskId: number;
  };

  type ResumeDetailVO = {
    id: number;
    title: string;
    content: Record<string, any>;
    templateCode: string;
    accessCode: string;
    dataTmp: number;
    createdAt: string;
    updatedAt: string;
  };

  type ResumeGroupItem = {
    id: number;
    name: string;
    key: string;
    icon: string;
    sort: number;
    types: Record<string, any>;
  };

  type resumeInspectStreamAiParams = {
    resumeId: number;
  };

  type ResumeItemVO = {
    id: number;
    title: string;
    content: Record<string, any>;
    templateCode: string;
    accessCode: string;
    dataTmp: number;
    createdAt: string;
    updatedAt: string;
  };

  type ResumeListVO = {
    list: ResumeItemVO[];
    total: number;
    pageNum: number;
    pageSize: number;
  };

  type searchOrderStatusParams = {
    orderId: string;
  };

  type SendMailCodeDto = {
    email: string;
    type: string;
  };

  type TemplateItemVO = {
    id: string;
    code: string;
    title: string;
    content: Record<string, any>;
    headerImg: string;
    isVip: number;
    tags: string[];
    useCount: number;
  };

  type TemplateListVo = {
    list: TemplateItemVO[];
    total: number;
    pageNum: number;
    pageSize: number;
  };

  type TemplateQueryDto = {
    pageNum: number;
    pageSize: number;
    filter?: string;
    tags?: string[];
    code?: string;
  };

  type UpdateGuideDto = {
    title?: string;
    content?: string;
    sort?: number;
    status?: number;
    id: number;
  };

  type UpdateResumeDto = {
    title?: string;
    content?: Record<string, any>;
    templateCode?: string;
    id: number;
    accessCode?: string;
    dataTmp?: number;
  };

  type UpdateResumeGroupDto = {
    id: number;
    name: string;
    icon: string;
    sort: number;
    types: Record<string, any>[];
  };

  type UpdateTemplateDto = {
    code?: string;
    title?: string;
    headerImg?: string;
    tags?: string[];
    content?: Record<string, any>;
  };

  type updateTemplateParams = {
    code: string;
  };

  type UpdateUserDto = {
    username: string;
    /** 邮箱 */
    email: string;
    age?: number;
    avatar?: string;
    school?: string;
    discipline?: string;
    profession?: string;
    hobby?: string;
    introduce?: string;
    accessCode?: string;
  };

  type UpdateVipTypeDto = {
    /** id */
    id?: number;
    /** 会员类型标题 */
    title?: string;
    /** 会员介绍 */
    description?: string;
    /** 权益介绍，json 对象 */
    equity?: Record<string, any>;
    /** 售价 */
    price?: number;
    /** 原价 */
    originalPrice?: number;
    /** 有效天数 */
    duration?: number;
    /** 售卖类型 */
    sellType?: 'SELL' | 'GIFT' | 'PRIVATE';
    /** 启用禁用：1/0 */
    disabled: number;
  };

  type updateVipTypeParams = {
    id: number;
  };

  type UploadQiNiuResVo = {
    filename: string;
    size: string;
    url: string;
    type: string;
  };

  type UserBaseInfoVO = {
    id: number;
    /** 用户名 */
    username: string;
    /** 邮箱 */
    email: string;
    /** 学校 */
    school: string;
    /** 学科专业 */
    discipline: string;
    /** 年龄 */
    age: number;
    /** 头像 */
    avatar: string;
    /** 是否是 vip */
    isVip: number;
    /** 职业 */
    profession: string;
    /** 个人爱好 */
    hobby: string;
    /** 个人介绍 */
    introduce: string;
    /** 角色 */
    roles: string[];
    /** jwt token */
    accessToken: string;
  };

  type VipInfoVO = {
    userId: number;
    vipTypeId: number;
    optTokens: number;
    checkCount: number;
    startTime: string;
    expireTime: string;
  };

  type VipTypeItemVo = {
    id: number;
    title: string;
    description: string;
    equity: Record<string, any>;
    price: number;
    optTokens: number;
    checkCount: number;
    originalPrice: number;
    duration: number;
  };
}
