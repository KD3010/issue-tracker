import { AppDispatch, RootState } from "@/lib/store"
import { PayloadAction, UnknownAction } from "@reduxjs/toolkit"
import { IssueSchema, singleIssueSchema } from "@/lib/validation"
import axios from "axios"
import { z } from "zod"
import { TCreateIssue } from "@/lib/types"

type TSingleIssue = z.infer<typeof singleIssueSchema>
type TIssueList = z.infer<typeof IssueSchema>


export const initialState = {
    issueList: <any>[],
    issue: <any>{},
    issueLoading: <any>false,
}

export const reducer = (state = initialState, action: any) => {
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

export const resetIssue = (callbackFn: Function = () => {}) => (dispatch: AppDispatch) => {
    dispatch(fetchedSingleIssue(initialState.issue))
}

export const fetchAllIssues = (callbackFn: Function, filters?: any) => (dispatch: AppDispatch, getState: RootState) => {
    dispatch(fetchingIssues(true));
    const payload = () => {
        const data: any = {}
        if(filters?.search) {
            data["search"] = filters?.search;
        }
        if(filters?.reportedBy) {
            data["reportedBy"] = filters?.reportedBy;
        }
        if(filters?.assignedTo) {
            data["assignedTo"] = filters?.assignedTo
        }
        if(filters?.status) {
            data["status"] = filters?.status
        }
        if(filters?.project) {
            data["project"] = filters?.project
        }

        return data;
    }

    axios.get('/api/issues', { params: payload() })
      .then((response) => {
          dispatch(fetchedIssuesListSuccesfully(response.data.allIssues || []))
          callbackFn && callbackFn()
        }
      ).catch(error => {
        console.log("Error", error)
        callbackFn(error.message)
    }).finally(() => dispatch(fetchingIssues(false)));
}

export const fetchSingleIssue = (issueId: String, callbackFn: Function = () => {}) => (dispatch: AppDispatch) => {
    dispatch(fetchingIssues(true));
    axios.get(`/api/issues/${issueId}`)
    .then((response) => {
        dispatch(fetchedSingleIssue(response.data.singleIssue))
        callbackFn(response?.data?.message)
    })
    .catch((error) => callbackFn(error.message))
    .finally(() => dispatch(fetchingIssues(false)));
}

export const deleteIssue = (issueId: Number, callbackFn: Function) => () => {
    axios.delete(`/api/issues/${issueId}`)
    .then(response => callbackFn && callbackFn(response?.data?.message))
    .catch((error) => callbackFn && callbackFn(error.message));
}

export const updateIssue = (issueId: Number, data: TCreateIssue, callbackFn: Function) => (dispatch: AppDispatch) => {
    dispatch(fetchingIssues(true))
    axios.put(`/api/issues/${issueId}`, data)
    .then((response) => callbackFn && callbackFn(response))
    .catch(error => callbackFn && callbackFn('Could not update the issue. Please try later'))
    .finally(() => dispatch(fetchingIssues(false)))
}