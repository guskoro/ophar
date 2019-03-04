import { TEST_DISPATCH } from './types';

export const register = userData => {
  return {
    type: TEST_DISPATCH,
    payload: userData
  };
};
