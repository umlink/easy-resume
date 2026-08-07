import { useClickAway } from 'ahooks';
import { Popover } from 'antd-mobile';
import { useRef, useState } from 'react';
import { FilledCalendar, LineCalendar } from './Calendar';
import { FilledContacts, LineContacts } from './Contacts';
import { FilledDegree, LineDegree } from './Degree';
import { FilledFacebook, LineFacebook } from './Facebook';
import { FilledGender, LineGender } from './Gender';
import { FilledGithub, LineGithub } from './Github';
import { FilledGitlab, LineGitlab } from './Gitlab';
import { FilledCity, LineCity } from './HomeCity';
import { FilledInstagram, LineInstagram } from './Instagram';
import { FilledLocation, LineLocation } from './Location';
import { FilledMail, LineMail } from './Mail';
import { FilledMoney, LineMoney } from './PayMoney';
import { FilledPhone, LinePhone } from './Phone';
import { FilledQQ, LineQQ } from './QQ';
import { FilledSchool, LineSchool } from './School';
import { FilledTelegram, LineTelegram } from './Telegram';
import { FilledTwitter, LineTwitter } from './Twitter';
import { FilledLink, LineLink } from './UrlLink';
import { FilledAge, LineAge } from './UserAge';
import { FilledWechat, LineWechat } from './Wechat';
import { FilledWorkJob, LineWorkJob } from './WorkJob';

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
  readOnly?: boolean;
  children: JSX.Element;
  onSelect: (key: string) => void;
};
export default (props: PropsType) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useClickAway(() => setOpen(false), ref);

  if (props.readOnly) return <span className={'flex'}>{props.children}</span>;

  const content = (
    <div className={'grid grid-cols-7 gap-[1px] text-[20px]'}>
      {Object.keys(IconsMap).map((key, index) => {
        const Icon = IconsMap[key];
        return (
          <span
            key={key + index}
            className={'flex cursor-pointer bg-zinc-50 p-2 text-zinc-700 hover:bg-zinc-200'}
            onClick={() => {
              props.onSelect?.(key);
              setOpen(false);
            }}
          >
            <Icon />
          </span>
        );
      })}
    </div>
  );
  return (
    <Popover visible={open} content={content} placement={'right'} trigger="click">
      <span
        ref={ref}
        className={'flex cursor-pointer outline-dashed outline-1 outline-offset-1 rounded outline-zinc-300 mr-1'}
        onClick={() => setOpen(!open)}
      >
        {props.children}
      </span>
    </Popover>
  );
};
