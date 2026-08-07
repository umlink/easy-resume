import { ROLES_ENUMS } from '@/constants/enums';
import { useModel } from '@umijs/max';

const AccessAdmin = (props: { children: JSX.Element }) => {
  const { initialState } = useModel('@@initialState');
  const isAdmin = initialState?.roles?.some((role) => [ROLES_ENUMS.ADMIN, ROLES_ENUMS.SUPER_ADMIN].includes(role));
  if (!isAdmin) {
    return null;
  }
  return props.children;
};

export default AccessAdmin;
