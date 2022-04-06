import { gql } from "@apollo/client";

export const QUERY_NUMBERS = gql`
  query CurrentNumber {
    currentNumber
  }
`;

export const SUBSCRIBE_NUMBER = gql`
  subscription NumberIncremented {
    numberIncremented
  }
`;
