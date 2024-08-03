import { AppDispatch, RootState } from "@/lib/store"
import { PayloadAction, UnknownAction } from "@reduxjs/toolkit"
import { IssueSchema, singleIssueSchema } from "@/lib/validation"
import axios from "axios"
import { z } from "zod"

type TSingleIssue = z.infer<typeof singleIssueSchema>
type TIssueList = z.infer<typeof IssueSchema>

const initialState = {
    issueList: [],
    issue: {},
    issueLoading: false,
}

export const reducer = (state = initialState, action: PayloadAction) => {
    switch(action.type) {
        case 'FETCH_ALL_ISSUES':
            return {
                ...state,
                issueList: action.payload
            }
        case 'ISSUE_LOADING':
            return {
                ...state,
                issueLoading: action.payload
            }
        default:
            return state
    }
}

const fetchedIssuesListSuccesfully = (payload: TIssueList) => {
    return {
        type: 'FETCH_ALL_ISSUES',
        payload,
    }
}

const fetchingIssues = (payload: boolean) => {
    return {
        type: 'ISSUE_LOADING',
        payload
    }
}

export const fetchAllIssues = (errorCallback: Function) => (dispatch: AppDispatch, getState: RootState) => {
    dispatch(fetchingIssues(true));
    axios.get('/api/issues')
      .then((response) => {
          dispatch(fetchedIssuesListSuccesfully(response.data.allIssues || []))
        }
      ).catch(error => (
        errorCallback(error.message)
      )).finally(() => dispatch(fetchingIssues(false)));
}