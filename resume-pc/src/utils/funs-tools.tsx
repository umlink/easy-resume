import { generateInviteCode, getInviteCode } from '@/api/Invite';
import { message } from 'antd';
import copy from 'copy-to-clipboard';

const assembleInviteUrl = (inviteCode: string) => {
  copy(`${location.origin}?inviteCode=${inviteCode}`);
  message.success('邀请链接已复制到粘贴板');
};

export const generateInviteUrl = async () => {
  await getInviteCode().then((res) => {
    if (res.success && res.data) {
      assembleInviteUrl(res.data);
    } else {
      generateInviteCode().then((res) => {
        if (res.success) {
          assembleInviteUrl(res.data);
        }
      });
    }
  });
};
