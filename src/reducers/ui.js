import * as type from '../actions/ui';
import produce from 'immer';

const initialState = {};

export default produce((draft = initialState, action) => {
  switch (action.type) {
    case type.HOME_GET_LOCATION_SUCCESS:
      draft.location = action.payload;
      return draft;
    default:
      return draft;
  }
});
