import { IResumeData } from '@/pages/EditorOpt/ResumeInterface';

export const presetThemeColors = [
  '#ab3a41',
  '#a46624',
  '#8e833a',
  '#676e54',
  '#7e9c30',
  '#388f8f',
  '#487bc2',
  '#4c7e77',
  '#743a80',
  '#9c3c71',
];

export const getResumeTemplate = (): IResumeData => {
  return {
    id: 0,
    title: '',
    templateCode: '',
    dataTmp: 0,
    content: {
      title: '简历',
      avatar: {
        url: '',
        show: false,
        radius: 3,
        width: 100,
      },
      config: {
        lineSpace: 'space-y-2',
        themeColor: '#111',
        desc: '',
      },
      baseInfo: {
        title: '基础信息',
        list: [],
      },
      entryList: [],
      skill: {
        title: '技能特长',
        step: 10,
        list: [{ key: 'key', value: 5 }],
      },
      margin: {
        left: 20,
        right: 20,
        top: 30,
        bottom: 30,
      },
    },
  };
};

export const defaultResumeTags = [
  {
    value: '应届',
    label: '应届',
  },
  {
    value: '社招',
    label: '社招',
  },
  {
    value: '极简',
    label: '极简',
  },
  {
    value: '单页',
    label: '单页',
  },
  {
    value: '多页',
    label: '多页',
  },
  {
    value: '英文',
    label: '英文',
  },
];
