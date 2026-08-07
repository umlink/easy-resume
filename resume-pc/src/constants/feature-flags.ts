// VIP 会员体系开关。设为 false 时:
// - 隐藏所有会员入口(VipContainer 返回 null, /vip 导航不渲染, Header 不显示"开通会员")
// - 跳过 PDF 导出 + AI 功能的额度校验,功能对所有用户开放
// - 后端 API 调用不变,后端自行决定是否计费
// 修改 .env 后需重启 dev server 或重新 build 生效。值大小写敏感: 仅 'false' 触发关闭。
export const VIP_ENABLED = process.env.UMI_APP_ENABLE_VIP !== 'false';

// AI 功能开关(AI 全文诊断 + AI 模块优化)。设为 false 时:
// - 隐藏所有 AI 入口(AiOpt、AiOptBtn 组件返回 null)
// - AI 相关 API 调用完全不会触发(入口不可见)
// 与 VIP_ENABLED 正交: AI 可单独开关,不受 VIP 影响。
// AI 额度校验(checkCount/optTokens)仅在 AI_ENABLED && VIP_ENABLED 同时为 true 时生效。
export const AI_ENABLED = process.env.UMI_APP_ENABLE_AI !== 'false';
