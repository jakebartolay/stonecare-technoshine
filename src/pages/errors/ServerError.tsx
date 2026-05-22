import { ErrorPage } from "./ErrorPage";

export default function ServerError() {
  return (
    <ErrorPage
      code="500"
      eyebrow="Server Error"
      title="Something went wrong on our side."
      message="The server encountered an unexpected issue. Please retry or return to the homepage."
    />
  );
}
