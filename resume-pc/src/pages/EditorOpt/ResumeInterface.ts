export type IContent = {
  id: string;
  title: string;
  subTitle: string;
  time: string;
  titleClass?: string[];
  subTitleClass?: string[];
  timeClass?: string[];
  content: string;
};

export interface IEntryItem {
  id: string;
  title: string;
  icon?: string;
  disabled?: boolean;
  contentList: IContent[];
}

export type BaseInfoItem = {
  id?: string;
  key: string;
  value: string;
  icon?: string;
};

export interface IResumeData {
  id: number;
  title: string;
  templateCode: string;
  dataTmp: number;
  content: {
    title: string;
    avatar: {
      url: string;
      show: boolean;
      width?: number;
      height?: number;
      radius?: number;
    };
    config: {
      lineSpace: string;
      lineHeight?: string;
      desc: string;
      showDesc?: boolean;
      themeColor: string;
      showEntryTitleIcon?: boolean;
      entryTitleMode?: string;
      entryTitleSize?: number;
      entryTitleTheme?: boolean;
      entryTitleBorderShade?: number;
    };
    baseInfo: {
      title: string;
      icon?: string;
      list: BaseInfoItem[];
    };
    entryList: IEntryItem[];
    skill: {
      title: string;
      show?: boolean;
      type?: string;
      size?: number;
      icon?: string;
      titleWarp?: boolean;
      direction?: 'row' | 'col';
      titleWidth?: number;
      step: number;
      list: { key: string; value: string | number }[];
    };
    margin: {
      left: number;
      right: number;
      top: number;
      bottom: number;
    };
  };
}
