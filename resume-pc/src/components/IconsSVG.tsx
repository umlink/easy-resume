import { FilledCalendar, LineCalendar } from '@/components/SvgIcons/Calendar';
import { FilledContacts, LineContacts } from '@/components/SvgIcons/Contacts';
import { FilledDegree, LineDegree } from '@/components/SvgIcons/Degree';
import { FilledFacebook, LineFacebook } from '@/components/SvgIcons/Facebook';
import { FilledGender, LineGender } from '@/components/SvgIcons/Gender';
import { FilledGithub, LineGithub } from '@/components/SvgIcons/Github';
import { FilledGitlab, LineGitlab } from '@/components/SvgIcons/Gitlab';
import { FilledCity, LineCity } from '@/components/SvgIcons/HomeCity';
import { FilledInstagram, LineInstagram } from '@/components/SvgIcons/Instagram';
import { FilledLocation, LineLocation } from '@/components/SvgIcons/Location';
import { FilledMail, LineMail } from '@/components/SvgIcons/Mail';
import { FilledMoney, LineMoney } from '@/components/SvgIcons/PayMoney';
import { FilledPhone, LinePhone } from '@/components/SvgIcons/Phone';
import { FilledQQ, LineQQ } from '@/components/SvgIcons/QQ';
import { FilledSchool, LineSchool } from '@/components/SvgIcons/School';
import { FilledTelegram, LineTelegram } from '@/components/SvgIcons/Telegram';
import { FilledTwitter, LineTwitter } from '@/components/SvgIcons/Twitter';
import { FilledLink, LineLink } from '@/components/SvgIcons/UrlLink';
import { FilledWechat, LineWechat } from '@/components/SvgIcons/Wechat';
import { FilledAge, LineAge } from '@/components/SvgIcons/UserAge';
import { FilledWorkJob, LineWorkJob } from '@/components/SvgIcons/WorkJob';
import { Popover } from 'antd';

export const IconsMap: Record<string, (props: any) => JSX.Element> = {
  FilledLocation,
  LineLocation,
  FilledMail,
  LineMail,
  FilledInstagram,
  LineInstagram,
  FilledGitlab,
  LineGitlab,
  FilledFacebook,
  LineFacebook,
  FilledTwitter,
  LineTwitter,
  FilledWechat,
  LineWechat,
  FilledSchool,
  LineSchool,
  FilledCity,
  LineCity,
  FilledPhone,
  LinePhone,
  FilledDegree,
  LineDegree,
  FilledContacts,
  LineContacts,
  FilledGithub,
  LineGithub,
  FilledQQ,
  LineQQ,
  FilledTelegram,
  LineTelegram,
  FilledAge,
  LineAge,
  FilledCalendar,
  LineCalendar,
  FilledMoney,
  LineMoney,
  FilledGender,
  LineGender,
  FilledLink,
  LineLink,
  FilledWorkJob,
  LineWorkJob,
};

type PropsType = {
  readOnly: boolean;
  children: JSX.Element;
  onSelect: (key: string) => void;
};
export default (props: PropsType) => {
  if (props.readOnly) return <span className={'flex'}>{props.children}</span>;
  const content = (
    <div className={'grid grid-cols-7 gap-[1px] text-[20px]'}>
      {Object.keys(IconsMap).map((key) => {
        const Icon = IconsMap[key];
        return (
          <span
            key={key}
            className={'flex cursor-pointer bg-zinc-50 p-2 text-zinc-700 hover:bg-zinc-200'}
            onClick={() => props.onSelect(key)}
          >
            <Icon />
          </span>
        );
      })}
    </div>
  );
  return (
    <Popover content={content} placement={'bottom'} trigger="hover">
      <span className={'flex cursor-pointer outline-dashed outline-1 outline-zinc-300'}>{props.children}</span>
    </Popover>
  );
};
