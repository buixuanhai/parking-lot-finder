import * as type from "../actions/ui";
import produce from "immer";

const initialState = {};

export default produce((draft = initialState, action) => {
	switch (action.type) {
	default:
		return draft;
	}
});
