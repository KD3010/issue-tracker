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
        case 'FETCH_SINGLE_ISSUE': 
            return {
                ...state,
                issue: action.payload
            }
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

const fetchedSingleIssue = (payload: TSingleIssue) => {
    return {
        type: 'FETCH_SINGLE_ISSUE',
        payload
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

export const fetchSingleIssue = (issueId: String, callbackFn: Function) => (dispatch: AppDispatch) => {
    dispatch(fetchingIssues(true));
    axios.get(`/api/issues/${issueId}`)
    .then((response) => dispatch(fetchedSingleIssue(response.data.singleIssue)))
    .catch((error) => callbackFn(error.message))
    .finally(() => fetchingIssues(false));
}

export const deleteIssue = (issueId: Number, callbackFn: Function) => () => {
    axios.delete(`/api/issues/${issueId}`)
    .then(response => callbackFn && callbackFn(response.data.message))
    .catch((error) => callbackFn && callbackFn(error.message));
}