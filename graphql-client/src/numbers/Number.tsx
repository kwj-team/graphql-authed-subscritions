import { useEffect, useState } from "react";
import {
  NumberIncrementedDocument,
  NumberIncrementedSubscription,
  useCurrentNumberQuery,
  useNumberIncrementedSubscription,
} from "../generated/graphql";

const QueryNumber = () => {
  const { data, loading, error } = useCurrentNumberQuery();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return <p>Query - {data?.currentNumber}</p>;
};

const PollingNumber = () => {
  const { data, loading, error } = useCurrentNumberQuery({
    pollInterval: 5000,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return <p>Poll every 5 sec- {data?.currentNumber}</p>;
};

const SubNumber = () => {
  const { data, loading, error, subscribeToMore } = useCurrentNumberQuery();

  useEffect(() => {
    subscribeToMore<NumberIncrementedSubscription>({
      document: NumberIncrementedDocument,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newNumber = subscriptionData.data.numberIncremented;
        return { currentNumber: newNumber };
      },
    });
  }, [subscribeToMore]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return <p>Subscribe query to changes - {data?.currentNumber}</p>;
};

const SubNumberNoUpdate = () => {
  const { data, loading, error } = useNumberIncrementedSubscription();


  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return <p>Event - {data?.numberIncremented}</p>;
};

export default function Number() {
  const [step, setStep] = useState(0);

  return (
    <div>
      <p>Pick example</p>
      <ol className="navigation">
        <li onClick={() => setStep(0)}>Query Number</li>
        <li onClick={() => setStep(1)}>Polling Number</li>
        <li onClick={() => setStep(2)}>Subscribe Number</li>
        <li onClick={() => setStep(3)}>Subscribe to event</li>
      </ol>
      <hr />
      {step === 0 && <QueryNumber />}
      {step === 1 && (
        <>
          <QueryNumber />
          <PollingNumber />
        </>
      )}
      {step === 2 && (
        <>
          <QueryNumber />
          <SubNumber />
        </>
      )}
      {step === 3 && (
        <>
          <QueryNumber />
          <SubNumberNoUpdate />
        </>
      )}
    </div>
  );
}
