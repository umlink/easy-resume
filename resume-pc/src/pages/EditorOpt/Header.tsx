import AccessAdmin from '@/components/AccessAdmin';
import { ReactComponent as LogoSvg } from '@/assets/common/logo.svg';
import VipContainer from '@/components/VipContainer';
import { PROJECT_TITLE } from '@/constants';
import { VIP_ENABLED } from '@/constants/feature-flags';
import { ResumeDataContext } from '@/context';
import { PageTemplate, User, WritingFluently } from '@icon-park/react';
import { history, useModel } from '@umijs/max';
import { Avatar, Input } from 'antd';
import React, { ChangeEvent, useContext } from 'react';

export default () => {
  const { initialState } = useModel('@@initialState');
  const { resumeData, updateResume } = useContext(ResumeDataContext);
  return (
    <div className={'sticky top-0 z-[99] h-[55px] bg-white/50 shadow backdrop-blur-sm'}>
      <div className={`mx-auto flex h-full max-w-[1200px] items-center justify-between space-x-4 px-4`}>
        <div className={'flex flex-1 items-center space-x-4'}>
          <div className={'flex cursor-pointer items-center space-x-2'} onClick={() => history.push('/')}>
            <LogoSvg className={'h-10 w-10'} />
            <b className={'hidden text-lg tracking-wide md:inline-block'}>{PROJECT_TITLE}</b>
          </div>
          <div className={'flex flex-1 items-center space-x-3'}>
            <Input
              size={'large'}
              placeholder={'请输入简历标题'}
              className={'w-[375px] max-w-[375px] py-[2px]'}
              value={resumeData.title}
              variant={'filled'}
              suffix={
                <span className={'text-zinc-400'}>
                  <WritingFluently theme="outline" size="18" />
                </span>
              }
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                resumeData.title = e.target.value;
                updateResume(resumeData);
              }}
            />
            {VIP_ENABLED && !initialState?.isVip && (
              <span className={'text-[14px] text-amber-500'}>
                欢迎使用轻简历，您可体验所有功能，但导出pdf需开通会员哦~
              </span>
            )}

            <AccessAdmin>
              <span>{resumeData.dataTmp > 0 && <PageTemplate theme="outline" size="16" fill="#333" />}</span>
            </AccessAdmin>
          </div>
        </div>
        <div className={'flex cursor-pointer items-center md:space-x-4'}>
          {initialState?.id && <VipContainer>开通会员</VipContainer>}
          <Avatar
            className={'!bg-zinc-50 shadow'}
            size={40}
            shape={'circle'}
            src={initialState?.avatar}
            onClick={() => history.push('/user')}
            icon={<User fill={'#333'} />}
          />
        </div>
      </div>
    </div>
  );
};
