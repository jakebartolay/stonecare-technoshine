import { ErrorPage } from "./ErrorPage";

export default function Forbidden() {
  return (
    <ErrorPage
      code="403"
      eyebrow="Forbidden"
      title="Access to this page is restricted."
      message="The page exists, but the current request is not allowed to view it."
    />
  );
}
