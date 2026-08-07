import { getResumeTemplate } from '@/constants/template-data';
import { IResumeData } from '@/interface/resume';
import { EditModeType } from '@/pages/components/QuillEditor';
import { createContext } from 'react';

type ResumeCtxType = {
  updatedKey?: number;
  resumeData: IResumeData;
  readOnly: boolean;
  contrastColor: string;
  updateResume: (v: IResumeData, immediately?: boolean) => void;
  toggleReadonly?: (v: boolean) => void;
  luma?: number;
  editMode?: EditModeType;
  updateEditMode?: (v: EditModeType) => void;
  editContentTitleId?: string;
  updateEditContentTitleId?: (v: string) => void;
};

const defaultData = getResumeTemplate();
export const ResumeDataContext = createContext<ResumeCtxType>({
  resumeData: defaultData,
  updateResume: (v) => console.log(v),
  contrastColor: '#111',
  readOnly: false,
  editMode: 'snow',
});
