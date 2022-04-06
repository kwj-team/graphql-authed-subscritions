import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  __typename?: 'Query';
  currentNumber?: Maybe<Scalars['Int']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  numberIncremented?: Maybe<Scalars['Int']>;
};

export type CurrentNumberQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentNumberQuery = { __typename?: 'Query', currentNumber?: number | null };

export type NumberIncrementedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type NumberIncrementedSubscription = { __typename?: 'Subscription', numberIncremented?: number | null };


export const CurrentNumberDocument = gql`
    query CurrentNumber {
  currentNumber
}
    `;

/**
 * __useCurrentNumberQuery__
 *
 * To run a query within a React component, call `useCurrentNumberQuery` and pass it any options that fit your needs.
 * When your component renders, `useCurrentNumberQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCurrentNumberQuery({
 *   variables: {
 *   },
 * });
 */
export function useCurrentNumberQuery(baseOptions?: Apollo.QueryHookOptions<CurrentNumberQuery, CurrentNumberQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CurrentNumberQuery, CurrentNumberQueryVariables>(CurrentNumberDocument, options);
      }
export function useCurrentNumberLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CurrentNumberQuery, CurrentNumberQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CurrentNumberQuery, CurrentNumberQueryVariables>(CurrentNumberDocument, options);
        }
export type CurrentNumberQueryHookResult = ReturnType<typeof useCurrentNumberQuery>;
export type CurrentNumberLazyQueryHookResult = ReturnType<typeof useCurrentNumberLazyQuery>;
export type CurrentNumberQueryResult = Apollo.QueryResult<CurrentNumberQuery, CurrentNumberQueryVariables>;
export const NumberIncrementedDocument = gql`
    subscription NumberIncremented {
  numberIncremented
}
    `;

/**
 * __useNumberIncrementedSubscription__
 *
 * To run a query within a React component, call `useNumberIncrementedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useNumberIncrementedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNumberIncrementedSubscription({
 *   variables: {
 *   },
 * });
 */
export function useNumberIncrementedSubscription(baseOptions?: Apollo.SubscriptionHookOptions<NumberIncrementedSubscription, NumberIncrementedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<NumberIncrementedSubscription, NumberIncrementedSubscriptionVariables>(NumberIncrementedDocument, options);
      }
export type NumberIncrementedSubscriptionHookResult = ReturnType<typeof useNumberIncrementedSubscription>;
export type NumberIncrementedSubscriptionResult = Apollo.SubscriptionResult<NumberIncrementedSubscription>;